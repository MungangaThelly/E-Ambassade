import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBooking, getBookings, getAllBookings } from '@/lib/bookings'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role === 'admin') {
      const bookings = await getAllBookings()
      return NextResponse.json(bookings)
    }

    const bookings = await getBookings(session.user.id)
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('GET /api/bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const booking = {
      user_id: session.user.id,
      date: body.date,
      time: body.time,
      service_type: body.serviceType,
      status: 'pending',
      notes: body.notes,
    }

    const newBooking = await createBooking(booking)
    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error('POST /api/bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
