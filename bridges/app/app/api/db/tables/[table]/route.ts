import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import { requireAuth } from "@/lib/require-auth";

const AUTH_DB = process.env.AUTH_DB_PATH ?? "/opt/fractera/services/auth/data/auth.db";

const ALLOWED_TABLES = new Set(["users", "sessions", "accounts", "verification_tokens"]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const ok = await requireAuth(req.headers.get("cookie") ?? "");
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table } = await params;
  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  try {
    const db = new Database(AUTH_DB, { readonly: true });
    const info = db.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[];
    const rows = db.prepare(`SELECT * FROM "${table}" LIMIT 500`).all();
    db.close();
    return NextResponse.json({ columns: info.map((c) => c.name), rows });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
