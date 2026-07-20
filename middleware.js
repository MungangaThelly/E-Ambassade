import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Try to get session using getServerSession (server method)
  const session = await getServerSession(authOptions)
  
  const pathname = request.nextUrl.pathname
  
  // Log for debugging
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/booking')) {
    console.log(`[MIDDLEWARE] Path: ${pathname}, Session exists: ${!!session}`)
    if (session) {
      console.log(`[MIDDLEWARE] Session user: ${session.user.email}, Role: ${session.user.role}`)
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || session.user.role !== 'admin') {
      console.log(`[MIDDLEWARE] Denying admin access`)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log(`[MIDDLEWARE] Denying dashboard access - no session`)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Protect booking routes
  if (request.nextUrl.pathname.startsWith('/booking')) {
    if (!session) {
      console.log(`[MIDDLEWARE] Denying booking access - no session`)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/booking/:path*'],
}
