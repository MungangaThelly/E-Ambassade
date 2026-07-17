'use client'

import { useEffect, useState } from 'react'


export default function AdminUsersPage() {

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
        Laddar användare...
      </div>
    )

  }




  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Användare
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
              Inga användare hittades.
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
                      <strong>Namn:</strong>{' '}
                      {user.full_name}
                    </p>

                    <p>
                      <strong>Email:</strong>{' '}
                      {user.email}
                    </p>


                    <p>
                      <strong>Konto:</strong>{' '}
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