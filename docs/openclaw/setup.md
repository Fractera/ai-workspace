# Open Claw — Setup

Source: https://docs.openclaw.ai/setup

---

## TL;DR

Keep tailoring outside the repo:
- Config: `~/.openclaw/openclaw.json`
- Workspace: `~/.openclaw/workspace/` (skills, prompts, memories)

| Workflow | Description |
|---|---|
| Stable (recommended) | Install macOS app, let it run bundled Gateway |
| Bleeding edge (dev) | Run Gateway via `pnpm gateway:watch`, macOS app attaches in Local mode |

---

## Prerequisites (from source)

- Node 24 recommended (Node 22.14+ supported)
- pnpm preferred (or Bun)
- Docker — optional, only for containerized/e2e

---

## Bootstrap

```bash
openclaw setup
# or from repo:
pnpm openclaw setup
```

---

## Run Gateway from Repo

```bash
node openclaw.mjs gateway --port 18789 --verbose
```

---

## Stable Workflow (macOS App)

1. Install + launch OpenClaw.app
2. Complete onboarding/permissions (TCC prompts)
3. Gateway: Local mode, running
4. Link surfaces: `openclaw channels login`
5. Verify: `openclaw health`

---

## Bleeding Edge Workflow (Gateway in Terminal)

```bash
pnpm install
pnpm openclaw setup   # first run only
pnpm gateway:watch    # hot reload on source/config changes
```

Bun equivalent:
```bash
bun install
bun run openclaw setup
bun run gateway:watch
```

Point macOS app → Connection Mode: **Local**

Verify: `openclaw health`

---

## Common Footguns

- Wrong port: Gateway WS defaults to `ws://127.0.0.1:18789`
- `gateway:watch` does NOT rebuild `dist/control-ui` — run `pnpm ui:build` after UI changes

---

## Credential Storage Map

| What | Path |
|---|---|
| WhatsApp | `~/.openclaw/credentials/whatsapp/<accountId>/creds.json` |
| Telegram token | config/env or `channels.telegram.tokenFile` |
| Discord token | config/env or SecretRef |
| Slack tokens | config/env (`channels.slack.*`) |
| Pairing allowlists | `~/.openclaw/credentials/<channel>-allowFrom.json` |
| Model auth profiles | `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` |
| Sessions | `~/.openclaw/agents/<agentId>/sessions/` |
| Logs | `/tmp/openclaw/` |

---

## Linux (systemd — always-on)

```bash
sudo loginctl enable-linger $USER
```

For multi-user servers: use a system service instead of user service.
