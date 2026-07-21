'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'

export default function DashboardShell({ children }) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">{t('dashboard.sidebarTitle')}</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block hover:text-blue-400">
            {t('dashboard.myBookings')}
          </Link>
          <Link href="/dashboard/profile" className="block hover:text-blue-400">
            {t('dashboard.profile')}
          </Link>
          <Link href="/dashboard/notifications" className="block hover:text-blue-400">
            {t('dashboard.notifications')}
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
