'use client'

import { useEffect, useState } from 'react'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  async function fetchAdminData() {
    try {
      const response = await fetch('/api/admin')
      if (!response.ok) {
        throw new Error('Failed to fetch admin data')
      }

      const data = await response.json()
      setBookings(data.bookings || [])
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Laddar...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {stats && <AdminDashboard stats={stats} />}
    </div>
  )
}
