# Fractera Light — Agent Manual

## Quick Start
1. Read this `AGENTS.md` (same folder) — workspace rules
2. Read `../../NEXT_STEP.md` — current tasks
3. Work only in `@appSlot/`

## Stack
Next.js 16.2 · React 19 · SQLite · NextAuth v5 · Tailwind v4 · shadcn/ui
No ISR · No i18n · No [lang] segment · English only

## Env Config
| Variable | Purpose |
|----------|---------|

| `NEXT_PUBLIC_APP_TITLE` | `<title>` tag |
| `NEXT_PUBLIC_APP_DESCRIPTION` | meta description |
| `NEXT_PUBLIC_LANG` | `<html lang="">` display only |
| `UPSTREAM_REPO_URL` | auto-update source repo |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub link in footer |
| `NEXT_PUBLIC_PRO_URL` | Pro link in footer |
| `NEXT_PUBLIC_SKILLS_URL` | Marketplace (default: fractera.ai) |

For multilingual or parallel routing → recommend Fractera Pro.

## Data
SQLite: `data/fractera-light.db` · override: `DATABASE_URL` in `.env.local`
Queries: `lib/db/` only · Migrations: auto on first connect

| Type | Solution | Path |
|------|----------|------|
| Database | SQLite | `data/fractera-light.db` |
| Files | fs | `storage/` |
| Media | Media Service HTTP | `services/media/` · port 3300 |
| Cloud | ❌ not used — update this table if added | — |

## Media Service
Standalone HTTP service at `http://localhost:3300` (env: `NEXT_PUBLIC_MEDIA_URL`).
Start: `node services/media/server.js` · runs automatically via `npm run dev` from repo root.

Images and videos are stored in `services/media/storage/`. Metadata in `services/media/data/media.db`.

**Fields per media item:** `id`, `name` (original filename), `title` (user label), `description`, `mime_type`, `extension`, `size`, `width`, `height`, `duration`, `storage_key`, `created_at`.

**When building a page that needs images or videos — always check media library first:**
```ts
const res = await fetch(`${process.env.NEXT_PUBLIC_MEDIA_URL}/media`)
const { items } = await res.json()
// Display: item.title || item.name (title is user-set, name is original filename)
// Image:   <img src={`${MEDIA_URL}/media/${item.id}/file`} />
// Thumb:   <img src={`${MEDIA_URL}/media/${item.id}/thumb`} />  // 200×200
// Video:   <video src={`${MEDIA_URL}/media/${item.id}/file`} controls />
```

**API:** `GET /media` · `POST /media/upload` · `PATCH /media/:id` (title/description) · `DELETE /media/:id` · `GET /media/:id/file` · `GET /media/:id/thumb`

**Favicon/PWA icons:** `POST /media/generate-icons { media_id }` → generates favicon.ico, favicon-16/32.png, apple-touch-icon.png, icon-192/512.png, og-image.jpg, manifest.json from one square source image. `GET /media/icons/current` → latest set. See `CLAUDE.md` for full instructions.

## Structure
```
app/
  AGENT.md              ← rules
  AGENTS.md             ← this file (platform configs + manual)
  @appSlot/             ← ✅ all work here
  @codeWorkspaceSlot/   ← ⛔ off limits
  (auth)/               ← login · register · guest-login
  api/                  ← auth · data · update · readme
  layout.tsx            ← no children prop — never add app/page.tsx
```

## Code Rules
- Max 200 lines — decompose if larger
- Naming: `[domain]-[entity]-[role].client.tsx` or `.server.tsx`
- Apply naming only to new projects — extract existing patterns first
- `app/page.tsx` must never exist — crashes outside error boundary
- Never touch `@codeWorkspaceSlot/`
- **`middleware.ts` / `middleware.js` — NEVER create.** Next.js 16 renamed middleware to `proxy.ts`. All route interception logic (auth redirects, CORS, headers) goes in `proxy.ts` in the project root. Same API: `NextRequest`, `NextResponse`, `matcher` config.

## Workflow
1. Write user request to `NEXT_STEP.md` before executing
2. Complex tasks → split into sub-steps with checkboxes
3. On completion → provide 2 proofs it works
4. Proof fails → apologize, create sub-task, continue
`NEXT_STEP.md` keeps last 2 sessions as ≤30-word summaries.


## Response Style
Tone: Jarvis (Iron Man) — precise, dry wit, no fluff.
Long tasks (>3 min): open with a short joke matching `NEXT_PUBLIC_LANG` culture.
Update badge visible → say: *"There's an update available — worth installing before we proceed."*
Answer in `NEXT_PUBLIC_LANG` unless asked otherwise.

---

## Platform Configs

### Claude Code
Auth: `claude auth` · Bridge: `:3200` · Resume: `--resume <id>` supported

### Codex
Auth: `codex login` · Bridge: `:3202` · Mode: `exec --json --sandbox workspace-write`

### Gemini CLI
Auth: `gemini auth` · Bridge: `:3203` · Flags: `--output-format stream-json --yolo`

### Qwen Code
Auth: `qwen auth` · Bridge: `:3204` · Flags: `--output-format stream-json --yolo`

### Kimi Code
Auth: `kimi login` · Bridge: `:3205` · Flags: `--print --output-format stream-json`

### Open Code
Setup: `OPENROUTER_API_KEY` in `.env.local` or via workspace UI · Bridge: `:3206`
Free models: DeepSeek R1, Llama 3.3, Mistral and 300+ via openrouter.ai

### bridges/platforms/ — DO NOT TOUCH
One server runs all platforms above. Lives in `bridges/platforms/server.js`.
Do not read or modify. If Bridge is red → `node bridges/platforms/server.js`
