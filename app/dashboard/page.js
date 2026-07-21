'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import BookingStatus from '@/components/BookingStatus'
import { useLanguage } from '@/lib/i18n/language-context'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && session?.user?.id) {
      fetchBookings()
    }
  }, [hydrated, session])

  async function fetchBookings() {
    try {
      const response = await fetch('/api/bookings')
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated || loading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.myBookings')}</h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">{t('dashboard.emptyBookings')}</p>
          <a href="/booking" className="text-blue-600 hover:underline">
            {t('dashboard.createBooking')}
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
