'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export default function AdminNotificationsPage() {
  const { t } = useLanguage()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('admin.notifications')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">{t('admin.notificationsSoon')}</p>
      </div>
    </div>
  )
}
