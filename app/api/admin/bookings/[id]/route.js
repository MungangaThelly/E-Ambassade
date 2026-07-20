import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createNotification } from '@/lib/notifications'
import { resend } from '@/lib/resend'

import BookingConfirmed from '@/lib/emails/BookingConfirmed'
import BookingCancelled from '@/lib/emails/BookingCancelled'
import BookingCompleted from '@/lib/emails/BookingCompleted'


// GET SINGLE BOOKING
export const dynamic = 'force-dynamic'


export async function GET(
  request,
  { params }
) {

  try {

    const { id } = await params


    const session =
      await getServerSession(authOptions)


    if (
      !session?.user ||
      session.user.role !== 'admin'
    ) {

      return NextResponse.json(
        {
          error: 'Unauthorized'
        },
        {
          status: 403
        }
      )

    }


    const {
      data,
      error
    } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq(
        'id',
        id
      )
      .single()


    if (error) {
      throw error
    }


    return NextResponse.json(data)


  } catch(error) {

    console.error(
      'GET BOOKING ERROR:',
      error
    )


    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    )

  }

}





// UPDATE BOOKING STATUS
export async function PATCH(
  request,
  { params }
) {

  try {

    const { id } = await params


    const session =
      await getServerSession(authOptions)


    if (
      !session?.user ||
      session.user.role !== 'admin'
    ) {

      return NextResponse.json(
        {
          error: 'Unauthorized'
        },
        {
          status: 403
        }
      )

    }



    const {
      status
    } = await request.json()



    if (!status) {

      return NextResponse.json(
        {
          error: 'Status required'
        },
        {
          status: 400
        }
      )

    }





    // Get existing booking
    const {
      data: booking,
      error: bookingError

    } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq(
        'id',
        id
      )
      .single()



    if (bookingError) {
      throw bookingError
    }





    // Update booking
    const {
      data: updatedBooking,
      error: updateError

    } = await supabaseAdmin
      .from('bookings')
      .update({

        status,

        updated_at:
          new Date().toISOString()

      })
      .eq(
        'id',
        id
      )
      .select()
      .single()



    if (updateError) {
      throw updateError
    }





    // Create notification
    let title = ''
    let message = ''



    if (status === 'confirmed') {

      title =
        'Bokning bekräftad'


      message =
        `Din bokning för ${booking.service_type} har bekräftats.`

    }



    if (status === 'cancelled') {

      title =
        'Bokning avbokad'


      message =
        `Din bokning för ${booking.service_type} har avbokats.`

    }



    if (status === 'completed') {

      title =
        'Bokning slutförd'


      message =
        `Din bokning för ${booking.service_type} är klar.`

    }





    if (title) {

      await createNotification({

        user_id:
          booking.user_id,

        title,

        message

      })

    }







    // SEND EMAIL USING RESEND (Optional - only if API key configured)
    if (
      process.env.RESEND_API_KEY &&
      [
        'confirmed',
        'cancelled',
        'completed'
      ].includes(status)
    ) {

      try {

        let EmailComponent = null
        let subject = ''


        switch (status) {


          case 'confirmed':

            EmailComponent =
              BookingConfirmed

            subject =
              'Bokning bekräftad - E-Ambassade'

            break



          case 'cancelled':

            EmailComponent =
              BookingCancelled

            subject =
              'Bokning avbokad - E-Ambassade'

            break



          case 'completed':

            EmailComponent =
              BookingCompleted

            subject =
              'Bokning genomförd - E-Ambassade'

            break


        }



        if (EmailComponent) {

          await resend.emails.send({

            from:
              'noreply@e-ambassade.se',


            to:
              booking.email,

            subject:
              subject,

            react: <EmailComponent booking={booking} />

          })

        }

      } catch(emailError) {

        // Log but don't block status update
        console.error(
          'RESEND EMAIL ERROR:',
          emailError?.message || emailError
        )


      }

    }


    return NextResponse.json(
      updatedBooking
    )



  } catch(error) {


    console.error(
      'ADMIN BOOKING UPDATE ERROR:',
      error
    )


    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    )


  }

}