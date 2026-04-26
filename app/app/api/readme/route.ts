import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

function getRawReadmeUrl(repoUrl: string): string {
  const clean = repoUrl.replace(/\.git$/, "");
  return clean.replace("https://github.com/", "https://raw.githubusercontent.com/") + "/main/README.md";
}

export async function GET() {
  // 1. Try local README.md first — no network, no rate limits
  const localPath = join(process.cwd(), "README.md");
  if (existsSync(localPath)) {
    const content = readFileSync(localPath, "utf8");
    return NextResponse.json({ content, source: "local" });
  }

  // 2. Fetch from upstream GitHub (raw.githubusercontent.com — public CDN, no auth needed)
  // Rate limit: 60 req/hour per IP. Cache: 1h → effectively 1 req/hour per server.
  const repoUrl = process.env.UPSTREAM_REPO_URL;
  if (!repoUrl) {
    return NextResponse.json({ content: "# Fractera Light\n\nAdd a README.md to the project root, or set UPSTREAM_REPO_URL in .env.local." });
  }

  try {
    const rawUrl = getRawReadmeUrl(repoUrl);
    const res = await fetch(rawUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
    const content = await res.text();
    return NextResponse.json({ content, source: "github" });
  } catch {
    return NextResponse.json({ content: "# Fractera Light\n\nCould not load README.\n\nAdd README.md to the project root or check UPSTREAM_REPO_URL." });
  }
}
