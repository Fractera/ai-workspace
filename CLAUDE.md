# Claude Code — Agent Config

⚠️ **STOP. Read `AGENT.md` first.**
All architecture rules, forbidden zones, workflow, component limits,
skills-first policy and response style are defined there — not here.

---

## Claude Code specific

**CLI auth:** `claude auth`
**Bridge port:** `:3200`
**Session resume:** `--resume <sessionId>` flag supported
**Light mode:** `--setting-sources user` (fewer tokens, no project files)

## What AGENT.md covers (read it)
- Where to work (`app/app/@appSlot/`)
- Absolute prohibitions (page.tsx, @codeWorkspaceSlot, 200-line limit)
- Workflow (NEXT_STEP.md first, 2 proofs on completion)
- Skills-first policy
- Response style (Jarvis, jokes, update badge)
- Data architecture (SQLite, no cloud)
- Env config table
