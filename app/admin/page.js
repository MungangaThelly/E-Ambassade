'use client'

import { useEffect, useState } from 'react'
import { getAllBookings } from '@/lib/bookings'
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
      const bookingsData = await getAllBookings()
      setBookings(bookingsData)

      const totalBookings = bookingsData.length
      const pendingBookings = bookingsData.filter(b => b.status === 'pending').length
      const completedBookings = bookingsData.filter(b => b.status === 'completed').length

      setStats({
        totalBookings,
        pendingBookings,
        completedBookings,
        totalUsers: 0,
        activeUsers: 0,
      })
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
