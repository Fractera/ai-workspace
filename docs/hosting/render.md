# Hosting — Render

Source: https://docs.openclaw.ai/hosting/render
Infrastructure as Code via render.yaml Blueprint — deploy with one click.

---

## Prerequisites

- Render account (free tier available)
- API key from model provider

---

## Deploy with Blueprint

Click "Deploy to Render" → creates service from `render.yaml` → builds Docker image → deploys.

Service URL: `https://<service-name>.onrender.com`

---

## render.yaml Blueprint

```yaml
services:
  - type: web
    name: openclaw
    runtime: docker
    plan: starter
    healthCheckPath: /health
    envVars:
      - key: OPENCLAW_GATEWAY_PORT
        value: "8080"
      - key: OPENCLAW_STATE_DIR
        value: /data/.openclaw
      - key: OPENCLAW_WORKSPACE_DIR
        value: /data/workspace
      - key: OPENCLAW_GATEWAY_TOKEN
        generateValue: true  # auto-generates secure token
    disk:
      name: openclaw-data
      mountPath: /data
      sizeGB: 1
```

| Feature | Purpose |
|---|---|
| `runtime: docker` | Builds from repo Dockerfile |
| `healthCheckPath` | Render monitors `/health`, restarts unhealthy instances |
| `generateValue: true` | Auto-generates cryptographically secure value |
| `disk` | Persistent storage — survives redeploys |

---

## Plans

| Plan | Spin-down | Disk | Best for |
|---|---|---|---|
| Free | After 15 min idle | Not available | Testing, demos |
| Starter | Never | 1 GB+ | Personal use, small teams |
| Standard+ | Never | 1 GB+ | Production, multiple channels |

Free tier: no persistent disk → state resets on each deploy.

---

## After Deployment

### Access Control UI

`https://<your-service>.onrender.com/`

Auth: find `OPENCLAW_GATEWAY_TOKEN` in Dashboard → your service → Environment.

### Render Dashboard Features

- **Logs** — Dashboard → Logs (build / deploy / runtime)
- **Shell** — Dashboard → Shell (persistent disk at `/data`)
- **Environment** — Dashboard → Environment (changes trigger redeploy)
- **Custom domain** — Dashboard → Settings → Custom Domains (TLS auto-provisioned)

### Updates

Manual Blueprint sync from dashboard (no auto-deploy from upstream).

---

## Scaling

- Vertical: change plan for more CPU/RAM
- Horizontal: increase instance count (Standard+) — requires sticky sessions or external state

---

## Backups

```bash
# Via Render shell
openclaw backup create
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Service won't start | Check deploy logs; verify `OPENCLAW_GATEWAY_TOKEN` set; check `OPENCLAW_GATEWAY_PORT=8080` |
| Slow cold starts | Free tier spins down after 15 min idle — upgrade to Starter for always-on |
| Data loss after redeploy | Free tier has no disk — upgrade to paid plan or backup regularly |
| Health check failures | Check build logs; test locally with `docker build && docker run`; Render expects `/health` → 200 within 30s |

---

## Fractera Notes

- Same `render.yaml` pattern works for Fractera — replace image with Fractera Dockerfile
- `OPENCLAW_GATEWAY_PORT=8080` → set `PORT=8080` for Fractera Next.js
- Disk at `/data` → SQLite DB + media storage
- Starter plan (~$7/mo) recommended — free tier loses all data on restart
- `healthCheckPath: /health` → Fractera can expose `/api/health` route
