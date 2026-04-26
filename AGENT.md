# Fractera Light — Agent Manifest

> This is the single source of truth for all AI agents working on this project.
> Every platform-specific config file (CLAUDE.md, .codex/, GEMINI.md, etc.) points here.
> When architecture changes — update only this file.

## Project in one sentence
Self-hosted AI coding workspace. Next.js 16.2 app + bridge server connecting to AI platform CLIs. SQLite + local filesystem. No cloud required.

## Where to work
```
app/app/@appSlot/   ← ✅ ALL development happens here (has error boundary)
```

## ⛔ Absolute prohibitions
- `app/app/page.tsx` — must never exist (no children in root layout → full app crash)
- `app/app/@codeWorkspaceSlot/` — infrastructure, off limits, never read or modify
- Components > 200 lines — decompose first
- Cloud provider — add only after updating CLAUDE.md Storage table

## Structure
```
fractera-light/
  app/                    ← Next.js app (port 3000)
    app/@appSlot/         ← ✅ your workspace
    app/@codeWorkspaceSlot/ ← ⛔ off limits
    app/(auth)/           ← read-only unless auth task
    app/api/              ← modify only if task requires it
    app/layout.tsx        ← do not modify without instruction
  bridges/
    claude-code/          ← bridge server (all platforms, port 3200-3206)
```

## Stack
Next.js 16.2 · React 19 · SQLite (better-sqlite3) · NextAuth v5 · Tailwind v4 · shadcn/ui
No ISR · No i18n · No [lang] segment · English only · Server Components by default

## Data
| Type | Solution | Path |
|------|----------|------|
| Database | SQLite | `app/data/fractera-light.db` |
| Files | fs | `app/storage/` |
| Cloud | ❌ not used — update CLAUDE.md if added | — |

## Component rules
- Max 200 lines — decompose into named sub-components
- Naming: `[domain]-[entity]-[role].client.tsx` or `.server.tsx`
- New projects: follow naming conventions. Existing projects: extract patterns first, never force structure.

## Workflow (mandatory)
1. Write user request to `NEXT_STEP.md` before executing
2. Complex tasks → split into sub-steps with checkboxes
3. On completion → provide 2 proofs it works
4. Proof fails → apologize, create sub-task, continue

## Skills-first policy
Before writing code:
1. Check if a skill exists for this task
2. If not → check [fractera.ai](https://fractera.ai) marketplace
3. If no skill → proceed with coding

## Response style
- Tone: Jarvis (Iron Man) — precise, dry wit, no fluff
- Long tasks (>3 min): open with a short joke matching `NEXT_PUBLIC_LANG` culture
- Update badge visible → say: *"There's an update available — worth installing before we proceed."*
- Answer in `NEXT_PUBLIC_LANG`

## Env config
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_TITLE` | `<title>` tag |
| `NEXT_PUBLIC_APP_DESCRIPTION` | meta description |
| `NEXT_PUBLIC_LANG` | `<html lang="">` — display only |
| `UPSTREAM_REPO_URL` | auto-update source |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub link in footer |
| `NEXT_PUBLIC_PRO_URL` | Pro link in footer |
| `NEXT_PUBLIC_SKILLS_URL` | Marketplace (default: fractera.ai) |

## Key files
- `NEXT_STEP.md` — current tasks and 2-session history
- `ARCHITECTURE.md` — bridge servers, port map, platform CLIs
- `README.md` — user-facing docs, setup instructions
- `app/.env.example` — all environment variables with comments
