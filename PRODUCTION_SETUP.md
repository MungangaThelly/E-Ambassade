# E-Ambassade Production Setup Guide

## Email Confirmation Issue

### Problem
When deploying to production, users encounter an "Email not confirmed" error when trying to create bookings, even though they successfully registered and logged in.

### Root Cause
Supabase is configured to require email confirmation before users can perform certain database operations. This setting is found in your Supabase project settings and needs to be adjusted for the booking flow to work smoothly.

### Solutions

#### Option 1: Disable Email Confirmation (Recommended for MVP)
1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers** → **Email**
3. Disable **"Confirm email"** toggle
4. This allows users to register and immediately access all features

**Pros**: Users can book immediately after registration  
**Cons**: Less email verification security

#### Option 2: Auto-Confirm Emails (Development/Testing)
1. Enable email confirmation in Supabase settings
2. Use Supabase's email template features to auto-confirm test accounts
3. For production, integrate a proper email confirmation flow

**Pros**: Better security practices  
**Cons**: Requires email verification workflow

#### Option 3: Handle in Application (Current Implementation)
The app now handles the "Email not confirmed" error gracefully:
- Users see a friendly Swedish message: "Vänligen bekräfta din e-postadress innan du gör en bokning..."
- Error is returned with status 403 (Forbidden)
- Users are directed to check their email

### Recommended Setup for Production

1. **For Testing/MVP**: Use Option 1 (disable email confirmation)
2. **For Production**: Use Option 2 with proper email verification
3. **API Error Handling**: Already implemented (Option 3)

### Environment Variables

Ensure these are set in Vercel:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Service
RESEND_API_KEY=your_resend_api_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://e-ambassade.vercel.app
```

### Testing

After making changes:
1. Test registration on production
2. Attempt to create a booking
3. Verify email is received

### Email Templates

Booking confirmation emails are sent using Resend with these templates:
- `BookingConfirmed` - Sent on booking creation
- `BookingCompleted` - Sent when admin marks booking as complete
- `BookingCancelled` - Sent when admin cancels booking

### Support

For Supabase issues, check:
- [Supabase Email Auth Documentation](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase Dashboard Settings](https://app.supabase.com/)

For Resend issues, check:
- [Resend Documentation](https://resend.com/docs)
- [Resend API Key Setup](https://resend.com/api-keys)
