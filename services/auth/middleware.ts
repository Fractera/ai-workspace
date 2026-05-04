import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://partner.fractera.ai https://*.partner.fractera.ai " +
    "http://partner.fractera.local:3000"
  );
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
