import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createNotification } from '@/lib/notifications'
import { resend } from '@/lib/resend'


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







    // SEND EMAIL USING RESEND
    if (
      status === 'confirmed' ||
      status === 'cancelled'
    ) {


      try {


        const subject =
          status === 'confirmed'
            ? 'Booking confirmed - E-Ambassade'
            : 'Booking cancelled - E-Ambassade'



        const html =
          status === 'confirmed'
            ? `

              <h2>Hello ${booking.full_name}</h2>

              <p>
                Your booking has been confirmed.
              </p>


              <p>
                <strong>Service:</strong>
                ${booking.service_type}
              </p>


              <p>
                <strong>Date:</strong>
                ${booking.appointment_date}
              </p>


              <p>
                <strong>Time:</strong>
                ${booking.appointment_time}
              </p>


              <p>
                Thank you.
              </p>

            `
            :
            `

              <h2>Hello ${booking.full_name}</h2>


              <p>
                Your booking has been cancelled.
              </p>


              <p>
                <strong>Service:</strong>
                ${booking.service_type}
              </p>


              <p>
                If you have questions, please contact us.
              </p>

            `





        await resend.emails.send({

          from:
            'E-Ambassade <noreply@e-ambassade.nuhar.se>',


          to:
            booking.email,


          subject,


          html

        })



      } catch(emailError) {


        console.error(
          'RESEND EMAIL ERROR:',
          emailError
        )

        // Booking update remains successful
        // even if email fails

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