# Fractera Light — Agent Manual

## Quick Start
1. Read this `CLAUDE.md` — workspace rules
2. Read `../../NEXT_STEP.md` — current tasks
3. Work only in `@appSlot/`

## For the Architect — Database & Storage Capabilities

AI models running inside this workspace are fully trained to work with the database and local media storage. You do not need to write SQL manually or manage files directly — just describe what you need.

**What the model can do with the database:**
- Read any table, search records, filter and paginate results
- Create new tables with any schema you describe
- Insert, update, and delete individual records
- Alter existing tables (add columns, create indexes)
- Execute any SQL statement

**What the model can do with media storage (local S3):**
- Upload images and videos
- Crop images to horizontal (16:9), square (1:1), or vertical (9:16) formats
- List, search, preview, rename, and delete stored files
- Generate a full favicon and PWA icon set from a single source image
- Return a direct URL to any stored file for use in pages and components

**How to use:** Simply tell the model what you want in plain language. Examples:
- *"Create a table for blog posts with title, body, author and published date"*
- *"Add a status column to the products table"*
- *"Find all users registered after January 2026"*
- *"Upload this image and use it as the hero on the homepage"*

The model uses the HTTP API at `http://localhost:3000/api/db/` and `http://localhost:3300/` — it never touches database files or storage folders directly.

**To strengthen security:** Update the system prompt in your AI platform settings to restrict which tables or operations the model is allowed to perform. The API itself has no restrictions by default — access control is managed at the instruction level.

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
1. `POST /api/db/migrate` — create table
2. `GET /api/db/tables/your_table` — verify schema
3. `POST /api/db/tables/your_table` — insert rows
4. `fetch("/api/db/tables/your_table")` — read in page

## File Upload — `app/services/upload/`

- `upload.service.ts` — `uploadFile(file, { croppedBlob?, cropMode? })` → `{ id, url, name, mime_type, size, width, height }`
- `file-upload-field.client.tsx` — `<FileUploadField accept="image|video|document|any" onUpload={(f) => ...} />` — drop-in UI with built-in crop trigger. `url` from `onUpload` is ready to save to DB.
- `image-cropper.client.tsx` — portal-based cropper. **Only for use outside Dialog** (standalone pages, non-overlay contexts).

**Image upload inside a Dialog — Stepper pattern (MANDATORY):**
Never open a cropper overlay on top of an open Dialog — pointer events will be blocked by the bottom overlay regardless of z-index. Use one Dialog with step state instead:
- 1 image: `step = "form" | "crop"` — form fields + upload slot, crop replaces Dialog content inline
- N images: `step = "grid" | "crop"` — grid of N slots, tap slot → crop → back to grid
- Cropper inside Dialog must be `InlineCropper` (no portal, no fixed) — see `@appSlot/employees/inline-cropper.client.tsx`

## Media Service — `http://localhost:3300` (`NEXT_PUBLIC_MEDIA_URL`)

Start: `node services/media/server.js`

- `GET  /media` — list files
- `POST /media/upload` — multipart: `file`, optional `crop` JSON
- `GET  /media/:id/file` — original · `/thumb` — 200×200 JPEG
- `DELETE /media/:id`
- `POST /media/generate-icons` — body `{ media_id }` → favicon + PWA icon set (favicon.ico, apple-touch-icon, icon-192/512, og-image, manifest.json)
- `GET  /media/icons/current` — latest icon set

## Structure
```
app/
  @appSlot/             ← ✅ all work here
  @codeWorkspaceSlot/   ← ⛔ off limits — default.tsx renders WorkspaceController on every route
  services/upload/      ← universal file upload service
  (auth)/               ← login · register · guest-login
  api/                  ← auth · data · update · readme · db
  layout.tsx            ← no children prop — never add app/page.tsx
```

## UI

**Tailwind v4** — CSS vars: `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `text-destructive`. Dark mode via `.dark` on `<html>`.

**shadcn/ui** — import from `@/components/ui/`. Never build overlays manually — always use the matching component. Installed:
`badge` `button` `card` `checkbox` `collapsible` `command` `dialog` `dropdown-menu` `hover-card` `input` `label` `popover` `scroll-area` `select` `separator` `sheet` `spinner` `textarea` `tooltip`

| Need | Component |
|------|-----------|
| Modal / confirm | `Dialog` |
| Dropdown | `DropdownMenu` |
| Popup | `Popover` |
| Hover | `Tooltip` / `HoverCard` |
| Slide-in panel | `Sheet` |

To add: `npx shadcn add <name>` from `app/`.

**sonner** — `<Toaster>` already in layout. Use `toast.success/error/info/loading` from `"sonner"` anywhere.

**lucide-react** — always `size={n}` prop, never `width`/`height`.

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

## What is Fractera? — Q&A

**Q: What is the main use case?**
A: Production coding in the browser — from any device, including a phone. A PM on a treadmill opens a new tab, ships a feature, sends it for review. No laptop required.

**Q: Is there a local dev mode?**
A: No. There is no localhost, no local setup. Everything runs in the cloud — server, storage, AI agents.

**Q: How does it work after signup?**
A: You buy a subscription in the App Store → a server spins up, dependencies install, a subdomain is assigned → you open the URL, pick your AI platform (Claude Code, Codex, etc.), and start coding.

**Q: Why mobile?**
A: Not because you build large apps on a phone — because you *can* do something meaningful on one. The constraint forces simplicity and proves the platform works anywhere.

**Q: What about skills that require different expertise?**
A: That's the next layer — agents that can find and acquire the right capability automatically. Not shipped yet.

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
