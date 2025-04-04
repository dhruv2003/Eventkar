import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/create-event',
  '/api/events/create',
];

// Paths that should be accessible only to non-authenticated users
const authPaths = ['/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect all root requests to the auth page for non-authenticated users
  if (pathname === '/') {
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }
  
  // Check if the user is authenticated by looking for auth cookie or header
  const user = request.cookies.get('user')?.value;
  const isAuthenticated = !!user;
  
  // Redirect root to auth page for non-authenticated users
  if (pathname === '/' && !isAuthenticated) {
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }
  
  // Redirect root to dashboard for authenticated users
  if (pathname === '/' && isAuthenticated) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }
  
  // For protected paths, redirect to auth if not authenticated
  if (protectedPaths.some(path => pathname.startsWith(path)) && !isAuthenticated) {
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }
  
  // For auth paths, redirect to dashboard if already authenticated
  if (authPaths.includes(pathname) && isAuthenticated) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/create-event/:path*',
    '/api/events/create',
    '/auth',
  ],
};