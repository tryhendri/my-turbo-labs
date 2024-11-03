import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEYS } from './utils/cookies';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/sign-in' || path === '/sign-up';

  const token = request.cookies.get(COOKIE_KEYS.AUTH_TOKEN)?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
