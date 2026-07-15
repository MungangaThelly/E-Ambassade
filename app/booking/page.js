'use client'

import BookingForm from '@/components/BookingForm'

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Ny bokning</h1>
      <BookingForm />
    </div>
  )
}
