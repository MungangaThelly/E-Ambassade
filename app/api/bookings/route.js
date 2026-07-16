import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBooking, getBookings } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'


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