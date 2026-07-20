import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase credentials. Got URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
  )
}

// Lazy initialization with singleton pattern
let supabaseInstance = null

const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

export const supabase = getSupabase()