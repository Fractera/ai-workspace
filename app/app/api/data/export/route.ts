import { NextResponse } from "next/server";
import archiver from "archiver";
import { existsSync } from "fs";
import { join } from "path";
import { PassThrough } from "stream";

const DB_PATH      = join(process.cwd(), "database.sqlite");
const DATA_DB_PATH = join(process.cwd(), "data", "fractera-light.db");
const STORAGE_PATH = join(process.cwd(), "storage");

export async function GET() {
  const dbPath = existsSync(DATA_DB_PATH) ? DATA_DB_PATH : DB_PATH;

  const pass = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 6 } });

  archive.pipe(pass);

  // Add database
  if (existsSync(dbPath)) {
    archive.file(dbPath, { name: "database.sqlite" });
  }

  // Add storage folder
  if (existsSync(STORAGE_PATH)) {
    archive.directory(STORAGE_PATH, "storage");
  }

  archive.finalize();

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    pass.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    pass.on("end", resolve);
    pass.on("error", reject);
    archive.on("error", reject);
  });

  const buffer = Buffer.concat(chunks);
  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="fractera-backup-${date}.zip"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
