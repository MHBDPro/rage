import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const COOKIE_NAME = "rcsf-admin-token";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // If already logged in and trying to access login page, redirect to admin
  if (pathname === "/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Invalid token, allow access to login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
