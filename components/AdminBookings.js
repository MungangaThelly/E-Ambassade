'use client'

import { useState } from 'react'
import axios from 'axios'


export default function AdminBookings({
  bookings
}) {


  const [items, setItems] = useState(bookings)

  const [loadingId, setLoadingId] = useState(null)



  const statusColors = {

    pending:
      'bg-yellow-100 text-yellow-800',

    confirmed:
      'bg-blue-100 text-blue-800',

    completed:
      'bg-green-100 text-green-800',

    cancelled:
      'bg-red-100 text-red-800',

  }



  async function updateStatus(id, status){


    try {

      setLoadingId(id)


      await axios.patch(
        `/api/bookings/${id}`,
        {
          status
        }
      )


      setItems(prev =>

        prev.map(booking =>

          booking.id === id

          ?

          {
            ...booking,
            status
          }

          :

          booking

        )

      )


    } catch(error){

      console.error(
        'Update booking error:',
        error
      )


    } finally {

      setLoadingId(null)

    }

  }




  return (

    <div className="space-y-6">


      {
        items.length === 0 && (

          <div className="
            bg-white
            p-6
            rounded-lg
            shadow
          ">

            Inga bokningar hittades.

          </div>

        )
      }



      {
        items.map(booking => (

          <div
            key={booking.id}
            className="
              bg-white
              rounded-lg
              shadow
              p-6
            "
          >



            <div className="
              flex
              justify-between
              gap-6
            ">



              <div>


                <h2 className="
                  text-xl
                  font-bold
                  mb-3
                ">

                  {booking.service_type}

                </h2>



                <p>
                  <strong>Namn:</strong>{' '}
                  {
                    booking.profiles?.full_name ||
                    'Ej angivet'
                  }
                </p>



                <p>
                  <strong>Email:</strong>{' '}
                  {
                    booking.profiles?.email ||
                    booking.email
                  }
                </p>



                <p>
                  <strong>Telefon:</strong>{' '}
                  {
                    booking.profiles?.phone ||
                    booking.phone
                  }
                </p>



                <p>
                  <strong>Passnummer:</strong>{' '}
                  {booking.passport_number}
                </p>



                <p className="mt-3">

                  <strong>Datum:</strong>{' '}
                  {booking.appointment_date}

                </p>



                <p>

                  <strong>Tid:</strong>{' '}
                  {booking.appointment_time}

                </p>



                {
                  booking.message && (

                    <p className="mt-3">

                      <strong>Meddelande:</strong>{' '}
                      {booking.message}

                    </p>

                  )
                }



              </div>





              <div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                    ${
                      statusColors[booking.status]
                    }
                  `}
                >

                  {
                    booking.status
                  }

                </span>


              </div>



            </div>





            <div className="
              mt-6
              flex
              gap-3
            ">



              {
                booking.status === 'pending' && (

                  <>


                    <button

                      disabled={
                        loadingId === booking.id
                      }

                      onClick={() =>
                        updateStatus(
                          booking.id,
                          'confirmed'
                        )
                      }

                      className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:opacity-50
                      "

                    >

                      Godkänn

                    </button>




                    <button

                      disabled={
                        loadingId === booking.id
                      }

                      onClick={() =>
                        updateStatus(
                          booking.id,
                          'cancelled'
                        )
                      }

                      className="
                        bg-red-600
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:opacity-50
                      "

                    >

                      Avboka

                    </button>


                  </>

                )
              }





              {
                booking.status === 'confirmed' && (


                  <button

                    disabled={
                      loadingId === booking.id
                    }

                    onClick={() =>
                      updateStatus(
                        booking.id,
                        'completed'
                      )
                    }

                    className="
                      bg-green-600
                      text-white
                      px-4
                      py-2
                      rounded
                      disabled:opacity-50
                    "

                  >

                    Slutför

                  </button>


                )
              }





            </div>



          </div>


        ))
      }



    </div>

  )

}