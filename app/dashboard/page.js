'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getBookings } from '@/lib/bookings'
import BookingStatus from '@/components/BookingStatus'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchBookings()
    }
  }, [session])

  async function fetchBookings() {
    try {
      const data = await getBookings(session.user.id)
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Laddar...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mina bokningar</h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Du har inga bokningar än</p>
          <a href="/booking" className="text-blue-600 hover:underline">
            Gör en bokning
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <BookingStatus key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
