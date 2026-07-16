'use client'

import { useEffect, useState } from 'react'


export default function ProfilePage(){

  const [profile,setProfile] = useState(null)
  const [loading,setLoading] = useState(true)



  useEffect(()=>{

    fetchProfile()

  },[])



  async function fetchProfile(){

    try{

      const res = await fetch(
        '/api/profile'
      )


      const data = await res.json()


      setProfile(data)


    }catch(error){

      console.error(error)

    }finally{

      setLoading(false)

    }

  }



  if(loading){

    return (
      <div>
        Laddar profil...
      </div>
    )

  }



  if(!profile){

    return (
      <div>
        Ingen profil hittades
      </div>
    )

  }



  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Min profil
      </h1>


      <div className="
        bg-white
        rounded-lg
        shadow
        p-6
        space-y-3
      ">


        <p>
          <strong>Namn:</strong>{' '}
          {profile.full_name}
        </p>


        <p>
          <strong>Email:</strong>{' '}
          {profile.email}
        </p>


        <p>
          <strong>Telefon:</strong>{' '}
          {profile.phone || 'Ej angivet'}
        </p>


        <p>
          <strong>Konto:</strong>{' '}
          {profile.role}
        </p>


        <p>
          <strong>Skapad:</strong>{' '}
          {new Date(
            profile.created_at
          ).toLocaleDateString('sv-SE')}
        </p>


      </div>


    </div>

  )

}