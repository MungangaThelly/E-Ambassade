import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllBookings } from '@/lib/bookings'


export async function GET(){

  try {

    const session =
      await getServerSession(authOptions)


    if(
      !session ||
      session.user.role !== 'admin'
    ){

      return NextResponse.json(
        {
          error:'Unauthorized'
        },
        {
          status:401
        }
      )

    }


    const bookings =
      await getAllBookings()


    return NextResponse.json(
      bookings
    )


  } catch(error){

    console.error(
      'ADMIN BOOKINGS ERROR:',
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