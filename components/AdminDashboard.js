'use client'

export default function AdminDashboard({
  stats,
  bookings = []
}) {

  return (

    <div>


      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


        <Card
          title="Totala bokningar"
          value={stats.totalBookings}
          color="text-gray-900"
        />


        <Card
          title="Väntande bokningar"
          value={stats.pendingBookings}
          color="text-yellow-600"
        />


        <Card
          title="Bekräftade bokningar"
          value={stats.confirmedBookings || 0}
          color="text-blue-600"
        />


        <Card
          title="Genomförda bokningar"
          value={stats.completedBookings}
          color="text-green-600"
        />


        <Card
          title="Avbokade bokningar"
          value={stats.cancelledBookings || 0}
          color="text-red-600"
        />


      </div>




      {/* RECENT BOOKINGS */}

      <div className="bg-white rounded-lg shadow p-6">


        <h2 className="text-xl font-bold mb-6">
          Senaste bokningar
        </h2>



        {
          bookings.length === 0 ? (

            <p className="text-gray-500">
              Inga bokningar ännu
            </p>

          ) : (

            <div className="overflow-x-auto">


              <table className="w-full">


                <thead>

                  <tr className="border-b">


                    <th className="text-left p-3">
                      Namn
                    </th>


                    <th className="text-left p-3">
                      Tjänst
                    </th>


                    <th className="text-left p-3">
                      Datum
                    </th>


                    <th className="text-left p-3">
                      Status
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

                          {booking.status}

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