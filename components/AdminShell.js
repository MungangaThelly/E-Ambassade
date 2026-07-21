'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'

export default function AdminShell({ children }) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">{t('admin.sidebarTitle')}</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:text-blue-400">
            {t('common.dashboard')}
          </Link>
          <Link href="/admin/bookings" className="block hover:text-blue-400">
            {t('admin.allBookings')}
          </Link>
          <Link href="/admin/users" className="block hover:text-blue-400">
            {t('admin.users')}
          </Link>
          <Link href="/admin/notifications" className="block hover:text-blue-400">
            {t('admin.notifications')}
          </Link>
          <Link href="/admin/settings" className="block hover:text-blue-400">
            {t('admin.settings')}
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
