'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export default function NotificationsPage() {
  const { t } = useLanguage()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.notificationsPage.title')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">{t('dashboard.notificationsPage.empty')}</p>
      </div>
    </div>
  )
}
