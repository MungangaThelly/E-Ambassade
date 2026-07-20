import { Resend } from 'resend'

// Create a lazy-loaded singleton instance
let resendInstance = null

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }
  
  if (!resendInstance) {
    resendInstance = new Resend(apiKey)
  }
  
  return resendInstance
}

// Backward compatible export (for testing)
export const resend = null