import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for development if credentials are not set
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: new Error('Supabase not configured') }),
        getUser: async () => ({ data: null }),
        resetPasswordForEmail: async () => ({ error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: new Error('Supabase not configured') }) }),
          order: async () => ({ data: [], error: null }),
        }),
        insert: () => ({ select: async () => ({ data: [], error: null }) }),
        update: () => ({ eq: () => ({ select: async () => ({ data: null, error: null }) }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
      }),
    }

