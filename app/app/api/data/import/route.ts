import { NextResponse } from "next/server";
import unzipper from "unzipper";
import { createWriteStream, mkdirSync, existsSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { Readable } from "stream";
import Database from "better-sqlite3";
import { getDb } from "@/lib/db";

const DATA_DIR     = join(process.cwd(), "data");
const DB_PATH      = join(DATA_DIR, "fractera-light.db");
const STORAGE_PATH = join(process.cwd(), "storage");
const BACKUP_DIR   = join(DATA_DIR, "backups");

function autoBackup() {
  if (!existsSync(DB_PATH)) return;
  mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  copyFileSync(DB_PATH, join(BACKUP_DIR, `pre-import-${stamp}.db`));
}

function mergeDatabase(importedDbBuffer: Buffer): { users: number; sessions: number; accounts: number; tokens: number } {
  const tmpPath = join(DATA_DIR, "_import_tmp.db");
  mkdirSync(DATA_DIR, { recursive: true });

  // Write imported DB to temp file
  require("fs").writeFileSync(tmpPath, importedDbBuffer);

  const src  = new Database(tmpPath, { readonly: true });
  const dest = getDb();

  const stats = { users: 0, sessions: 0, accounts: 0, tokens: 0 };

  dest.transaction(() => {
    // users — skip on email conflict (preserve existing)
    const srcUsers = src.prepare("SELECT * FROM users").all() as Record<string, unknown>[];
    const insertUser = dest.prepare(`
      INSERT OR IGNORE INTO users
        (id, email, nickname, password, roles, avatar_url, bio, locale, timezone,
         provider, email_verified, is_active, last_login_at, created_at, updated_at)
      VALUES
        (@id, @email, @nickname, @password, @roles, @avatar_url, @bio, @locale, @timezone,
         @provider, @email_verified, @is_active, @last_login_at, @created_at, @updated_at)
    `);
    for (const row of srcUsers) {
      const { changes } = insertUser.run(row);
      stats.users += changes;
    }

    // sessions
    const srcSessions = src.prepare("SELECT * FROM sessions").all() as Record<string, unknown>[];
    const insertSession = dest.prepare(`
      INSERT OR IGNORE INTO sessions (id, user_id, expires, session_token)
      VALUES (@id, @user_id, @expires, @session_token)
    `);
    for (const row of srcSessions) {
      const { changes } = insertSession.run(row);
      stats.sessions += changes;
    }

    // accounts
    const srcAccounts = src.prepare("SELECT * FROM accounts").all() as Record<string, unknown>[];
    const insertAccount = dest.prepare(`
      INSERT OR IGNORE INTO accounts
        (id, user_id, type, provider, provider_account_id, access_token, refresh_token, expires_at)
      VALUES
        (@id, @user_id, @type, @provider, @provider_account_id, @access_token, @refresh_token, @expires_at)
    `);
    for (const row of srcAccounts) {
      const { changes } = insertAccount.run(row);
      stats.accounts += changes;
    }

    // verification_tokens
    const srcTokens = src.prepare("SELECT * FROM verification_tokens").all() as Record<string, unknown>[];
    const insertToken = dest.prepare(`
      INSERT OR IGNORE INTO verification_tokens (identifier, token, expires)
      VALUES (@identifier, @token, @expires)
    `);
    for (const row of srcTokens) {
      const { changes } = insertToken.run(row);
      stats.tokens += changes;
    }
  })();

  src.close();
  require("fs").unlinkSync(tmpPath);

  return stats;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!file.name.endsWith(".zip")) return NextResponse.json({ error: "File must be a .zip" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract zip entries into memory first
    let dbBuffer: Buffer | null = null;
    const storageFiles: { path: string; data: Buffer }[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer)
        .pipe(unzipper.Parse())
        .on("entry", (entry) => {
          const fileName: string = entry.path;
          const type: string     = entry.type;
          const chunks: Buffer[] = [];

          if (fileName === "database.sqlite") {
            entry.on("data", (c: Buffer) => chunks.push(c));
            entry.on("end", () => { dbBuffer = Buffer.concat(chunks); });
          } else if (fileName.startsWith("storage/") && type !== "Directory") {
            entry.on("data", (c: Buffer) => chunks.push(c));
            entry.on("end", () => {
              storageFiles.push({ path: fileName.slice("storage/".length), data: Buffer.concat(chunks) });
            });
          } else {
            entry.autodrain();
          }
        })
        .on("finish", resolve)
        .on("error", reject);
    });

    // Auto-backup before any writes
    autoBackup();

    // Merge database
    let dbStats = { users: 0, sessions: 0, accounts: 0, tokens: 0 };
    if (dbBuffer) {
      dbStats = mergeDatabase(dbBuffer);
    }

    // Merge storage — only write files that don't exist yet
    let filesAdded = 0;
    for (const { path, data } of storageFiles) {
      const dest = join(STORAGE_PATH, path);
      if (!existsSync(dest)) {
        mkdirSync(dirname(dest), { recursive: true });
        require("fs").writeFileSync(dest, data);
        filesAdded++;
      }
    }

    return NextResponse.json({
      ok: true,
      merged: {
        users:    dbStats.users,
        sessions: dbStats.sessions,
        accounts: dbStats.accounts,
        tokens:   dbStats.tokens,
        files:    filesAdded,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
