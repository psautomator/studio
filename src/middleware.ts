
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/; // Regex to identify public files (e.g., images, fonts)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js specific paths and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') || // Exclude API routes
    pathname.startsWith('/static') || // If you have a /static folder
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale prefix
  const hasLocalePrefix = /^\/(en|nl)/.test(pathname);

  if (!hasLocalePrefix) {
    // Default to 'nl' if no prefix is found
    // You could implement more sophisticated logic here (e.g., Accept-Language header, cookie)
    const defaultLocale = 'nl'; 
    request.nextUrl.pathname = `/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

// Define paths for which the middleware should not run
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
