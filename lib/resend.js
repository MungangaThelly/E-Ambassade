import { Resend } from 'resend'

let resendInstance = null


export function getResend() {

  const apiKey =
    process.env.RESEND_API_KEY


  console.log(
    '[RESEND] getResend() called, apiKey present:',
    !!apiKey
  )


  if(!apiKey){

    throw new Error(
      'RESEND_API_KEY environment variable is not set'
    )

  }



  if(!resendInstance){

    console.log(
      '[RESEND] Creating Resend instance'
    )


    resendInstance =
      new Resend(apiKey)


    console.log(
      '[RESEND] Resend instance ready'
    )

  }


  return resendInstance

}