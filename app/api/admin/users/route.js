import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET(){

  const session = await getServerSession(authOptions)


  if(
    !session ||
    session.user.role !== 'admin'
  ){

    return NextResponse.json(
      {
        error:'Unauthorized'
      },
      {
        status:401
      }
    )

  }


  const {data,error}=await supabaseAdmin
    .from('profiles')
    .select('*')
    .order(
      'created_at',
      {
        ascending:false
      }
    )


  if(error){

    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )

  }


  return NextResponse.json(data)

}