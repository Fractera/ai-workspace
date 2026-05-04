import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Auth routes that redirect to "/" if already logged in
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // Accept cookie from shared domain (.partner.fractera.local) set by services/auth
    const sessionToken =
      request.cookies.get("authjs.session-token") ??
      request.cookies.get("__Secure-authjs.session-token");

    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
