import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'


export async function GET(){

  try {

    const session = await getServerSession(authOptions)


    if(!session?.user){

      return NextResponse.json(
        {
          error:'Not authenticated'
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