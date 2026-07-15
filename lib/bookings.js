import { supabase } from './supabase'

export async function getBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getBookingById(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createBooking(booking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function updateBooking(id, updates) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function deleteBooking(id) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
