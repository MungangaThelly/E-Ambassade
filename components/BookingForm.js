'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function BookingForm() {

  const router = useRouter()

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    serviceType: '',
    notes: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const serviceTypes = [
    'Representativ vid event',
    'Brand ambassadör',
    'Produktpresentation',
    'Eventkväll',
    'Annan',
  ]


  function handleChange(e) {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

  }


  async function handleSubmit(e) {

    e.preventDefault()

    setError('')


    if (
      !formData.date ||
      !formData.time ||
      !formData.serviceType
    ) {

      setError('Vänligen fyll i alla obligatoriska fält')
      return

    }


    setLoading(true)


    try {

      await axios.post('/api/bookings', {
        date: formData.date,
        time: formData.time,
        serviceType: formData.serviceType,
        notes: formData.notes,
      })


      router.push('/dashboard')


    } catch (error) {

      console.error(
        'Booking error:',
        error
      )


      if(error.response?.status === 401){

        setError(
          'Du måste logga in först'
        )

      } else {

        setError(
          error.response?.data?.error ||
          'Bokningen misslyckades'
        )

      }


    } finally {

      setLoading(false)

    }

  }



  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-8"
    >

      {error && (

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>

      )}



      <div className="mb-6">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Datum *
        </label>


        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

      </div>




      <div className="mb-6">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tid *
        </label>


        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />

      </div>




      <div className="mb-6">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tjänsttyp *
        </label>


        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        >

          <option value="">
            Välj tjänsttyp
          </option>


          {serviceTypes.map(type => (

            <option
              key={type}
              value={type}
            >
              {type}
            </option>

          ))}


        </select>

      </div>




      <div className="mb-6">

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anteckningar
        </label>


        <textarea

          name="notes"

          value={formData.notes}

          onChange={handleChange}

          rows="4"

          className="w-full px-4 py-2 border rounded-lg"

          placeholder="Lägg till eventuella anteckningar..."

        />

      </div>




      <button

        type="submit"

        disabled={loading}

        className="w-full btn btn-primary disabled:opacity-50"

      >

        {loading ? 'Bokar...' : 'Gör bokning'}

      </button>


    </form>

  )

}