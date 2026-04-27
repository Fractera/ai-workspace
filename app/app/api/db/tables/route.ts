import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
      .all() as { name: string }[];
    return NextResponse.json({ tables: rows.map((r) => r.name) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
