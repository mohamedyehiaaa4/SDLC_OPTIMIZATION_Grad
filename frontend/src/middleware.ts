import { NextResponse, type NextRequest } from "next/server";

// Cookie names are set by the backend (backend/app/auth/cookies.py).
const ACCESS_COOKIE = "repomind_access";
const REFRESH_COOKIE = "repomind_refresh";

// A convenience guard: it only checks that a session cookie exists, so
// logged-out visitors never see the dashboard shell. The real security check
// is the backend verifying the token on every API call.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = request.cookies.has(ACCESS_COOKIE);
  const hasRefresh = request.cookies.has(REFRESH_COOKIE);

  // An expired access token can still be renewed with the refresh cookie.
  if (pathname.startsWith("/dashboard") && !hasAccess && !hasRefresh) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Only the access cookie counts here; otherwise a dead refresh cookie could
  // bounce the user between /login and /dashboard.
  if ((pathname === "/login" || pathname === "/signup") && hasAccess) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
