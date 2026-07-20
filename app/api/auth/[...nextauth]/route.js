import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { loginUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'


export const authOptions = {

  providers: [

    CredentialsProvider({

      name: 'Credentials',

      credentials: {

        email: {
          label: 'Email',
          type: 'email'
        },

        password: {
          label: 'Password',
          type: 'password'
        },

      },


      async authorize(credentials) {

        try {

          console.log('[AUTHORIZE] Attempting to authenticate:', credentials.email)

          const { session } =
            await loginUser(
              credentials.email,
              credentials.password
            )

          console.log('[AUTHORIZE] Login result - session exists:', !!session, 'user exists:', !!session?.user)

          if (session?.user) {

            console.log('[AUTHORIZE] User found:', session.user.email, 'ID:', session.user.id)

            // Get latest role from profiles table

            const { data: profile, error } =
              await supabaseAdmin
                .from('profiles')
                .select(
                  'role, full_name'
                )
                .eq(
                  'user_id',
                  session.user.id
                )
                .single()



            if(error){

              console.error(
                'Profile lookup error:',
                error
              )

            }

            console.log('[AUTHORIZE] Returning user with role:', profile?.role || 'user')

            return {

              id:
                session.user.id,


              email:
                session.user.email,


              name:
                profile?.full_name ||
                session.user.user_metadata?.name ||
                'User',


              role:
                profile?.role ||
                'user'

            }


          }

          console.log('[AUTHORIZE] No session/user found')

          return null



        } catch(error) {


          console.error(
            '[AUTHORIZE] Auth error:',
            error
          )


          return null

        }

      },


    }),

  ],




  callbacks: {


    async jwt({ token, user }) {


      if(user){

        console.log('[JWT CALLBACK] Creating token for:', user.email)

        token.id =
          user.id


        token.role =
          user.role

      }


      return token

    },




    async session({ session, token }) {

      console.log('[SESSION CALLBACK] Creating session for token:', token.email)

      session.user.id =
        token.id


      session.user.role =
        token.role


      return session

    },


  },



  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  },

  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  pages: {

    signIn:
      '/auth/signin',

    error:
      '/auth/signin',

  },



  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET,


  trustHost:
    true,

}



const handler =
  NextAuth(authOptions)



export {
  handler as GET,
  handler as POST
}