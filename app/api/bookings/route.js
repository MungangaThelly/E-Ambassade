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
        console.log('[BOOKING] RESEND_API_KEY is set, attempting to send confirmation email')
        
        const { getResend } = await import('@/lib/resend')
        console.log('[BOOKING] getResend imported successfully')
        
        const resend = getResend()
        console.log('[BOOKING] Resend instance retrieved')
        
        // Use simple HTML instead of React component for now
        const htmlContent = `
        <h1>Bokningsbekräftelse</h1>
        <p>Hej ${booking.full_name},</p>
        <p>Din bokning har bekräftats!</p>
        <hr />
        <p><strong>Bokningsdetaljer:</strong></p>
        <ul>
          <li>Tjänsttyp: ${booking.service_type}</li>
          <li>Datum: ${booking.appointment_date}</li>
          <li>Tid: ${booking.appointment_time}</li>
          <li>E-post: ${booking.email}</li>
          <li>Telefon: ${booking.phone}</li>
        </ul>
        <p>Vi ses snart!</p>
        `
        
        const emailResult = await resend.emails.send({
          from: 'noreply@e-ambassade.se',
          to: body.email,
          subject: 'Bokningsbekräftelse - E-Ambassade',
          html: htmlContent
        })
        
        console.log('[BOOKING] Confirmation email sent successfully, ID:', emailResult?.id)
      } catch(emailError) {
        console.error('[BOOKING] EMAIL SEND ERROR:', {
          message: emailError?.message,
          stack: emailError?.stack?.substring(0, 200),
          name: emailError?.name
        })
      }
    } else {
      console.log('[BOOKING] RESEND_API_KEY not set - email not sent')
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