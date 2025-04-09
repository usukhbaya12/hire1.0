import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  const userRole = isAuthenticated ? token.role : null;

  if (!isAuthenticated) {
    if (
      pathname === "/me" ||
      pathname.startsWith("/me/") ||
      pathname.startsWith("/test/details/") ||
      pathname.startsWith("/tests/")
    ) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(url);
    }
  } else {
    if (pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (userRole === 20 && pathname.startsWith("/tests/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (userRole === 30 && pathname.startsWith("/test/details/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/me",
    "/me/:path*",
    "/test/details/:path*",
    "/tests/:path*",
    "/auth/:path*",
  ],
};
