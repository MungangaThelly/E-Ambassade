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


          const { session } =
            await loginUser(
              credentials.email,
              credentials.password
            )



          if (session?.user) {


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


          return null



        } catch(error) {


          console.error(
            'Auth error:',
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

        token.id =
          user.id


        token.role =
          user.role

      }


      return token

    },




    async session({ session, token }) {


      session.user.id =
        token.id


      session.user.role =
        token.role


      return session

    },


  },



  session: {
    strategy: 'jwt',
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