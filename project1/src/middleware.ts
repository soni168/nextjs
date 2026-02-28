import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/verifyemail' ||
    path === '/resetpassword' ||
    path === '/forgotpassword'

  const token = request.cookies.get('token')?.value || ''

  // ✅ Login/signup page pe token ho toh profile pe bhejo
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/profile', request.nextUrl))
  }

  // ✅ Protected page pe token na ho toh login pe bhejo
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}

export const config = {
  matcher: [
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/resetpassword',
    '/forgotpassword'
  ]
}