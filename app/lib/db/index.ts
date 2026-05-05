import Database from "better-sqlite3"
import { mkdirSync } from "fs"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
mkdirSync(DATA_DIR, { recursive: true })

export const db = new Database(join(DATA_DIR, "products.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id       TEXT PRIMARY KEY NOT NULL,
    name     TEXT NOT NULL,
    price    REAL NOT NULL DEFAULT 0,
    media_id TEXT,
    media_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)
