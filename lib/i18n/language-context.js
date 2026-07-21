'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, translations } from './translations'

const LanguageContext = createContext(null)

function getNestedValue(obj, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

function resolveLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
}

function detectBrowserLocale() {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE
  }

  const primary = navigator.language?.slice(0, 2)?.toLowerCase()
  if (SUPPORTED_LOCALES.includes(primary)) {
    return primary
  }

  return DEFAULT_LOCALE
}

export function LanguageProvider({ children }) {
  const { data: session } = useSession()
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isProfileResolved, setIsProfileResolved] = useState(false)
  const lastSyncedLocaleRef = useRef(null)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('locale') : null
    const initialLocale = resolveLocale(saved || detectBrowserLocale())
    setLocaleState(initialLocale)
    lastSyncedLocaleRef.current = initialLocale
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    if (!session?.user?.id) {
      setIsProfileResolved(false)
      return
    }

    let cancelled = false

    async function loadPreferredLanguage() {
      try {
        const response = await fetch('/api/profile', {
          cache: 'no-store',
        })

        if (!response.ok) {
          return
        }

        const profile = await response.json()
        const preferredLocale = resolveLocale(profile?.preferred_language)

        if (!cancelled && preferredLocale && SUPPORTED_LOCALES.includes(preferredLocale)) {
          setLocaleState(preferredLocale)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('locale', preferredLocale)
          }
          lastSyncedLocaleRef.current = preferredLocale
        }
      } catch (error) {
        console.error('Failed to load preferred language:', error)
      } finally {
        if (!cancelled) {
          setIsProfileResolved(true)
        }
      }
    }

    loadPreferredLanguage()

    return () => {
      cancelled = true
    }
  }, [isInitialized, session?.user?.id])

  useEffect(() => {
    if (!isInitialized || !session?.user?.id || !isProfileResolved) {
      return
    }

    if (lastSyncedLocaleRef.current === locale) {
      return
    }

    let cancelled = false

    async function savePreferredLanguage() {
      try {
        const response = await fetch('/api/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-locale': locale,
          },
          body: JSON.stringify({
            preferred_language: locale,
          }),
        })

        if (!cancelled && response.ok) {
          lastSyncedLocaleRef.current = locale
        }
      } catch (error) {
        console.error('Failed to save preferred language:', error)
      }
    }

    savePreferredLanguage()

    return () => {
      cancelled = true
    }
  }, [isInitialized, isProfileResolved, locale, session?.user?.id])

  const setLocale = (nextLocale) => {
    const resolved = resolveLocale(nextLocale)
    setLocaleState(resolved)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', resolved)
    }
  }

  const value = useMemo(() => {
    const dateLocaleMap = {
      fr: 'fr-FR',
      sv: 'sv-SE',
      en: 'en-GB',
    }

    const t = (key, vars = {}) => {
      const localized = getNestedValue(translations[locale], key)
      const fallback = getNestedValue(translations.en, key)
      const rawValue = localized ?? fallback ?? key

      if (typeof rawValue !== 'string') {
        return rawValue
      }

      return rawValue.replace(/\{(\w+)\}/g, (_, token) => {
        return vars[token] !== undefined ? String(vars[token]) : `{${token}}`
      })
    }

    return {
      locale,
      setLocale,
      t,
      dateLocale: dateLocaleMap[locale] || 'fr-FR',
    }
  }, [locale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
