import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { 
  getNotifications,
  markNotificationRead,
  createNotification
} from '@/lib/notifications'


// GET USER NOTIFICATIONS
export async function GET(){

  try {

    const session =
      await getServerSession(authOptions)


    if(!session?.user){

      return NextResponse.json(
        {
          error:'Unauthorized'
        },
        {
          status:401
        }
      )

    }


    const notifications =
      await getNotifications(
        session.user.id
      )


    return NextResponse.json(
      notifications
    )


  } catch(error){

    console.error(
      'GET NOTIFICATIONS ERROR:',
      error
    )


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )

  }

}




// CREATE DATABASE NOTIFICATION
export async function POST(request){

  try {

    const session =
      await getServerSession(authOptions)


    if(!session?.user){

      return NextResponse.json(
        {
          error:'Unauthorized'
        },
        {
          status:401
        }
      )

    }


    const body =
      await request.json()



    /*
      Database notification
    */

    if(body.type === 'database'){


      const notification =
        await createNotification({

          user_id:
            session.user.id,


          title:
            body.title,


          message:
            body.message

        })


      return NextResponse.json(
        notification,
        {
          status:201
        }
      )

    }




    /*
      Email notification
    */

    if(body.type === 'email'){

      console.log(
        `Sending email to ${body.to}`,
        {
          subject:body.subject,
          message:body.message
        }
      )

    }




    /*
      SMS notification
    */

    if(body.type === 'sms'){

      console.log(
        `Sending SMS to ${body.phoneNumber}`,
        body.message
      )

    }



    return NextResponse.json(
      {
        success:true
      }
    )



  } catch(error){


    console.error(
      'POST NOTIFICATIONS ERROR:',
      error
    )


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )


  }

}




// MARK AS READ

export async function PATCH(request){

  try {

    const session =
      await getServerSession(authOptions)


    if(!session?.user){

      return NextResponse.json(
        {
          error:'Unauthorized'
        },
        {
          status:401
        }
      )

    }


    const {
      id
    } =
    await request.json()



    const notification =
      await markNotificationRead(
        id,
        session.user.id
      )



    return NextResponse.json(
      notification
    )


  } catch(error){

    console.error(
      'PATCH NOTIFICATION ERROR:',
      error
    )


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    )

  }

}