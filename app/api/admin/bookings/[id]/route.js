import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createNotification } from '@/lib/notifications'
import { getResend } from '@/lib/resend'

import BookingConfirmed from '@/lib/emails/BookingConfirmed'
import BookingCancelled from '@/lib/emails/BookingCancelled'
import BookingCompleted from '@/lib/emails/BookingCompleted'


export const dynamic = 'force-dynamic'


// GET SINGLE BOOKING
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
      .eq('id', id)
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




    // Get current booking
    const {
      data: booking,
      error: bookingError
    } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()



    if (updateError) {
      throw updateError
    }





    // Create notification

    let title = ''
    let message = ''



    switch(status) {

      case 'confirmed':

        title =
          'Bokning bekräftad'

        message =
          `Din bokning för ${booking.service_type} har bekräftats.`

        break



      case 'cancelled':

        title =
          'Bokning avbokad'

        message =
          `Din bokning för ${booking.service_type} har avbokats.`

        break



      case 'completed':

        title =
          'Bokning slutförd'

        message =
          `Din bokning för ${booking.service_type} är klar.`

        break

    }





    if(title) {

      await createNotification({

        user_id:
          booking.user_id,

        title,

        message

      })

    }





    // SEND EMAIL

    if (
      process.env.RESEND_API_KEY &&
      [
        'confirmed',
        'cancelled',
        'completed'
      ].includes(status)
    ) {


      try {


        const resend =
          getResend()



        let EmailComponent = null
        let subject = ''



        switch(status) {


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




        if(EmailComponent) {


          const result =
            await resend.emails.send({

              from:
                'noreply@e-ambassade.se',

              to:
                booking.email,

              subject,

              react:
                <EmailComponent booking={booking} />

            })



          console.log(
            'RESEND EMAIL SENT:',
            result?.id
          )


        }



      } catch(emailError) {


        console.error(
          'RESEND EMAIL ERROR:',
          emailError?.message || emailError
        )


      }

    } else {

      console.log(
        'RESEND_API_KEY missing or invalid status'
      )

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