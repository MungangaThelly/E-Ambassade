import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createNotification } from '@/lib/notifications'
import { getResend } from '@/lib/resend'


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
    } =
      await supabaseAdmin
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
        status:500
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
          error:'Status required'
        },
        {
          status:400
        }
      )

    }





    // Get booking first
    const {
      data: booking,
      error: bookingError
    }
    =
    await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()



    if(bookingError){
      throw bookingError
    }







    // Update booking
    const {
      data: updatedBooking,
      error:updateError
    }
    =
    await supabaseAdmin
      .from('bookings')
      .update({

        status,

        updated_at:
          new Date().toISOString()

      })
      .eq('id',id)
      .select()
      .single()



    if(updateError){
      throw updateError
    }







    // Notification
    let title = ''
    let message = ''



    if(status === 'confirmed'){

      title =
        'Bokning bekräftad'

      message =
        `Din bokning för ${booking.service_type} har bekräftats.`

    }



    if(status === 'cancelled'){

      title =
        'Bokning avbokad'

      message =
        `Din bokning för ${booking.service_type} har avbokats.`

    }



    if(status === 'completed'){

      title =
        'Bokning slutförd'

      message =
        `Din bokning för ${booking.service_type} är klar.`

    }





    if(title){

      await createNotification({

        user_id:
          booking.user_id,

        title,

        message

      })

    }







    // SEND EMAIL WITH RESEND

    if(
      process.env.RESEND_API_KEY &&
      [
        'confirmed',
        'cancelled',
        'completed'
      ].includes(status)
    ){

      try {


        console.log(
          '[EMAIL] Sending email to:',
          booking.email
        )


        const resend =
          getResend()



        let subject = ''



        if(status === 'confirmed'){

          subject =
            'Bokning bekräftad - E-Ambassade'

        }


        if(status === 'cancelled'){

          subject =
            'Bokning avbokad - E-Ambassade'

        }


        if(status === 'completed'){

          subject =
            'Bokning genomförd - E-Ambassade'

        }





        const result =
          await resend.emails.send({

            from:
              'E-Ambassade <noreply@e-ambassade.nuhar.se>',

            to:
              booking.email,

            subject,

            html: `

              <h1>
                E-Ambassade
              </h1>


              <p>
                Hej ${booking.full_name}
              </p>


              <p>
                Din bokningsstatus är:
                <strong>
                  ${status}
                </strong>
              </p>


              <p>
                Tjänst:
                ${booking.service_type}
                <br/>

                Datum:
                ${booking.appointment_date}
                <br/>

                Tid:
                ${booking.appointment_time}
              </p>


              <p>
                Med vänlig hälsning,
                <br/>
                E-Ambassade
              </p>

            `

          })



        console.log(
          '[EMAIL] RESEND RESPONSE:',
          JSON.stringify(result, null, 2)
        )


      }
      catch(emailError){

        console.error(
          '[EMAIL] ERROR:',
          emailError?.message || emailError
        )

      }

    }







    return NextResponse.json(
      updatedBooking
    )




  }
  catch(error){


    console.error(
      'ADMIN BOOKING UPDATE ERROR:',
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