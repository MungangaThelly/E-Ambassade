import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateBookingStatus } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'
import { getRequestLocale, getStatusText, serverT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  const locale = getRequestLocale(request)

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        {
          error: serverT(locale, 'api.notAuthenticated'),
        },
        {
          status: 401,
        }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        {
          error: serverT(locale, 'api.unauthorized'),
        },
        {
          status: 403,
        }
      )
    }

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        {
          error: serverT(locale, 'api.statusRequired'),
        },
        {
          status: 400,
        }
      )
    }

    const booking = await updateBookingStatus(params.id, status)

    const statusMessageMap = {
      confirmed: serverT(locale, 'api.bookingConfirmed'),
      cancelled: serverT(locale, 'api.bookingCancelled'),
      completed: serverT(locale, 'api.bookingCompleted'),
    }

    const message = statusMessageMap[status] || null

    if (message) {
      await createNotification({
        user_id: booking.user_id,
        title: serverT(locale, 'api.bookingStatusUpdated'),
        message,
      })

      if (process.env.RESEND_API_KEY) {
        try {
          const { getResend } = await import('@/lib/resend')
          const resend = getResend()

          let emailSubject = ''
          let emailTitle = ''
          let emailMessage = ''
          let color = 'darkblue'

          if (status === 'confirmed') {
            emailSubject = serverT(locale, 'email.statusConfirmedSubject')
            emailTitle = serverT(locale, 'email.statusConfirmedTitle')
            emailMessage = serverT(locale, 'email.statusConfirmedMessage')
            color = 'green'
          } else if (status === 'completed') {
            emailSubject = serverT(locale, 'email.statusCompletedSubject')
            emailTitle = serverT(locale, 'email.statusCompletedTitle')
            emailMessage = serverT(locale, 'email.statusCompletedMessage')
          } else if (status === 'cancelled') {
            emailSubject = serverT(locale, 'email.statusCancelledSubject')
            emailTitle = serverT(locale, 'email.statusCancelledTitle')
            emailMessage = serverT(locale, 'email.statusCancelledMessage')
            color = 'red'
          }

          const htmlContent = `
          <h1 style="color: white; background: ${color}; padding: 20px; margin: 0;">E-Ambassade</h1>
          <h2>${emailTitle}</h2>
          <p>${serverT(locale, 'email.greeting', { name: booking.full_name })}</p>
          <p>${emailMessage}</p>
          <hr />
          <p><strong>${serverT(locale, 'email.detailsTitle')}</strong></p>
          <ul>
            <li>${serverT(locale, 'email.serviceType')}: ${booking.service_type}</li>
            <li>${serverT(locale, 'email.date')}: ${booking.appointment_date}</li>
            <li>${serverT(locale, 'email.time')}: ${booking.appointment_time}</li>
            <li>${serverT(locale, 'email.status')}: ${getStatusText(locale, status)}</li>
          </ul>
          <p>${serverT(locale, 'email.regards')},<br/>E-Ambassade</p>
          `

          await resend.emails.send({
            from: 'noreply@e-ambassade.se',
            to: booking.email,
            subject: emailSubject,
            html: htmlContent,
          })
        } catch (emailError) {
          console.error(
            `[BOOKING_UPDATE] EMAIL SEND ERROR for ${status}:`,
            emailError?.message || emailError?.stack?.substring(0, 100)
          )
        }
      }
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('PATCH BOOKING ERROR:', error)

    return NextResponse.json(
      {
        error: error.message || serverT(locale, 'api.internalError'),
      },
      {
        status: 500,
      }
    )
  }
}
