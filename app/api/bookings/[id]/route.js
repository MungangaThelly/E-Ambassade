import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateBookingStatus, getBookings } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'
import { resend } from '@/lib/resend'
import BookingConfirmed from '@/lib/emails/BookingConfirmed'
import BookingCompleted from '@/lib/emails/BookingCompleted'
import BookingCancelled from '@/lib/emails/BookingCancelled'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {

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



    // Only admin can change booking status

    if(session.user.role !== 'admin'){

      return NextResponse.json(
        {
          error:'Unauthorized'
        },
        {
          status:403
        }
      )

    }



    const {
      status
    } =
    await request.json()



    if(!status){

      return NextResponse.json(
        {
          error:'Status is required'
        },
        {
          status:400
        }
      )

    }




    const booking =
      await updateBookingStatus(
        params.id,
        status
      )





    let message = null



    switch(status){

      case 'confirmed':

        message =
        'Din bokning har blivit bekräftad.'

        break



      case 'cancelled':

        message =
        'Din bokning har blivit avbokad.'

        break



      case 'completed':

        message =
        'Din bokning är markerad som genomförd.'

        break


    }





    if(message){


      await createNotification({

        user_id:
          booking.user_id,


        title:
          'Bokningsstatus uppdaterad',


        message

      })


      // SEND STATUS UPDATE EMAIL
      if (process.env.RESEND_API_KEY) {
        try {
          console.log(`[BOOKING_UPDATE] Sending ${status} email to ${booking.email}`)
          
          let emailTemplate = null
          let emailSubject = ''

          if(status === 'confirmed') {
            emailTemplate = BookingConfirmed({ booking })
            emailSubject = 'Bokning bekräftad - E-Ambassade'
          } else if(status === 'completed') {
            emailTemplate = BookingCompleted({ booking })
            emailSubject = 'Bokning genomförd - E-Ambassade'
          } else if(status === 'cancelled') {
            emailTemplate = BookingCancelled({ booking })
            emailSubject = 'Bokning avbokad - E-Ambassade'
          }

          if(emailTemplate) {
            const emailResult = await resend.emails.send({
              from: 'noreply@e-ambassade.se',
              to: booking.email,
              subject: emailSubject,
              react: emailTemplate
            })
            console.log(`[BOOKING_UPDATE] ${status.toUpperCase()} email sent successfully:`, emailResult.id)
          }
        } catch(emailError) {
          console.error(
            `[BOOKING_UPDATE] EMAIL SEND ERROR for ${status}:`,
            emailError?.message || emailError,
            emailError
          )
        }
      } else {
        console.log(`[BOOKING_UPDATE] RESEND_API_KEY not set - ${status} email not sent`)
      }


    }




    return NextResponse.json(
      booking
    )



  } catch(error) {


    console.error(
      'PATCH BOOKING ERROR:',
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