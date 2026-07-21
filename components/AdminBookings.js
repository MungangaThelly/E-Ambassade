'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '@/lib/i18n/language-context'


export default function AdminBookings({ bookings }) {
  const { t, locale } = useLanguage()


  const [items, setItems] = useState([])

  const [loadingId, setLoadingId] = useState(null)



  useEffect(() => {

    setItems(
      Array.isArray(bookings)
        ? bookings
        : []
  )

  }, [bookings])




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

  const statusLabels = {
    pending: t('booking.status.pending'),
    confirmed: t('booking.status.confirmed'),
    completed: t('booking.status.completed'),
    cancelled: t('booking.status.cancelled'),
  }




  async function updateStatus(id, status) {


    try {

      setLoadingId(id)


      await axios.patch(
        `/api/admin/bookings/${id}`,
        {
          status
        },
        {
          headers: {
            'x-locale': locale,
          },
        }
      )


      setItems(prev =>

        prev.map(booking =>

          booking.id === id

            ? {
                ...booking,
                status
              }

            : booking

        )

      )


    } catch(error) {

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
            {t('admin.noBookings')}

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
                  <strong>{t('admin.name')}:</strong>{' '}
                  {booking.full_name || t('common.notProvided')}
                </p>



                <p>
                  <strong>{t('admin.email')}:</strong>{' '}
                  {booking.email || t('common.notProvided')}
                </p>



                <p>
                  <strong>{t('admin.phone')}:</strong>{' '}
                  {booking.phone || t('common.notProvided')}
                </p>



                <p>
                  <strong>{t('admin.passport')}:</strong>{' '}
                  {booking.passport_number}
                </p>



                <p className="mt-3">
                  <strong>{t('admin.date')}:</strong>{' '}
                  {booking.appointment_date}
                </p>



                <p>
                  <strong>{t('admin.time')}:</strong>{' '}
                  {booking.appointment_time}
                </p>



                {
                  booking.message && (

                    <p className="mt-3">
                      <strong>{t('admin.message')}:</strong>{' '}
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
                    ${statusColors[booking.status] || ''}
                  `}
                >

                  {statusLabels[booking.status] || booking.status}

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
                      {t('admin.approve')}
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
                      {t('admin.cancel')}
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

                    {t('admin.complete')}

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