import { supabase } from './supabase'


export async function createBooking(data) {

  const { data:booking, error } = await supabase
    .from('bookings')
    .insert(data)
    .select()
    .single()


  if(error) {
    throw new Error(error.message)
  }


  return booking

}



export async function getBookings(userId) {

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {
      ascending:false
    })


  if(error) {
    throw new Error(error.message)
  }


  return data

}