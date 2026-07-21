'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('locale') : null
    const initialLocale = resolveLocale(saved || detectBrowserLocale())
    setLocaleState(initialLocale)
  }, [])

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
