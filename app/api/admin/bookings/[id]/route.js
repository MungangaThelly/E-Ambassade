import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createNotification } from '@/lib/notifications'
import { getResend } from '@/lib/resend'
import { getRequestLocale, getStatusText, serverT } from '@/lib/i18n/server'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const locale = getRequestLocale(request)

  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        {
          error: serverT(locale, 'api.unauthorized'),
        },
        {
          status: 403,
        }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET BOOKING ERROR:', error)

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

export async function PATCH(request, { params }) {
  const locale = getRequestLocale(request)

  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
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

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (bookingError) {
      throw bookingError
    }

    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    const statusMessageMap = {
      confirmed: serverT(locale, 'api.bookingConfirmed'),
      cancelled: serverT(locale, 'api.bookingCancelled'),
      completed: serverT(locale, 'api.bookingCompleted'),
    }

    const notificationMessage = statusMessageMap[status]

    if (notificationMessage) {
      await createNotification({
        user_id: booking.user_id,
        title: serverT(locale, 'api.bookingStatusUpdated'),
        message: notificationMessage,
      })
    }

    if (process.env.RESEND_API_KEY && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      try {
        const resend = getResend()

        let subject = ''
        let title = ''
        let intro = ''

        if (status === 'confirmed') {
          subject = serverT(locale, 'email.statusConfirmedSubject')
          title = serverT(locale, 'email.statusConfirmedTitle')
          intro = serverT(locale, 'email.statusConfirmedMessage')
        }

        if (status === 'cancelled') {
          subject = serverT(locale, 'email.statusCancelledSubject')
          title = serverT(locale, 'email.statusCancelledTitle')
          intro = serverT(locale, 'email.statusCancelledMessage')
        }

        if (status === 'completed') {
          subject = serverT(locale, 'email.statusCompletedSubject')
          title = serverT(locale, 'email.statusCompletedTitle')
          intro = serverT(locale, 'email.statusCompletedMessage')
        }

        await resend.emails.send({
          from: 'E-Ambassade <noreply@e-ambassade.nuhar.se>',
          to: booking.email,
          subject,
          html: `
            <h1>E-Ambassade</h1>
            <h2>${title}</h2>
            <p>${serverT(locale, 'email.greeting', { name: booking.full_name })}</p>
            <p>${intro}</p>
            <p>
              ${serverT(locale, 'email.status')}: <strong>${getStatusText(locale, status)}</strong>
            </p>
            <p>
              ${serverT(locale, 'email.serviceType')}: ${booking.service_type}<br/>
              ${serverT(locale, 'email.date')}: ${booking.appointment_date}<br/>
              ${serverT(locale, 'email.time')}: ${booking.appointment_time}
            </p>
            <p>${serverT(locale, 'email.regards')},<br/>E-Ambassade</p>
          `,
        })
      } catch (emailError) {
        console.error('[EMAIL] ERROR:', emailError?.message || emailError)
      }
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('ADMIN BOOKING UPDATE ERROR:', error)

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
