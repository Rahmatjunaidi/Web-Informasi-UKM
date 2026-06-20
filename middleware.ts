import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  canAccessRoute,
  defaultLoginRedirect,
  isAuthRoute,
  isPublicRoute,
} from "@/lib/auth/permissions";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl } = request;
  const isLoggedIn = Boolean(request.auth);
  const pathname = nextUrl.pathname;

  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      // Redirect logged-in users away from auth pages to role-appropriate landing
      const role = request.auth?.user?.role as string | undefined;
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      // MEMBER and any other roles land on public root
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
  }

  if (!isPublicRoute(pathname) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  if (isLoggedIn && !canAccessRoute(pathname, request.auth?.user.role)) {
    // If user is logged in but not allowed to access this route, redirect to role-appropriate landing
    const role = request.auth?.user?.role as string | undefined;
    if (role === "MEMBER") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
