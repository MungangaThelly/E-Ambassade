'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language" className="text-sm text-gray-600">
        {t('language.label')}:
      </label>
      <select
        id="language"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      >
        <option value="fr">{t('language.fr')}</option>
        <option value="sv">{t('language.sv')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  )
}
