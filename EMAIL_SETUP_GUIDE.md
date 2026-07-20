# Email Setup Guide

## Problem
Booking confirmation and status update emails are not being sent to users.

## Root Cause
The `RESEND_API_KEY` environment variable is not set in Vercel production. The email sending code checks `if (process.env.RESEND_API_KEY)` before attempting to send emails - without this key, emails are silently skipped.

## Solution: Set RESEND_API_KEY on Vercel

### Step 1: Get a Resend API Key
1. Go to https://resend.com
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `re_`)

### Step 2: Add to Vercel Environment Variables
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select the `E-Ambassade` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `RESEND_API_KEY`
   - **Value:** (paste your API key from step 1)
   - **Environments:** Select `Production` (and optionally `Preview` and `Development`)
5. Click **Save**
6. Redeploy the project (or wait for next auto-deployment)

### Step 3: Verify Domain (Optional but Recommended)
In Resend:
1. Go to **Domains** section
2. Add domain: `e-ambassade.se` (or your custom domain)
3. Follow DNS verification steps
4. This allows sending from `noreply@e-ambassade.se` instead of `*.resend.dev`

## Email Triggers

Once `RESEND_API_KEY` is set, emails will be automatically sent:

### 1. Booking Confirmation Email
- **Triggered:** When user creates a new booking
- **Recipient:** User's email address
- **Subject:** "Bokningsbekräftelse - E-Ambassade"
- **Template:** BookingConfirmed.js
- **Contains:** Booking details, date, time, reference number

### 2. Booking Confirmation Email (Admin Confirm)
- **Triggered:** When admin confirms booking status to "confirmed"
- **Recipient:** User's email address
- **Subject:** "Bokning bekräftad - E-Ambassade"
- **Template:** BookingConfirmed.js

### 3. Booking Completion Email
- **Triggered:** When admin updates booking status to "completed"
- **Recipient:** User's email address
- **Subject:** "Bokning genomförd - E-Ambassade"
- **Template:** BookingCompleted.js
- **Contains:** Thank you message, appointment confirmation

### 4. Booking Cancellation Email
- **Triggered:** When booking is cancelled
- **Recipient:** User's email address
- **Subject:** "Bokning avbokad - E-Ambassade"
- **Template:** BookingCancelled.js
- **Contains:** Cancellation notice

## Debugging Email Sending

### Check Vercel Logs
1. Go to Vercel Dashboard → E-Ambassade project
2. Click **Deployments** tab
3. Select the latest deployment
4. Click **Logs** → **Functions**
5. Look for messages starting with `[BOOKING]` or `[BOOKING_UPDATE]`:
   - `RESEND_API_KEY not set` - Environment variable not configured
   - `Confirmation email sent` - Email was successfully sent
   - `EMAIL SEND ERROR` - Error occurred, see details

### Test Email Sending
1. Create a test booking from https://e-ambassade.nuhar.se/booking
2. Check Vercel function logs (see above)
3. Logs will show:
   - Whether RESEND_API_KEY was detected
   - Whether email was sent successfully
   - Any errors encountered

### Resend Dashboard
1. Go to https://resend.com
2. Check **Emails** section for:
   - Sent emails (green checkmark)
   - Failed emails (red X)
   - Delivery status and any bounce messages

## Troubleshooting

### "RESEND_API_KEY not set - email not sent"
- ✅ Solution: Add RESEND_API_KEY to Vercel environment variables (see Step 2 above)
- ✅ Verify: Check Vercel dashboard that the variable appears in Production environment

### Emails show in Resend but never reach user
- Check user's spam/junk folder
- Verify email address is correct in booking form
- Domain verification may be needed (see Step 3 above)
- Check SPF/DKIM records if using custom domain

### Emails not showing in Resend dashboard
- Verify RESEND_API_KEY is correct (starts with `re_`)
- Check Vercel logs for "EMAIL SEND ERROR" messages
- Ensure booking endpoints are being called (check POST /api/bookings and PATCH /api/bookings/[id])

## Email Templates

All email templates are in `lib/emails/`:
- `BookingConfirmed.js` - Confirmation email with booking details
- `BookingCompleted.js` - Completion/thank you email
- `BookingCancelled.js` - Cancellation notification

Templates use React Email components and are fully Swedish-localized.

## Cost
- Resend offers **100 free emails per day**
- For production use with higher volume, upgrade to paid plan
- Current application should stay within free tier for testing

## Next Steps
1. ✅ Add RESEND_API_KEY to Vercel (this enables emails)
2. ✅ Verify domain on Resend (improves deliverability)
3. ✅ Test by creating a booking
4. ✅ Check logs to confirm email was sent
5. ✅ Monitor Resend dashboard for email metrics
