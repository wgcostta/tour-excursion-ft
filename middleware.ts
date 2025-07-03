import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to public routes
    if (
      pathname.startsWith('/api/auth') ||
      pathname === '/' ||
      pathname.startsWith('/excursoes') ||
      pathname.startsWith('/sobre') ||
      pathname.startsWith('/contato') ||
      pathname.startsWith('/auth')
    ) {
      return NextResponse.next();
    }

    // Protect organizador routes
    if (pathname.startsWith('/organizador')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      
      if (token.userType !== 'ORGANIZADOR') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Protect cliente routes
    if (pathname.startsWith('/cliente')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      
      if (token.userType !== 'CLIENTE') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes without authentication
        if (
          pathname.startsWith('/api/auth') ||
          pathname === '/' ||
          pathname.startsWith('/excursoes') ||
          pathname.startsWith('/sobre') ||
          pathname.startsWith('/contato') ||
          pathname.startsWith('/auth')
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

