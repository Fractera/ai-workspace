# @codeWorkspaceSlot — AGENT RESTRICTIONS

## ⛔ DO NOT MODIFY THIS SLOT

Infrastructure only. Terminal interface, platform carousel, bridge connections, data backup.
No application business logic here.

**Prohibited for any AI agent:**
- Modify any file in this folder or subfolders
- Read `_components/coding-workspace/` for app development purposes

## ✅ Work in `app/@appSlot/` instead

## Contents (reference only)

| File | Purpose |
|------|---------|
| `page.tsx` | Renders WorkspaceController |
| `default.tsx` | Parallel route fallback |
| `error.tsx` | Silent error boundary |
| `_components/workspace-controller.client.tsx` | Account + Start Coding buttons |
| `_components/coding-window.client.tsx` | Modal shell (Rnd desktop / bottom sheet mobile) |
| `_components/coding-workspace/coding-window-shell.client.tsx` | Carousel, terminals, Bridge/Data buttons |
| `_components/coding-workspace/opencode-key-dialog.client.tsx` | OpenRouter key setup dialog |
| `_components/coding-workspace/platforms.ts` | Platform list (Claude Code, Codex, Gemini, Qwen, Kimi, Open Code) |

## Data API (managed by this slot)

| Route | Method | Action |
|-------|--------|--------|
| `/api/data/export` | GET | Zip database + storage → download |
| `/api/data/import` | POST | Upload zip → extract to data/ and storage/ |

UI: **Data** button in carousel (after Bridge) → dropdown: Export / Import.
