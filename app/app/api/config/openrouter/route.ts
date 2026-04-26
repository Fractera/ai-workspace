import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const ENV_PATH = resolve(process.cwd(), ".env.local");

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== "string" || !key.startsWith("sk-or-")) {
      return NextResponse.json(
        { error: "Invalid key. Must start with sk-or-" },
        { status: 400 }
      );
    }

    // Read current .env.local
    let content = "";
    try { content = readFileSync(ENV_PATH, "utf8"); } catch {}

    const line = `OPENROUTER_API_KEY=${key}`;

    // Remove any existing line (including commented-out versions)
    const lines = content.split("\n").filter(
      (l) => !l.match(/^#?\s*OPENROUTER_API_KEY=/)
    );
    lines.push(line);

    writeFileSync(ENV_PATH, lines.join("\n") + "\n", "utf8");

    // Restart bridge: try pm2 first, then respawn manually
    try {
      execSync("pm2 restart all 2>/dev/null", { shell: "/bin/zsh" });
    } catch {
      // No pm2 — kill and respawn bridge in background
      try {
        const bridgePath = resolve(process.cwd(), "../bridges/claude-code/server.js");
        execSync(`pkill -f 'node.*server.js' 2>/dev/null; sleep 1; nohup node ${bridgePath} >> /tmp/bridge.log 2>&1 &`, {
          shell: "/bin/zsh",
          env: process.env,
        });
      } catch {}
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  // Read directly from file — process.env only updates on Next.js restart
  let configured = false;
  try {
    const content = readFileSync(ENV_PATH, "utf8");
    configured = content.split("\n").some(
      (l) => l.match(/^OPENROUTER_API_KEY=\S+/)
    );
  } catch {}
  return NextResponse.json({ configured });
}
