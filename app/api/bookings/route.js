import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBooking, getBookings } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'
import { getRequestLocale, serverT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
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

    const body = await request.json()

    const booking = await createBooking({
      user_id: session.user.id,
      service_type: body.service_type,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      passport_number: body.passport_number,
      message: body.message ?? null,
      status: 'pending',
    })

    await createNotification({
      user_id: session.user.id,
      title: serverT(locale, 'api.bookingCreatedTitle'),
      message: serverT(locale, 'api.bookingCreatedMessage'),
    })

    if (process.env.RESEND_API_KEY) {
      try {
        const { getResend } = await import('@/lib/resend')
        const resend = getResend()

        const htmlContent = `
        <h1>${serverT(locale, 'email.confirmationHeading')}</h1>
        <p>${serverT(locale, 'email.greeting', { name: booking.full_name })}</p>
        <p>${serverT(locale, 'email.confirmationIntro')}</p>
        <hr />
        <p><strong>${serverT(locale, 'email.detailsTitle')}</strong></p>
        <ul>
          <li>${serverT(locale, 'email.serviceType')}: ${booking.service_type}</li>
          <li>${serverT(locale, 'email.date')}: ${booking.appointment_date}</li>
          <li>${serverT(locale, 'email.time')}: ${booking.appointment_time}</li>
          <li>${serverT(locale, 'email.email')}: ${booking.email}</li>
          <li>${serverT(locale, 'email.phone')}: ${booking.phone}</li>
        </ul>
        <p>${serverT(locale, 'email.seeYouSoon')}</p>
        `

        await resend.emails.send({
          from: 'noreply@e-ambassade.se',
          to: body.email,
          subject: serverT(locale, 'email.confirmationSubject'),
          html: htmlContent,
        })
      } catch (emailError) {
        console.error('[BOOKING] EMAIL SEND ERROR:', {
          message: emailError?.message,
          stack: emailError?.stack?.substring(0, 200),
          name: emailError?.name,
        })
      }
    }

    return NextResponse.json(
      booking,
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error('BOOKING ERROR:', error)

    if (error.message?.includes('Email not confirmed')) {
      return NextResponse.json(
        {
          error: serverT(locale, 'api.emailConfirmRequired'),
        },
        {
          status: 403,
        }
      )
    }

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

export async function GET(request) {
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

    const bookings = await getBookings(session.user.id)

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('GET BOOKINGS ERROR:', error)

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
