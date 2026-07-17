import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateBookingStatus } from '@/lib/bookings'
import { createNotification } from '@/lib/notifications'


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