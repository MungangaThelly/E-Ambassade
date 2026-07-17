import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'


export async function GET(
  request,
  { params }
){

  const { data, error } =
    await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq(
        'id',
        params.id
      )
      .single()



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