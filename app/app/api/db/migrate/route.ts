import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST — execute arbitrary SQL (CREATE TABLE, ALTER TABLE, CREATE INDEX, etc.)
// Returns affected rows count and last insert rowid where applicable.
export async function POST(req: Request) {
  try {
    const { sql } = await req.json() as { sql: string };

    if (!sql || typeof sql !== "string" || !sql.trim()) {
      return NextResponse.json({ error: "sql field is required" }, { status: 400 });
    }

    const db = getDb();

    // Execute — supports multi-statement via exec for DDL, run for DML
    const upper = sql.trim().toUpperCase();
    const isDDL = upper.startsWith("CREATE") || upper.startsWith("ALTER") ||
                  upper.startsWith("DROP")   || upper.startsWith("PRAGMA");

    if (isDDL) {
      db.exec(sql);
      return NextResponse.json({ ok: true });
    }

    const result = db.prepare(sql).run();
    return NextResponse.json({ ok: true, changes: result.changes, lastInsertRowid: result.lastInsertRowid });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
