'use client'

import { useState } from 'react'
import axios from 'axios'
import { useLanguage } from '@/lib/i18n/language-context'

export default function BookingStatus({ booking }) {
  const [status, setStatus] = useState(booking.status)
  const [loading, setLoading] = useState(false)
  const { t, dateLocale, locale } = useLanguage()

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const localizedStatus = {
    pending: t('booking.status.pending'),
    confirmed: t('booking.status.confirmed'),
    completed: t('booking.status.completed'),
    cancelled: t('booking.status.cancelled'),
  }

  async function handleCancel() {
    if (!confirm(t('booking.confirmCancel'))) {
      return
    }

    setLoading(true)

    try {
      await axios.patch(
        `/api/bookings/${booking.id}`,
        {
          status: 'cancelled',
        },
        {
          headers: {
            'x-locale': locale,
          },
        }
      )

      setStatus('cancelled')
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      alert(error.response?.data?.error || t('booking.cancelFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {booking.service_type}
          </h3>

          <p className="text-gray-600">
            {new Date(booking.appointment_date).toLocaleDateString(dateLocale)} {t('booking.at')}{' '}
            {booking.appointment_time}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {booking.full_name}
          </p>

          <p className="text-sm text-gray-500">
            {booking.email}
          </p>

          <p className="text-sm text-gray-500">
            {booking.phone}
          </p>

          <p className="text-sm text-gray-500">
            {t('booking.passportLabel')}: {booking.passport_number}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {localizedStatus[status] || status}
        </span>
      </div>

      {booking.message && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>{t('booking.notesLabel')}:</strong> {booking.message}
          </p>
        </div>
      )}

      {status === 'pending' && (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? t('booking.canceling') : t('booking.cancel')}
        </button>
      )}
    </div>
  )
}