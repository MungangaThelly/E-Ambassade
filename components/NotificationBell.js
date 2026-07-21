'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'

export default function NotificationBell() {
  const [notificationCount, setNotificationCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-900">{t('notifications.title')}</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-center">
              {t('notifications.noNew')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
