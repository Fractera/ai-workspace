import { NextResponse } from "next/server";
import unzipper from "unzipper";
import { createWriteStream, mkdirSync } from "fs";
import { join, dirname } from "path";
import { Readable } from "stream";

const DATA_DIR     = join(process.cwd(), "data");
const STORAGE_PATH = join(process.cwd(), "storage");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "File must be a .zip" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const readable = Readable.from(buffer);

    await new Promise<void>((resolve, reject) => {
      readable
        .pipe(unzipper.Parse())
        .on("entry", (entry) => {
          const fileName: string = entry.path;
          const type: string = entry.type;

          if (fileName === "database.sqlite") {
            mkdirSync(DATA_DIR, { recursive: true });
            const dest = join(DATA_DIR, "fractera-light.db");
            entry.pipe(createWriteStream(dest));
          } else if (fileName.startsWith("storage/")) {
            const dest = join(STORAGE_PATH, fileName.slice("storage/".length));
            if (type === "Directory") {
              mkdirSync(dest, { recursive: true });
              entry.autodrain();
            } else {
              mkdirSync(dirname(dest), { recursive: true });
              entry.pipe(createWriteStream(dest));
            }
          } else {
            entry.autodrain();
          }
        })
        .on("finish", resolve)
        .on("error", reject);
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
