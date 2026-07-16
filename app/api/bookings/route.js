import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBooking, getBookings } from '@/lib/bookings'


export async function POST(request) {

  try {

    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }


    const body = await request.json()


    const booking = await createBooking({

      user_id: session.user.id,

      appointment_date: body.date,

      appointment_time: body.time,

      service_type: body.serviceType,

      message: body.notes || null,

      status: 'pending'

    })


    return NextResponse.json(
      booking,
      { status: 201 }
    )


  } catch(error) {

    console.error(error)

    return NextResponse.json(
      { error: error.message },
      { status:500 }
    )

  }

}



export async function GET() {

  try {

    const session = await getServerSession(authOptions)


    if (!session?.user) {

      return NextResponse.json(
        { error:'Not authenticated' },
        { status:401 }
      )

    }


    const bookings = await getBookings(session.user.id)


    return NextResponse.json(bookings)


  } catch(error) {

    console.error(error)

    return NextResponse.json(
      { error:error.message },
      { status:500 }
    )

  }

}