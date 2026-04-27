import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function getValidTables(db: ReturnType<typeof getDb>): Set<string> {
  const rows = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    .all() as { name: string }[];
  return new Set(rows.map((r) => r.name));
}

function getValidColumns(db: ReturnType<typeof getDb>, table: string): Set<string> {
  const rows = db.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[];
  return new Set(rows.map((c) => c.name));
}

type Params = Promise<{ table: string; id: string }>;

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const { table, id } = await params;
    const db = getDb();

    if (!getValidTables(db).has(table)) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const { column, value } = await req.json() as { column: string; value: string };

    if (!getValidColumns(db, table).has(column)) {
      return NextResponse.json({ error: "Column not found" }, { status: 400 });
    }

    db.prepare(`UPDATE "${table}" SET "${column}" = ? WHERE id = ?`).run(value, id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    const { table, id } = await params;
    const db = getDb();

    if (!getValidTables(db).has(table)) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    db.prepare(`DELETE FROM "${table}" WHERE id = ?`).run(id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
