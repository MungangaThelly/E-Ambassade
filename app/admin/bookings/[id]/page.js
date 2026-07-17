'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'


export default function BookingDetailsPage(){
  const params = useParams()

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
          `/api/admin/${params.id}`
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
          `/api/admin/${params.id}`,
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
        Laddar bokning...
      </div>
    )

  }





  if(!booking){

    return (
      <div>
        Bokning hittades inte.
      </div>
    )

  }





  const status =
    booking.status?.trim().toLowerCase()




  return (

    <div>
      
      <h1>
      ADMIN BOOKING PAGE WORKING
      </h1>

      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        Bokningsdetaljer
      </h1>





      <div className="
        bg-white
        rounded-lg
        shadow
        p-6
        space-y-3
      ">


        <p>
          <strong>Tjänst:</strong>{' '}
          {booking.service_type}
        </p>


        <p>
          <strong>Namn:</strong>{' '}
          {booking.full_name}
        </p>


        <p>
          <strong>Email:</strong>{' '}
          {booking.email}
        </p>


        <p>
          <strong>Telefon:</strong>{' '}
          {booking.phone}
        </p>


        <p>
          <strong>Passnummer:</strong>{' '}
          {booking.passport_number}
        </p>


        <p>
          <strong>Datum:</strong>{' '}
          {booking.appointment_date}
        </p>


        <p>
          <strong>Tid:</strong>{' '}
          {booking.appointment_time}
        </p>


        <p>
          <strong>Status:</strong>{' '}
          <span className="font-bold">
            {booking.status}
          </span>
        </p>



        {
          booking.message && (

            <p>
              <strong>Meddelande:</strong>{' '}
              {booking.message}
            </p>

          )
        }
        <div className="mt-4 bg-yellow-200 p-4">
          TEST BUTTON AREA
        </div>

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
                Godkänn
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
                Avboka
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
              Slutför
            </button>

          )
        }



      </div>



    </div>

  )

}