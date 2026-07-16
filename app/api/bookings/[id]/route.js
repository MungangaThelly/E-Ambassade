import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateBookingStatus } from '@/lib/bookings'

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const booking = await updateBookingStatus(
      params.id,
      status
    )

    return NextResponse.json(booking)

  } catch (error) {
    console.error('PATCH BOOKING ERROR:', error)

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