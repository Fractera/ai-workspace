import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/^file:/, "")
  : path.join(process.cwd(), "data", "auth.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    const { runMigrations } = require("./migrations");
    runMigrations();
  }
  return _db;
}
