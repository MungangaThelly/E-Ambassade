'use client'

export default function AdminDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">
          Totala bokningar
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {stats.totalBookings}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">
          Väntande bokningar
        </h3>
        <p className="text-3xl font-bold text-yellow-600">
          {stats.pendingBookings}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">
          Genomförda bokningar
        </h3>
        <p className="text-3xl font-bold text-green-600">
          {stats.completedBookings}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 text-sm font-medium mb-2">
          Avbokade bokningar
        </h3>
        <p className="text-3xl font-bold text-red-600">
          {stats.cancelledBookings || 0}
        </p>
      </div>
    </div>
  )
}
