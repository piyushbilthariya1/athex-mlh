import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key_for_development";
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  // Protect /workspace routes
  if (request.nextUrl.pathname.startsWith('/workspace')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, encodedKey);
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Prevent logged-in users from accessing /login or /signup
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    if (token) {
      try {
        await jwtVerify(token, encodedKey);
        return NextResponse.redirect(new URL('/workspace', request.url));
      } catch (error) {
        // Invalid token, let them access login/signup
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workspace/:path*', '/login', '/signup'],
};
