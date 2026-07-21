'use client'

import { useEffect,useState } from 'react'
import AdminBookings from '@/components/AdminBookings'
import { useLanguage } from '@/lib/i18n/language-context'


export default function AdminBookingsPage(){
  const { t } = useLanguage()

  const [bookings,setBookings] = useState([])
  const [loading,setLoading] = useState(true)


  useEffect(()=>{

    fetchBookings()

  },[])



  async function fetchBookings(){

    try{

      const res = await fetch('/api/admin/bookings')

      const data = await res.json()

      //console.log('ADMIN BOOKINGS API:', data)

      setBookings(
        Array.isArray(data)
          ? data
          : []
      )


    }catch(error){

      console.error(error)

    }finally{

      setLoading(false)

    }

  }



  if(loading){

    return <div>{t('admin.loadingBookings')}</div>

  }



  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        {t('admin.allBookings')}
      </h1>


      <AdminBookings
        bookings={bookings}
      />


    </div>

  )

}