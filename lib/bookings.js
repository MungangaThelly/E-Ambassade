import { supabaseAdmin } from './supabaseAdmin'


export async function createBooking(data){

  const { data: booking, error } =
    await supabaseAdmin
      .from('bookings')
      .insert({

        user_id:data.user_id,

        service_type:data.service_type,

        appointment_date:data.appointment_date,

        appointment_time:data.appointment_time,

        full_name:data.full_name,

        email:data.email,

        phone:data.phone,

        passport_number:data.passport_number,

        message:data.message,

        status:data.status || 'pending'

      })
      .select()
      .single()


  if(error){
    throw new Error(error.message)
  }


  return booking
}




export async function getBookings(userId){

  const { data: bookings, error } =
    await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', {
        ascending:false
      })


  if(error){
    throw new Error(error.message)
  }


  return bookings
}

export async function updateBookingStatus(id, status) {

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}