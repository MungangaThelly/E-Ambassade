'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/language-context'


export default function BookingDetailsPage(){
  const params = useParams()
  const { t } = useLanguage()

  const [booking,setBooking] = useState(null)
  const [loading,setLoading] = useState(true)
  const [updating,setUpdating] = useState(false)



  useEffect(()=>{

    if(params.id){
      fetchBooking()
    }

  },[params.id])



  async function fetchBooking(){

    try {

      const res =
        await fetch(
          `/api/admin/bookings/${params.id}`
        )


      if(!res.ok){

        throw new Error(
          'Failed to fetch booking'
        )

      }


      const data =
        await res.json()


      setBooking(data)


    } catch(error){

      console.error(
        'Booking details error:',
        error
      )


    } finally {

      setLoading(false)

    }

  }





  async function updateStatus(status){

    try {

      setUpdating(true)


      const res =
        await fetch(
          `/api/admin/bookings/${params.id}`,
          {
            method:'PATCH',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              status
            })
          }
        )


      if(!res.ok){

        throw new Error(
          'Failed to update booking'
        )

      }


      await fetchBooking()


    } catch(error){

      console.error(
        'Update status error:',
        error
      )


    } finally {

      setUpdating(false)

    }

  }





  if(loading){

    return (
      <div>
        {t('admin.bookingDetailsLoading')}
      </div>
    )

  }





  if(!booking){

    return (
      <div>
        {t('admin.bookingNotFound')}
      </div>
    )

  }





  const status =
    booking.status?.trim().toLowerCase()

  const statusLabels = {
    pending: t('booking.status.pending'),
    confirmed: t('booking.status.confirmed'),
    completed: t('booking.status.completed'),
    cancelled: t('booking.status.cancelled'),
  }




  return (

    <div>
      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        {t('admin.bookingDetails')}
      </h1>





      <div className="
        bg-white
        rounded-lg
        shadow
        p-6
        space-y-3
      ">


        <p>
          <strong>{t('admin.service')}:</strong>{' '}
          {booking.service_type}
        </p>


        <p>
          <strong>{t('admin.name')}:</strong>{' '}
          {booking.full_name}
        </p>


        <p>
          <strong>{t('admin.email')}:</strong>{' '}
          {booking.email}
        </p>


        <p>
          <strong>{t('admin.phone')}:</strong>{' '}
          {booking.phone}
        </p>


        <p>
          <strong>{t('admin.passport')}:</strong>{' '}
          {booking.passport_number}
        </p>


        <p>
          <strong>{t('admin.date')}:</strong>{' '}
          {booking.appointment_date}
        </p>


        <p>
          <strong>{t('admin.time')}:</strong>{' '}
          {booking.appointment_time}
        </p>


        <p>
          <strong>{t('admin.status')}:</strong>{' '}
          <span className="font-bold">
            {statusLabels[status] || booking.status}
          </span>
        </p>



        {
          booking.message && (

            <p>
              <strong>{t('admin.message')}:</strong>{' '}
              {booking.message}
            </p>

          )
        }
      </div>





      <div className="
        mt-6
        flex
        gap-3
      ">



        {
          status === 'pending' && (

            <>


              <button
                disabled={updating}
                onClick={() =>
                  updateStatus('confirmed')
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
                disabled={updating}
                onClick={() =>
                  updateStatus('cancelled')
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
          status === 'confirmed' && (

            <button
              disabled={updating}
              onClick={() =>
                updateStatus('completed')
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

  )

}