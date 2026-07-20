import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateBookingStatus, getBookings } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'

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
          const { getResend } = await import('@/lib/resend')
          const resend = getResend()
          
          let emailSubject = ''
          let emailTitle = ''
          let emailMessage = ''
          let colorClass = 'bg-blue-900'

          if(status === 'confirmed') {
            emailSubject = 'Bokning bekräftad - E-Ambassade'
            emailTitle = 'Din bokning är bekräftad!'
            emailMessage = 'Vi ser fram emot att träffa dig på det planerade tillfället.'
            colorClass = 'bg-green-900'
          } else if(status === 'completed') {
            emailSubject = 'Bokning genomförd - E-Ambassade'
            emailTitle = 'Tack för mötet!'
            emailMessage = 'Vi hoppas vi fick en bra kontakt med dig. Kontakta oss gärna igen.'
            colorClass = 'bg-blue-900'
          } else if(status === 'cancelled') {
            emailSubject = 'Bokning avbokad - E-Ambassade'
            emailTitle = 'Din bokning har avbokats'
            emailMessage = 'Din tidigare bokning är nu avbokad. Tveka inte att kontakta oss om du vill boka ett nytt tillfälle.'
            colorClass = 'bg-red-900'
          }

          const htmlContent = `
          <h1 style="color: white; background: ${colorClass === 'bg-green-900' ? 'green' : colorClass === 'bg-red-900' ? 'red' : 'darkblue'}; padding: 20px; margin: 0;">E-Ambassade</h1>
          <h2>${emailTitle}</h2>
          <p>Hej ${booking.full_name},</p>
          <p>${emailMessage}</p>
          <hr />
          <p><strong>Bokningsdetaljer:</strong></p>
          <ul>
            <li>Tjänsttyp: ${booking.service_type}</li>
            <li>Datum: ${booking.appointment_date}</li>
            <li>Tid: ${booking.appointment_time}</li>
            <li>Status: ${status}</li>
          </ul>
          <p>Med vänlig hälsning,<br/>E-Ambassade</p>
          `

          const emailResult = await resend.emails.send({
            from: 'noreply@e-ambassade.se',
            to: booking.email,
            subject: emailSubject,
            html: htmlContent
          })
          console.log(`[BOOKING_UPDATE] ${status.toUpperCase()} email sent successfully, ID:`, emailResult?.id)
        } catch(emailError) {
          console.error(
            `[BOOKING_UPDATE] EMAIL SEND ERROR for ${status}:`,
            emailError?.message || emailError?.stack?.substring(0, 100)
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