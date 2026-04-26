import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(_request: NextRequest): NextResponse {
  return NextResponse.next();
}
