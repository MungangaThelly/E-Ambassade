import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase credentials. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
  )
}

// Client-side only singleton
let supabaseClient

if (typeof window !== 'undefined') {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient || {
  auth: { signUp: () => {}, signInWithPassword: () => {} },
  from: () => ({ select: () => {} })
}