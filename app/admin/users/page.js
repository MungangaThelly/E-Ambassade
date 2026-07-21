'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'


export default function AdminUsersPage() {
  const { t } = useLanguage()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    fetchUsers()

  }, [])



  async function fetchUsers(){

    try {

      const res =
        await fetch('/api/admin/users')


      const data =
        await res.json()


      setUsers(data)


    } catch(error){

      console.error(
        'Users loading error:',
        error
      )

    } finally {

      setLoading(false)

    }

  }




  if(loading){

    return (
      <div>
        {t('admin.loadingUsers')}
      </div>
    )

  }




  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        {t('admin.usersTitle')}
      </h1>


      <div className="
        bg-white
        rounded-lg
        shadow
        p-6
      ">


        {
          users.length === 0 ?

          (

            <p className="text-gray-600">
              {t('admin.noUsers')}
            </p>

          )

          :

          (

            <div className="space-y-4">

              {
                users.map(user => (

                  <div
                    key={user.id}
                    className="
                      border-b
                      pb-3
                    "
                  >

                    <p>
                      <strong>{t('admin.name')}:</strong>{' '}
                      {user.full_name}
                    </p>

                    <p>
                      <strong>{t('admin.email')}:</strong>{' '}
                      {user.email}
                    </p>


                    <p>
                      <strong>{t('admin.account')}:</strong>{' '}
                      {user.role}
                    </p>

                  </div>

                ))
              }

            </div>

          )

        }


      </div>


    </div>

  )

}