import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

if (!secret) {
  console.error('[MIDDLEWARE] WARNING: No NEXTAUTH_SECRET or AUTH_SECRET set!')
}

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: secret,
  })

  // Log for debugging
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/booking')) {
    console.log(`[MIDDLEWARE] Path: ${pathname}, Token exists: ${!!token}`)
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
