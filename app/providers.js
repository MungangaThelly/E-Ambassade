'use client'

import { SessionProvider } from 'next-auth/react'
import { LanguageProvider } from '@/lib/i18n/language-context'

export function Providers({ children }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  )
}
