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

    const url = new URL(_req.url);
    const search = url.searchParams.get("search") ?? "";
    const limit  = Math.min(parseInt(url.searchParams.get("limit") ?? "500"), 1000);
    const offset = parseInt(url.searchParams.get("offset") ?? "0");

    const columns = (db.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[])
      .map((c) => c.name);

    let rows: unknown[];
    if (search.trim()) {
      // Search across all text columns
      const textCols = columns.filter((c) => c !== "id");
      if (textCols.length === 0) {
        rows = db.prepare(`SELECT * FROM "${table}" LIMIT ? OFFSET ?`).all(limit, offset);
      } else {
        const conditions = textCols.map((c) => `"${c}" LIKE ?`).join(" OR ");
        const bindings   = textCols.map(() => `%${search}%`);
        rows = db.prepare(`SELECT * FROM "${table}" WHERE ${conditions} LIMIT ? OFFSET ?`)
          .all(...bindings, limit, offset);
      }
    } else {
      rows = db.prepare(`SELECT * FROM "${table}" LIMIT ? OFFSET ?`).all(limit, offset);
    }

    const total = (db.prepare(`SELECT COUNT(*) as n FROM "${table}"`).get() as { n: number }).n;

    return NextResponse.json({ columns, rows, total });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST — insert a new row
export async function POST(req: Request, { params }: { params: Promise<{ table: string }> }) {
  try {
    const { table } = await params;
    const db = getDb();

    if (!getValidTables(db).has(table)) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    const body = await req.json() as Record<string, unknown>;
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Body must be a non-empty object of column:value pairs" }, { status: 400 });
    }

    const validCols = new Set(
      (db.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[]).map((c) => c.name)
    );

    const cols = Object.keys(body).filter((k) => validCols.has(k));
    if (cols.length === 0) {
      return NextResponse.json({ error: "No valid columns provided" }, { status: 400 });
    }

    const placeholders = cols.map(() => "?").join(", ");
    const colList      = cols.map((c) => `"${c}"`).join(", ");
    const values       = cols.map((c) => body[c]);

    db.prepare(`INSERT INTO "${table}" (${colList}) VALUES (${placeholders})`).run(...values);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE — drop entire table
export async function DELETE(_req: Request, { params }: { params: Promise<{ table: string }> }) {
  try {
    const { table } = await params;
    const db = getDb();

    if (!getValidTables(db).has(table)) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    db.prepare(`DROP TABLE "${table}"`).run();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
