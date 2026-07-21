'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{t('common.appName')}</h3>
            <p className="text-gray-400">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/booking" className="hover:text-white">{t('navbar.booking')}</a></li>
              <li><a href="/dashboard" className="hover:text-white">{t('common.dashboard')}</a></li>
              <li><a href="/auth/signin" className="hover:text-white">{t('navbar.signIn')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:support@e-ambassade.se" className="hover:text-white">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.faq')}</a></li>
              <li><a href="#" className="hover:text-white">{t('footer.privacy')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {t('common.appName')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
