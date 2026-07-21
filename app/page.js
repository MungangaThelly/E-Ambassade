'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/booking"
            className="btn btn-primary"
          >
            {t('home.ctaBooking')}
          </a>
          <a
            href="/auth/signin"
            className="btn btn-secondary"
          >
            {t('home.ctaSignIn')}
          </a>
        </div>
      </section>

      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{t('home.easyTitle')}</h3>
          <p className="text-gray-600">{t('home.easyText')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{t('home.fastTitle')}</h3>
          <p className="text-gray-600">{t('home.fastText')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{t('home.secureTitle')}</h3>
          <p className="text-gray-600">{t('home.secureText')}</p>
        </div>
      </section>
    </div>
  )
}
