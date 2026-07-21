'use client'

import BookingForm from '@/components/BookingForm'
import { useLanguage } from '@/lib/i18n/language-context'

export default function BookingPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{t('booking.pageTitle')}</h1>
      <BookingForm />
    </div>
  )
}
