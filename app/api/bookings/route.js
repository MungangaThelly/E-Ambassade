import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBooking, getBookings } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function POST(request) {

  try {

    const session =
      await getServerSession(authOptions)


    if (!session?.user) {

      return NextResponse.json(
        {
          error:'Not authenticated'
        },
        {
          status:401
        }
      )

    }



    const body =
      await request.json()



    const booking =
      await createBooking({

        user_id:session.user.id,

        service_type:
          body.service_type,

        appointment_date:
          body.appointment_date,

        appointment_time:
          body.appointment_time,


        full_name:
          body.full_name,


        email:
          body.email,


        phone:
          body.phone,


        passport_number:
          body.passport_number,


        message:
          body.message ?? null,


        status:'pending'

      })




    // CREATE USER NOTIFICATION

    await createNotification({

      user_id:
        session.user.id,


      title:
        'Ny bokning skapad',


      message:
        'Din bokning har skickats och väntar på godkännande.'

    })


    // SEND CONFIRMATION EMAIL (Optional - non-blocking)

    if (process.env.RESEND_API_KEY) {

      try {

        const { resend } = await import('@/lib/resend')
        const BookingConfirmed = (await import('@/lib/emails/BookingConfirmed')).default

        await resend.emails.send({

          from: 'noreply@e-ambassade.se',

          to: body.email,

          subject: 'Bokningsbekräftelse - E-Ambassade',

          react: <BookingConfirmed booking={booking} />

        })

      } catch(emailError) {

        // Log but don't block booking
        console.error('EMAIL SEND ERROR:', emailError?.message || emailError)

      }

    }


    return NextResponse.json(
      booking,
      {
        status:201
      }
    )



  } catch(error) {


    console.error(
      'BOOKING ERROR:',
      error
    )


    // Handle email confirmation requirement
    if (error.message?.includes('Email not confirmed')) {

      return NextResponse.json(
        {
          error: 'Vänligen bekräfta din e-postadress innan du gör en bokning. Kontrollera din e-post för en bekräftelselänk.'
        },
        {
          status: 403
        }
      )

    }


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )

  }

}





// GET BOOKINGS FOR DASHBOARD

export async function GET() {


  try {


    const session =
      await getServerSession(authOptions)



    if (!session?.user) {


      return NextResponse.json(
        {
          error:'Not authenticated'
        },
        {
          status:401
        }
      )


    }



    const bookings =
      await getBookings(
        session.user.id
      )



    return NextResponse.json(
      bookings
    )



  } catch(error) {


    console.error(
      'GET BOOKINGS ERROR:',
      error
    )



    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )


  }


}