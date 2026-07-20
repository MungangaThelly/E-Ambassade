'use server'

import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function serverRegisterUser(email, password, name) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'user' }
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    // Auto-confirm email so users can sign in immediately
    if (data.user?.id) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(
          data.user.id,
          { email_confirm: true }
        )
      } catch (confirmError) {
        console.error('Email confirmation error:', confirmError)
        // Continue - user is still created even if confirmation fails
      }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
