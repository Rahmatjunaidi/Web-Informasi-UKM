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
      return NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
    }

    return NextResponse.next();
  }

  if (!isPublicRoute(pathname) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  if (isLoggedIn && !canAccessRoute(pathname, request.auth?.user.role)) {
    return NextResponse.redirect(new URL(defaultLoginRedirect, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
