import { Resend } from 'resend'

// Create a lazy-loaded singleton instance
let resendInstance = null
let lastError = null

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  
  console.log('[RESEND] getResend() called, apiKey present:', !!apiKey)
  
  if (!apiKey) {
    const error = 'RESEND_API_KEY environment variable is not set'
    console.error('[RESEND] ' + error)
    throw new Error(error)
  }
  
  if (!resendInstance) {
    try {
      console.log('[RESEND] Creating new Resend instance with API key')
      resendInstance = new Resend(apiKey)
      console.log('[RESEND] Resend instance created successfully')
    } catch (err) {
      console.error('[RESEND] Failed to create Resend instance:', err.message, err)
      lastError = err
      throw err
    }
  }
  
  return resendInstance
}