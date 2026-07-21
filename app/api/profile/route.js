import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getRequestLocale, serverT } from '@/lib/i18n/server'
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations'

// Force dynamic rendering for this route (uses headers via getServerSession)
export const dynamic = 'force-dynamic'

export async function GET(request){

  try {

    const locale = getRequestLocale(request)

    const session = await getServerSession(authOptions)


    if(!session?.user){

      return NextResponse.json(
        {
          error:serverT(locale, 'api.notAuthenticated')
        },
        {
          status:401
        }
      )

    }



    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq(
          'user_id',
          session.user.id
        )
        .single()



    if(error){

      throw error

    }



    return NextResponse.json(data)


  } catch(error){

    console.error(
      'PROFILE ERROR:',
      error
    )


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )

  }

}



export async function PATCH(request){

  try {

    const locale = getRequestLocale(request)

    const session = await getServerSession(authOptions)

    if(!session?.user){

      return NextResponse.json(
        {
          error:serverT(locale, 'api.notAuthenticated')
        },
        {
          status:401
        }
      )

    }

    const {
      preferred_language: preferredLanguage
    } = await request.json()

    if(!SUPPORTED_LOCALES.includes(preferredLanguage)){

      return NextResponse.json(
        {
          error:'Invalid language'
        },
        {
          status:400
        }
      )

    }

    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .update({
          preferred_language: preferredLanguage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id)
        .select('*')
        .single()

    if(error){
      throw error
    }

    return NextResponse.json(data)

  } catch(error){

    console.error(
      'PROFILE UPDATE ERROR:',
      error
    )

    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )

  }

}