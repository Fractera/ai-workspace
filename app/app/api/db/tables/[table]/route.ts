import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function getValidTables(db: ReturnType<typeof getDb>): Set<string> {
  const rows = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    .all() as { name: string }[];
  return new Set(rows.map((r) => r.name));
}

export async function GET(_req: Request, { params }: { params: Promise<{ table: string }> }) {
  try {
    const { table } = await params;
    const db = getDb();

    if (!getValidTables(db).has(table)) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const columns = (db.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[])
      .map((c) => c.name);

    const rows = db.prepare(`SELECT * FROM "${table}" LIMIT 500`).all();

    return NextResponse.json({ columns, rows });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
