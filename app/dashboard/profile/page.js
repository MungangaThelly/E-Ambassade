'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'


export default function ProfilePage(){
  const { t, dateLocale } = useLanguage()

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
        {t('dashboard.profilePage.loading')}
      </div>
    )

  }



  if(!profile){

    return (
      <div>
        {t('dashboard.profilePage.noProfile')}
      </div>
    )

  }



  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        {t('dashboard.profilePage.title')}
      </h1>


      <div className="
        bg-white
        rounded-lg
        shadow
        p-6
        space-y-3
      ">


        <p>
          <strong>{t('dashboard.profilePage.name')}:</strong>{' '}
          {profile.full_name}
        </p>


        <p>
          <strong>{t('dashboard.profilePage.email')}:</strong>{' '}
          {profile.email}
        </p>


        <p>
          <strong>{t('dashboard.profilePage.phone')}:</strong>{' '}
          {profile.phone || t('common.notProvided')}
        </p>


        <p>
          <strong>{t('dashboard.profilePage.account')}:</strong>{' '}
          {profile.role}
        </p>


        <p>
          <strong>{t('dashboard.profilePage.created')}:</strong>{' '}
          {new Date(
            profile.created_at
          ).toLocaleDateString(dateLocale)}
        </p>


      </div>


    </div>

  )

}