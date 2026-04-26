# Fractera Light — App Root Agent Rules

## ✅ WHERE AI AGENTS WORK

All application development happens exclusively in:

```
app/@appSlot/
```

This is the only place where you are allowed to read files, create components, and make changes. `@appSlot` has an error boundary — if code crashes, only this slot fails, the rest of the app survives.

## ⛔ NEVER CREATE app/page.tsx

**This file must not exist. Ever.**

If you create `app/page.tsx`, it will be rendered outside the error boundary. A crash there takes down the entire application with no recovery UI. The root layout has no `children` prop intentionally — there is no slot for a root page.

If you need to build a page or UI — put it in `app/@appSlot/page.tsx`.

## ⛔ @codeWorkspaceSlot — STRICTLY OFF LIMITS

```
app/@codeWorkspaceSlot/   ← DO NOT READ. DO NOT MODIFY.
```

This slot manages the terminal infrastructure. It has nothing to do with application logic. Breaking it disconnects all coding platforms (Claude Code, Codex, Gemini, Qwen, Kimi, Open Code).

## ⛔ (auth) — Read-only unless explicitly asked

```
app/(auth)/   ← only modify if the task explicitly involves authentication
```

## Correct structure

```
app/
  @appSlot/              ← ✅ YOUR ONLY WORKSPACE
    page.tsx             ← main page goes here
    error.tsx            ← error boundary (slot is safe)
    _components/         ← all components for the app
  @codeWorkspaceSlot/    ← ⛔ OFF LIMITS
  (auth)/                ← ⚠️  read-only
  api/                   ← modify only if task involves API routes
  layout.tsx             ← do not modify without explicit instruction
```

## Stack

- Next.js 16.2 App Router, React 19, SQLite, Tailwind v4, shadcn/ui
- No ISR, no multilingual routing
- Server Components by default — `"use client"` only when required

## Related Resources

- `ARCHITECTURE.md` — external bridge servers, port map, platform CLIs
- `CLAUDE.md` — coding rules, workflow, response style
- `NEXT_STEP.md` — current tasks and history
