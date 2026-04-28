# Hosting — Northflank

Source: https://docs.openclaw.ai/hosting/northflank
Easiest "no terminal on the server" path — Northflank runs the Gateway for you.

---

## Setup (One-Click Template)

1. Click Deploy OpenClaw template on Northflank
2. Create Northflank account if needed
3. Click **Deploy OpenClaw now**
4. Set required env variable: `OPENCLAW_GATEWAY_TOKEN` (strong random value)
5. Click **Deploy stack** — build and run
6. Wait for deployment → click **View resources**
7. Open OpenClaw service
8. Open public URL at `/openclaw` — authenticate with `OPENCLAW_GATEWAY_TOKEN`

---

## What You Get

- Hosted OpenClaw Gateway + Control UI
- Persistent storage via Northflank Volume (`/data`)
- Survives redeploys: `openclaw.json`, auth profiles, channel state, sessions, workspace

---

## Connect a Channel

Via Control UI at `/openclaw` or SSH + `openclaw onboard`:
- Telegram (fastest — just a bot token)
- Discord
- All other channels

---

## Fractera Notes

- Northflank supports custom Docker images — Fractera can be deployed the same way
- Volume at `/data` maps to SQLite DB + media storage for Fractera
- No terminal needed for basic ops — same appeal as the product manager mode
- Cost: Northflank free tier available; paid plans for production
