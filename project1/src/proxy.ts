import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/verifyemail' ||
    path === '/forgotpassword' ||
    path === '/resetpassword';

  const token = request.cookies.get('token')?.value || '';

  if (
  (path === "/login" || path === "/signup") &&
  token
) {
  return NextResponse.redirect(new URL("/profile", request.nextUrl));
}

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/forgotpassword',
    '/resetpassword',
  ],
};