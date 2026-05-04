import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";
const AUTH_LOGIN   = process.env.NEXT_PUBLIC_AUTH_URL
  ? `${process.env.NEXT_PUBLIC_AUTH_URL}/login`
  : "http://auth.partner.fractera.local:3001/login";

export async function proxy(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";

  let ok = false;
  try {
    const res = await fetch(`${AUTH_SERVICE}/api/session`, {
      headers: { cookie },
      signal: AbortSignal.timeout(3000),
    });
    ok = res.ok;
  } catch {
    ok = false;
  }

  if (!ok) {
    const loginUrl = new URL(AUTH_LOGIN);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/bridges).*)"],
};
