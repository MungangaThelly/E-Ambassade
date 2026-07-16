import { supabaseAdmin } from './supabaseAdmin'


export async function getProfile(userId){

  const {
    data,
    error
  } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq(
      'user_id',
      userId
    )
    .single()


  if(error){
    throw new Error(error.message)
  }


  return data
}