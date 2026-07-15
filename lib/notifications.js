import axios from 'axios'

export async function sendEmailNotification(to, subject, message) {
  try {
    const response = await axios.post('/api/notifications', {
      type: 'email',
      to,
      subject,
      message,
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export async function sendSmsNotification(phoneNumber, message) {
  try {
    const response = await axios.post('/api/notifications', {
      type: 'sms',
      phoneNumber,
      message,
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to send SMS: ${error.message}`)
  }
}

export async function sendBookingConfirmation(userEmail, bookingDetails) {
  const subject = 'Bokningsbekräftelse'
  const message = `
    Din bokning har bekräftats.
    Datum: ${bookingDetails.date}
    Tid: ${bookingDetails.time}
    Tjänst: ${bookingDetails.serviceType}
  `
  return sendEmailNotification(userEmail, subject, message)
}

export async function sendBookingReminder(userEmail, bookingDetails) {
  const subject = 'Påminnelse om bokning'
  const message = `
    Påminnelse: Du har en bokning imorgon.
    Tid: ${bookingDetails.time}
    Tjänst: ${bookingDetails.serviceType}
  `
  return sendEmailNotification(userEmail, subject, message)
}
