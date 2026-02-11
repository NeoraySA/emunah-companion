import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware – protects /dashboard routes.
 *
 * Since JWT tokens are stored in localStorage (client-side),
 * we can't verify them in Edge middleware. Instead, we check for
 * a lightweight cookie flag that the client sets after login.
 *
 * The actual auth verification happens client-side in the AuthProvider.
 * This middleware provides a first-pass redirect for unauthenticated users.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes – no protection needed
  const publicPaths = ['/login', '/api', '/_next', '/favicon.ico'];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth cookie (set by client after login)
  const hasAuthCookie = request.cookies.has('emunah_auth');

  // If accessing dashboard without auth cookie → redirect to login
  if (pathname.startsWith('/dashboard') && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user visits /login → redirect to dashboard
  if (pathname === '/login' && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
