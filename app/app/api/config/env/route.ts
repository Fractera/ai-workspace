import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const ENV_PATH = resolve(process.cwd(), ".env.local");

const READONLY_KEYS = new Set(["NODE_ENV"]);

function parseEnv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    result[key] = val;
  }
  return result;
}

function serializeEnv(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n") + "\n";
}

export async function GET() {
  try {
    const content = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
    const vars = parseEnv(content);
    return NextResponse.json({ vars });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { vars } = await request.json() as { vars: Record<string, string> };

    if (!vars || typeof vars !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    for (const key of Object.keys(vars)) {
      if (READONLY_KEYS.has(key)) {
        return NextResponse.json({ error: `Key "${key}" is read-only` }, { status: 400 });
      }
    }

    writeFileSync(ENV_PATH, serializeEnv(vars), "utf8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
