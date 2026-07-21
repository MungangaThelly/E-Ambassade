'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export default function AdminDashboard({
  stats,
  bookings = []
}) {
  const { t } = useLanguage()

  const statusLabels = {
    pending: t('booking.status.pending'),
    confirmed: t('booking.status.confirmed'),
    completed: t('booking.status.completed'),
    cancelled: t('booking.status.cancelled'),
  }

  return (

    <div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


        <Card
          title={t('admin.totalBookings')}
          value={stats.totalBookings}
          color="text-gray-900"
        />


        <Card
          title={t('admin.pendingBookings')}
          value={stats.pendingBookings}
          color="text-yellow-600"
        />


        <Card
          title={t('admin.confirmedBookings')}
          value={stats.confirmedBookings || 0}
          color="text-blue-600"
        />


        <Card
          title={t('admin.completedBookings')}
          value={stats.completedBookings}
          color="text-green-600"
        />


        <Card
          title={t('admin.cancelledBookings')}
          value={stats.cancelledBookings || 0}
          color="text-red-600"
        />


      </div>




      {/* RECENT BOOKINGS */}

      <div className="bg-white rounded-lg shadow p-6">


        <h2 className="text-xl font-bold mb-6">
          {t('admin.recentBookings')}
        </h2>



        {
          bookings.length === 0 ? (

            <p className="text-gray-500">
              {t('admin.noBookingsYet')}
            </p>

          ) : (

            <div className="overflow-x-auto">


              <table className="w-full">


                <thead>

                  <tr className="border-b">


                    <th className="text-left p-3">
                      {t('admin.name')}
                    </th>


                    <th className="text-left p-3">
                      {t('admin.service')}
                    </th>


                    <th className="text-left p-3">
                      {t('admin.date')}
                    </th>


                    <th className="text-left p-3">
                      {t('admin.status')}
                    </th>


                  </tr>

                </thead>



                <tbody>


                {
                  bookings.map((booking)=>(


                    <tr
                      key={booking.id}
                      className="border-b"
                    >


                      <td className="p-3">

                        {booking.full_name}

                      </td>


                      <td className="p-3">

                        {booking.service_type}

                      </td>


                      <td className="p-3">

                        {booking.appointment_date}

                      </td>


                      <td className="p-3">

                        <span className="
                          px-3
                          py-1
                          rounded-full
                          bg-gray-100
                          text-sm
                        ">

                          {statusLabels[booking.status] || booking.status}

                        </span>

                      </td>


                    </tr>


                  ))
                }


                </tbody>


              </table>


            </div>

          )

        }


      </div>


    </div>

  )

}




function Card({
  title,
  value,
  color
}) {

  return (

    <div className="bg-white rounded-lg shadow p-6">


      <h3 className="text-gray-500 text-sm font-medium mb-2">

        {title}

      </h3>



      <p className={`text-3xl font-bold ${color}`}>

        {value}

      </p>


    </div>

  )

}