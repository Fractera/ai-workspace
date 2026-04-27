# Fractera Light — Agent Manual

## Quick Start
1. Read this `CLAUDE.md` — workspace rules
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

| Type | Solution | Path |
|------|----------|------|
| Database | SQLite via HTTP API | `app/api/db/` |
| Media | Media Service HTTP | `http://localhost:3300` |
| Cloud | ❌ not used — update this table if added | — |

## Working with the Database — Agent Instructions

**Never** access the database file directly via sqlite3 CLI or file path. **Never** use `better-sqlite3` in new code outside `lib/db/`. Always use the HTTP API at `http://localhost:3000/api/db/`.

### List tables
```bash
curl http://localhost:3000/api/db/tables
# → { "tables": ["users", "sessions", ...] }
```

### Get table structure and rows
```bash
curl "http://localhost:3000/api/db/tables/users"
# → { "columns": [...], "rows": [...], "total": 5 }

# With search (searches all text columns):
curl "http://localhost:3000/api/db/tables/users?search=john"

# With pagination:
curl "http://localhost:3000/api/db/tables/users?limit=20&offset=40"
```

### Create a new table
```bash
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d $'{"sql": "CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT, created_at TEXT DEFAULT (datetime(\'now\')))"}'
```

### Insert a row
```bash
curl -X POST http://localhost:3000/api/db/tables/posts \
  -H "Content-Type: application/json" \
  -d '{"id": "uuid-here", "title": "Hello", "body": "World"}'
```

### Update a cell
```bash
curl -X PATCH http://localhost:3000/api/db/tables/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"column": "nickname", "value": "new_name"}'
```

### Delete a row
```bash
curl -X DELETE http://localhost:3000/api/db/tables/users/USER_ID
```

### Drop a table
```bash
curl -X DELETE http://localhost:3000/api/db/tables/posts
```

### Run arbitrary SQL (ALTER TABLE, CREATE INDEX, etc.)
```bash
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"sql": "ALTER TABLE posts ADD COLUMN published INTEGER DEFAULT 0"}'
```

### Workflow for building a feature with custom data
1. Design your table schema
2. `POST /api/db/migrate` with `CREATE TABLE IF NOT EXISTS ...`
3. Verify: `GET /api/db/tables/your_table`
4. Use `POST /api/db/tables/your_table` to seed or insert records
5. Read data in your page via `fetch("/api/db/tables/your_table")`

## Media Service
All images and videos are managed by a standalone HTTP service at `http://localhost:3300` (env: `NEXT_PUBLIC_MEDIA_URL`).
Start: `node services/media/server.js`

**When building a page that needs images or videos — always check the media library first:**

```ts
// Search available media
const res  = await fetch(`${process.env.NEXT_PUBLIC_MEDIA_URL}/media`)
const { items } = await res.json()
// items: [{ id, name, mime_type, extension, width, height, ... }]

// Use a file in JSX
<img src={`${MEDIA_URL}/media/${item.id}/file`} />
<img src={`${MEDIA_URL}/media/${item.id}/thumb`} /> // 200×200 thumbnail

// Video
<video src={`${MEDIA_URL}/media/${item.id}/file`} controls />
```

**API endpoints:**
- `GET  /media` — list all files (id, name, mime_type, extension, size, width, height, duration)
- `POST /media/upload` — upload image or video (multipart: `file`, `name`, optional `crop` JSON)
- `GET  /media/:id/file` — serve original file
- `GET  /media/:id/thumb` — serve 200×200 JPEG thumbnail (images only)
- `DELETE /media/:id` — delete file and DB record

## Favicon & PWA Icons
To generate a full icon set (favicon, Apple Touch Icon, PWA icons, OG image):

1. Upload a **square** source image via Media Library (min 512×512 recommended)
2. Call generate-icons with its `id`:

```ts
const res = await fetch(`${MEDIA_URL}/media/generate-icons`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ media_id: item.id })
})
const { id, files } = await res.json()
```

3. Add to `app/layout.tsx` `<head>`:

```tsx
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? 'http://localhost:3300'
const ICONS_ID  = 'YOUR_ICON_SET_ID' // from generate-icons response

// In <head>:
<link rel="icon" href={`${MEDIA_URL}/media/icons/${ICONS_ID}/file/favicon.ico`} />
<link rel="icon" type="image/png" sizes="32x32" href={`${MEDIA_URL}/media/icons/${ICONS_ID}/file/favicon-32.png`} />
<link rel="apple-touch-icon" href={`${MEDIA_URL}/media/icons/${ICONS_ID}/file/apple-touch-icon.png`} />
```

4. For PWA — copy `manifest.json` from `${MEDIA_URL}/media/icons/${ICONS_ID}/file/manifest.json` to `app/public/manifest.json`

**Generated files per icon set:**
- `favicon.ico` — 16+32px combined
- `favicon-16.png`, `favicon-32.png`
- `apple-touch-icon.png` — 180×180
- `icon-192.png`, `icon-512.png` — PWA manifest icons
- `og-image.jpg` — 1200×630 Open Graph image
- `manifest.json` — ready PWA manifest with icon URLs

**API:**
- `POST /media/generate-icons` — body: `{ media_id }` → generates full set, returns `{ id, files }`
- `GET  /media/icons/current` — latest generated icon set
- `GET  /media/icons` — all icon sets
- `GET  /media/icons/:id/file/:name` — serve specific icon file

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

## UI Libraries

### Tailwind v4
Utility-first CSS. Use class names directly — no config file needed for basic use.
```tsx
<div className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-muted text-foreground" />
```
CSS variables for theming: `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `text-destructive`. Dark mode via `.dark` class on `<html>`.

### shadcn/ui
Pre-built accessible components. Import from `@/components/ui/`:
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
```
To add a new component: `npx shadcn add <component-name>` from `app/` directory.

### sonner (toast notifications)
`<Toaster>` is mounted in `app/layout.tsx` — available everywhere. Use `toast` from `"sonner"`:
```tsx
import { toast } from "sonner"

toast.success("File uploaded")
toast.error("Something went wrong")
toast.info("Processing…")
toast.loading("Uploading…")  // returns id
toast.dismiss(id)
```
No provider needed — just import and call. Position: `bottom-right`, `richColors` and `closeButton` enabled.

### lucide-react
Icon library. Import individual icons by name:
```tsx
import { Settings, Upload, Download, Trash2, Eye, Copy, Check, X, Loader2, Plus, Search, Image, Film, ImagePlus, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"

<Settings size={16} className="text-muted-foreground" />
```
Always use `size` prop (number), not `width`/`height`. Browse all icons at [lucide.dev](https://lucide.dev).

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
