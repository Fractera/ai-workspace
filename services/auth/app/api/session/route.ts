import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

const ALLOWED = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): HeadersInit {
  if (!origin || !ALLOWED.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(origin),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "cookie, content-type",
    },
  });
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers: corsHeaders(origin),
    });
  }

  return NextResponse.json(
    {
      userId: session.user.id,
      email: session.user.email,
      roles: (session.user as { roles?: string[] }).roles ?? ["user"],
    },
    { headers: corsHeaders(origin) }
  );
}
