'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/i18n/language-context'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          {t('common.appName')}
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`flex-col md:flex-row md:flex items-center gap-4 ${menuOpen ? 'flex' : 'hidden'} md:block`}>
          <LanguageSwitcher />
          {session ? (
            <>
              <span className="text-gray-700">
                {t('navbar.greeting', { name: session.user.name })}
              </span>
              <Link href="/dashboard" className="hover:text-blue-600">
                {t('navbar.dashboard')}
              </Link>
              {session.user.role === 'admin' && (
                <Link href="/admin" className="hover:text-blue-600">
                  {t('navbar.admin')}
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="btn btn-secondary"
              >
                {t('navbar.signOut')}
              </button>
            </>
          ) : (
            <>
              <Link href="/booking" className="hover:text-blue-600">
                {t('navbar.booking')}
              </Link>
              <Link href="/auth/signin" className="btn btn-primary">
                {t('navbar.signIn')}
              </Link>
              <Link href="/auth/register" className="btn btn-secondary">
                {t('navbar.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
