import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

if (!secret) {
  console.error('[MIDDLEWARE] WARNING: No NEXTAUTH_SECRET or AUTH_SECRET set!')
}

// Get cookie name based on environment
const cookieName = `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`

export async function middleware(request) {
  // Try to get token using getToken
  let token = await getToken({
    req: request,
    secret: secret,
    raw: false,
  })

  // If getToken fails, try reading the cookie directly
  if (!token) {
    const cookieValue = request.cookies.get(cookieName)?.value
    console.log(`[MIDDLEWARE] Cookie lookup for "${cookieName}": ${cookieValue ? 'found' : 'not found'}`)
    if (cookieValue) {
      console.log(`[MIDDLEWARE] Found cookie, but getToken returned null. Cookie value starts with: ${cookieValue.substring(0, 20)}...`)
    }
    // Also check what cookies ARE present
    const allCookies = request.cookies.getAll()
    console.log(`[MIDDLEWARE] All cookies present: ${allCookies.map(c => c.name).join(', ')}`)
  }

  // Log for debugging
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/booking')) {
    console.log(`[MIDDLEWARE] Path: ${pathname}, Token exists: ${!!token}, NODE_ENV: ${process.env.NODE_ENV}`)
    if (token) {
      console.log(`[MIDDLEWARE] Token user: ${token.email}, Role: ${token.role}`)
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      console.log(`[MIDDLEWARE] Denying admin access - token: ${!!token}, role: ${token?.role}`)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log(`[MIDDLEWARE] Denying dashboard access - no token`)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Protect booking routes
  if (request.nextUrl.pathname.startsWith('/booking')) {
    if (!token) {
      console.log(`[MIDDLEWARE] Denying booking access - no token`)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/booking/:path*'],
}
