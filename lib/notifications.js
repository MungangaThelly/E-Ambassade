import axios from 'axios'
import { supabaseAdmin } from './supabaseAdmin'



// ===============================
// DATABASE NOTIFICATIONS
// ===============================

export async function createNotification(data){

  const {
    data:notification,
    error
  } = await supabaseAdmin
    .from('notifications')
    .insert({

      user_id:data.user_id,

      title:data.title,

      message:data.message,

      read:false

    })
    .select()
    .single()



  if(error){

    throw new Error(error.message)

  }


  return notification

}



export async function getNotifications(userId){

  const {
    data,
    error
  } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq(
      'user_id',
      userId
    )
    .order(
      'created_at',
      {
        ascending:false
      }
    )


  if(error){

    throw new Error(error.message)

  }


  return data

}



export async function markNotificationRead(id){

  const {
    data,
    error
  } = await supabaseAdmin
    .from('notifications')
    .update({
      read:true
    })
    .eq('id',id)
    .eq('user_id',userId)
    .select()
    .single()



  if(error){

    throw new Error(error.message)

  }


  return data

}



// ===============================
// EMAIL / SMS
// ===============================


export async function sendEmailNotification(
  to,
  subject,
  message
){

  try {

    const response =
      await axios.post(
        '/api/notifications',
        {
          type:'email',
          to,
          subject,
          message,
        }
      )


    return response.data


  } catch(error){

    throw new Error(
      `Failed to send email: ${error.message}`
    )

  }

}




export async function sendSmsNotification(
  phoneNumber,
  message
){

  try {

    const response =
      await axios.post(
        '/api/notifications',
        {
          type:'sms',
          phoneNumber,
          message,
        }
      )


    return response.data


  } catch(error){

    throw new Error(
      `Failed to send SMS: ${error.message}`
    )

  }

}




export async function sendBookingConfirmation(
  userEmail,
  bookingDetails
){

  const subject =
    'Bokningsbekräftelse'


  const message = `

Din bokning har bekräftats.

Datum:
${bookingDetails.date}

Tid:
${bookingDetails.time}

Tjänst:
${bookingDetails.serviceType}

`


  return sendEmailNotification(
    userEmail,
    subject,
    message
  )

}




export async function sendBookingReminder(
  userEmail,
  bookingDetails
){

  const subject =
    'Påminnelse om bokning'


  const message = `

Påminnelse: Du har en bokning imorgon.

Tid:
${bookingDetails.time}

Tjänst:
${bookingDetails.serviceType}

`


  return sendEmailNotification(
    userEmail,
    subject,
    message
  )

}