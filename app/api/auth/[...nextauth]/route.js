import CredentialsProvider from 'next-auth/providers/credentials'
import { loginUser } from '@/lib/auth'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { session } = await loginUser(credentials.email, credentials.password)
          if (session?.user) {
            return {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || 'User',
              role: session.user.user_metadata?.role || 'user',
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET(request) {
  return new Response('NextAuth API endpoint', { status: 200 })
}
