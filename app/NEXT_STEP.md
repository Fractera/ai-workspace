# NEXT_STEP — Development History

> Agent rule: Record every user request here BEFORE executing. Mark steps complete after delivery.
> Keep only last 2 completed sessions as summary (≤30 words each). Current session stays full.

---

## ✅ Session: Architecture Refactor (2026-04-26)

**Completed:**
- [...] ...
- [...] ...
- [...] ...
- [...] ...

---

## 📋 Current Session (2026-04-26)

### Task 1: Fix auth — login page stays visible after sign in
- [x] Diagnosed: proxy.ts was empty, no session check on auth routes
- [x] Fixed: proxy.ts now redirects authenticated users away from /login and /register

### Task 2: Safe merge import (instead of overwrite)
- [x] Auto-backup current DB before import → data/backups/pre-import-<timestamp>.db
- [x] Merge users/sessions/accounts/verification_tokens via INSERT OR IGNORE
- [x] Storage files — copy only missing files, skip existing
- [x] Return import summary: { merged: { users, sessions, accounts, tokens, files } }

### Task 4: Media service (services/media/)
- [ ] services/media/server.js — HTTP server (port 3300): upload, delete, list, serve
- [ ] SQLite media.db: id, name, description, mime_type, extension, size, width, height, duration, storage_key, created_at
- [ ] Cropper panel in @codeWorkspaceSlot — image crop (horizontal/square/vertical), video direct upload
- [ ] Media library panel — list with name, extension, copy/delete/preview icons
- [ ] Delete confirmation flow
- [ ] Preview dropdown — image or video inline

### Task 3: Env editor UI + default AUTH_SECRET + docs update
- [x] Default AUTH_SECRET="fractera-change-me" in .env.example so app starts without manual setup
- [x] API route GET/POST /api/config/env — read/write .env.local
- [x] UI panel env-editor-panel.client.tsx — key/value editor, opened via Data → Configure
- [x] Warn if AUTH_SECRET < 10 chars (red highlight + warning banner)
- [x] Warning about server restart and session invalidation on AUTH_SECRET change
- [x] Update README: Data → Configure mention, generate-secret.vercel.app link, AUTH_SECRET warning

---

## 📖 History

*(Previous sessions appear here — max 2 summaries of ≤30 words)*
