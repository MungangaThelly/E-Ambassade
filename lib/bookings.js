import { supabase } from './supabase'

const memoryBookings = []

function isMissingTableError(error) {
  if (!error) return false

  const message = error.message || ''
  return (
    message.includes('Could not find the table') ||
    message.includes('does not exist') ||
    error.code === '42P01'
  )
}

function createMemoryBooking(booking) {
  const createdBooking = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ...booking,
    created_at: new Date().toISOString(),
  }

  memoryBookings.push(createdBooking)
  return createdBooking
}

function getMemoryBookings(userId) {
  if (!userId) {
    return [...memoryBookings]
  }

  return memoryBookings.filter((booking) => booking.user_id === userId)
}

function updateMemoryBooking(id, updates) {
  const index = memoryBookings.findIndex((booking) => booking.id === id)

  if (index === -1) {
    return null
  }

  memoryBookings[index] = { ...memoryBookings[index], ...updates }
  return memoryBookings[index]
}

export async function getBookings(userId) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('Using in-memory booking store because the bookings table is unavailable.')
        return getMemoryBookings(userId)
      }
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('Using in-memory booking store because the bookings table is unavailable.')
      return getMemoryBookings(userId)
    }

    throw error
  }
}

export async function getBookingById(id) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('Using in-memory booking store because the bookings table is unavailable.')
        return getMemoryBookings().find((booking) => booking.id === id) || null
      }
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('Using in-memory booking store because the bookings table is unavailable.')
      return getMemoryBookings().find((booking) => booking.id === id) || null
    }

    throw error
  }
}

export async function createBooking(booking) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('Using in-memory booking store because the bookings table is unavailable.')
        return createMemoryBooking(booking)
      }
      throw new Error(error.message)
    }

    return data[0]
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('Using in-memory booking store because the bookings table is unavailable.')
      return createMemoryBooking(booking)
    }

    throw error
  }
}

export async function updateBooking(id, updates) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('Using in-memory booking store because the bookings table is unavailable.')
        return updateMemoryBooking(id, updates)
      }
      throw new Error(error.message)
    }

    return data[0]
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('Using in-memory booking store because the bookings table is unavailable.')
      return updateMemoryBooking(id, updates)
    }

    throw error
  }
}

export async function deleteBooking(id) {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('Using in-memory booking store because the bookings table is unavailable.')
        const index = memoryBookings.findIndex((booking) => booking.id === id)
        if (index !== -1) {
          memoryBookings.splice(index, 1)
        }
        return
      }
      throw new Error(error.message)
    }
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('Using in-memory booking store because the bookings table is unavailable.')
      const index = memoryBookings.findIndex((booking) => booking.id === id)
      if (index !== -1) {
        memoryBookings.splice(index, 1)
      }
      return
    }

    throw error
  }
}

export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (isMissingTableError(error)) {
        console.warn('Using in-memory booking store because the bookings table is unavailable.')
        return getMemoryBookings()
      }
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('Using in-memory booking store because the bookings table is unavailable.')
      return getMemoryBookings()
    }

    throw error
  }
}
