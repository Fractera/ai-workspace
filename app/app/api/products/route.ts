import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const products = db.prepare(
    "SELECT * FROM products ORDER BY created_at DESC"
  ).all()
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const { name, price, media_id, media_url } = await req.json()

  if (!name?.trim() || price == null) {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 })
  }

  const id = crypto.randomUUID()
  db.prepare(
    "INSERT INTO products (id, name, price, media_id, media_url) VALUES (?, ?, ?, ?, ?)"
  ).run(id, String(name).trim(), Number(price), media_id ?? null, media_url ?? null)

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  return NextResponse.json({ product }, { status: 201 })
}
