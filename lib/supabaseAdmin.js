import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create admin client on server
let supabaseAdminClient = null

if (typeof window === 'undefined') {
  supabaseAdminClient = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export const supabaseAdmin = supabaseAdminClient || {
  auth: { admin: { updateUserById: () => {} } },
  from: () => ({ select: () => {} })
}