# Hosting — Railway

Source: https://docs.openclaw.ai/hosting/railway
Easiest "no terminal on the server" path — Railway runs the Gateway for you.

---

## Quick Checklist

1. Click Deploy on Railway
2. Add a Volume mounted at `/data`
3. Set required Variables (`OPENCLAW_GATEWAY_PORT` and `OPENCLAW_GATEWAY_TOKEN`)
4. Enable HTTP Proxy on port 8080
5. Open `https://<your-railway-domain>/openclaw` — authenticate with `OPENCLAW_GATEWAY_TOKEN`

---

## One-Click Deploy

After deploy: Railway → your service → Settings → Domains → find your public URL.

Control UI: `https://<your-railway-domain>/openclaw`

---

## What You Get

- Hosted OpenClaw Gateway + Control UI
- Persistent storage via Railway Volume (`/data`)
- Survives redeploys: `openclaw.json`, auth profiles, channel state, sessions, workspace

---

## Required Railway Settings

### Public Networking

- Enable HTTP Proxy
- Port: **8080**

### Volume (required)

Mount at: `/data`

### Variables

| Variable | Value | Required |
|---|---|---|
| `OPENCLAW_GATEWAY_PORT` | `8080` | Yes — must match HTTP Proxy port |
| `OPENCLAW_GATEWAY_TOKEN` | strong random value | Yes — treat as admin secret |
| `OPENCLAW_STATE_DIR` | `/data/.openclaw` | Recommended |
| `OPENCLAW_WORKSPACE_DIR` | `/data/workspace` | Recommended |

---

## Connect a Channel

Via Control UI at `/openclaw` or Railway shell + `openclaw onboard`:
- Telegram (fastest — just a bot token)
- Discord
- All other channels

---

## Backups

```bash
openclaw backup create
```

Creates portable backup archive with OpenClaw state + workspace.

---

## Fractera Notes

- Railway supports custom Docker images — Fractera deployable the same way
- Volume at `/data` → SQLite DB + media storage
- `OPENCLAW_GATEWAY_PORT=8080` pattern applies to Fractera: set `PORT=8080` for Railway's proxy
- Free tier available; Hobby plan ~$5/mo for production
- No terminal needed — same appeal as product manager mode
