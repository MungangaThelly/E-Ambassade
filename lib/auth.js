import { supabase } from './supabase'


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