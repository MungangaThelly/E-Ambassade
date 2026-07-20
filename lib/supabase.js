import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy initialization to prevent multiple instances
let supabaseInstance = null

export const getSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    // Return a dummy client to prevent crashes
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Export for backward compatibility
export const supabase = getSupabase()