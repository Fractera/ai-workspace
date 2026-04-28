# Open Claw — Bun (Experimental)

Source: https://docs.openclaw.ai/containers/bun

> **Not recommended for gateway runtime** — known issues with WhatsApp and Telegram. Use Node for production.

Bun is an optional local runtime for running TypeScript directly (`bun run ...`, `bun --watch ...`). Default package manager remains pnpm. Bun cannot use `pnpm-lock.yaml` and will ignore it.

---

## Install

```bash
bun install
# Skip lockfile writes entirely:
bun install --no-save
```

`bun.lock` / `bun.lockb` are gitignored — no repo churn.

---

## Build and Test

```bash
bun run build
bun run vitest run
```

---

## Lifecycle Scripts

Bun blocks dependency lifecycle scripts unless explicitly trusted. Commonly blocked (not required):

- `@whiskeysockets/baileys preinstall` — checks Node >= 20 (OpenClaw defaults to Node 24)
- `protobufjs postinstall` — emits warnings about version schemes (no build artifacts)

If needed, trust explicitly:

```bash
bun pm trust @whiskeysockets/baileys protobufjs
```

---

## Caveats

Some scripts hardcode pnpm (`docs:build`, `ui:*`, `protocol:check`) — run those via pnpm.

---

## Fractera Notes

- Fractera uses npm, not pnpm or bun — no Bun-related issues
- This page is reference only — not relevant for Fractera deployment
