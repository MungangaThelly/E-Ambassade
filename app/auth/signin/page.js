'use client'

import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      // Small delay to ensure session is properly stored
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [session, router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Ett fel uppstod vid inloggning')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Logga in</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="din@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
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

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Har du inget konto?{' '}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Registrera dig
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
