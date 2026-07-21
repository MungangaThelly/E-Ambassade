'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { serverRegisterUser } from '@/app/actions/auth'
import { useLanguage } from '@/lib/i18n/language-context'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError(t('auth.register.passwordMismatch'))
      return
    }

    if (password.length < 6) {
      setError(t('auth.register.passwordMin'))
      return
    }

    setLoading(true)

    try {
      const result = await serverRegisterUser(email, password, name)
      if (!result.success) {
        setError(result.error || t('auth.register.failed'))
        return
      }
      router.push('/auth/signin')
    } catch (error) {
      setError(error.message || t('auth.register.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">{t('auth.register.title')}</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('auth.register.namePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('auth.register.emailPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.confirmPassword')}
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.register.loading') : t('auth.register.submit')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('auth.register.hasAccount')}{' '}
            <a href="/auth/signin" className="text-blue-600 hover:underline">
              {t('auth.register.signIn')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
