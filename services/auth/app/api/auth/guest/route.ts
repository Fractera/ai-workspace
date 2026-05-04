import { NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth/auth";
import { getDb } from "@/lib/db";
import { nanoid } from "nanoid";
import crypto from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const session = await auth();
  if (session?.user) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const guestEmail = `guest_${crypto.randomUUID()}@fractera.guest`;
  const db = getDb();

  db.prepare(
    "INSERT INTO users (id, email, nickname, roles, provider) VALUES (?, ?, ?, ?, ?)"
  ).run(nanoid(), guestEmail, "Guest", JSON.stringify(["guest"]), "guest");

  return signIn("credentials", { email: guestEmail, redirectTo: redirectUrl });
}
