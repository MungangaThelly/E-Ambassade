'use server'

import { supabase } from './supabase'
import { supabaseAdmin } from './supabaseAdmin'


export async function registerUser(
  email,
  password,
  name
) {

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
          name,
          role:'user'
        }
      }
    })


  if(error){
    throw new Error(error.message)
  }


  // Auto-confirm email so users can sign in immediately
  if(data.user?.id) {
    try {
      await supabaseAdmin.auth.admin.updateUserById(
        data.user.id,
        { email_confirm: true }
      )
    } catch(confirmError) {
      console.error('Email confirmation error:', confirmError)
      // Continue - user is still created even if confirmation fails
    }
  }


  return data
}



export async function loginUser(
  email,
  password
){

  const {data,error} =
    await supabase.auth.signInWithPassword({
      email,
      password
    })


  if(error){
    throw new Error(error.message)
  }


  return data
}



export async function logoutUser(){

  const {error} =
    await supabase.auth.signOut()


  if(error){
    throw new Error(error.message)
  }

}



export async function getCurrentUser(){

  const {
    data:{
      user
    }
  } =
    await supabase.auth.getUser()


  return user
}



export async function resetPassword(email){

  const {error} =
    await supabase.auth.resetPasswordForEmail(email)


  if(error){
    throw new Error(error.message)
  }

}