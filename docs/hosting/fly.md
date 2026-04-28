# Hosting — Fly.io

Source: https://docs.openclaw.ai/hosting/fly
Applies to: OpenClaw (Fractera is lighter — same approach works)

---

## What You Need

- `flyctl` CLI installed
- Fly.io account (free tier works)
- Model API key
- Channel credentials (Discord token, Telegram token, etc.)

---

## Quick Path

1. Clone repo → customize `fly.toml`
2. Create app + volume → set secrets
3. `fly deploy`
4. SSH in to create config or use Control UI

---

## Step 1 — Create Fly App

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

fly apps create my-openclaw

# Create persistent volume (1GB is usually enough)
fly volumes create openclaw_data --size 1 --region iad
```

Regions: `lhr` (London) · `iad` (Virginia) · `sjc` (San Jose)

---

## Step 2 — Configure fly.toml

```toml
app = "my-openclaw"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  OPENCLAW_PREFER_PNPM = "1"
  OPENCLAW_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "openclaw_data"
  destination = "/data"
```

| Setting | Why |
|---|---|
| `--bind lan` | Binds to 0.0.0.0 so Fly proxy can reach gateway |
| `--allow-unconfigured` | Starts without config file (create after) |
| `internal_port = 3000` | Must match `--port 3000` for Fly health checks |
| `memory = "2048mb"` | 512MB too small; 2GB recommended |
| `OPENCLAW_STATE_DIR = "/data"` | Persists state on volume |

---

## Step 3 — Set Secrets

```bash
# Required: Gateway token
fly secrets set OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)

# Model provider
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# Channels
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

Note: Non-loopback binds (`--bind lan`) require a valid gateway auth token.

---

## Step 4 — Deploy

```bash
fly deploy
# First deploy: ~2-3 minutes

fly status
fly logs
# Expected: [gateway] listening on ws://0.0.0.0:3000
```

---

## Step 5 — Create Config File

```bash
fly ssh console

mkdir -p /data
cat > /data/openclaw.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallbacks": ["anthropic/claude-sonnet-4-6", "openai/gpt-5.4"]
      },
      "maxConcurrent": 4
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto",
    "controlUi": {
      "allowedOrigins": [
        "https://my-openclaw.fly.dev",
        "http://localhost:3000"
      ]
    }
  }
}
EOF

exit
fly machine restart <machine-id>
```

---

## Step 6 — Access

```bash
fly open          # Opens browser
fly logs          # Live logs
fly ssh console   # SSH into machine
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "App not listening on expected address" | Add `--bind lan` to process command in `fly.toml` |
| Health checks failing | Ensure `internal_port` matches `--port` value |
| OOM / silent restarts | Increase to `memory = "2048mb"` |
| Gateway lock errors | `fly ssh console --command "rm -f /data/gateway.*.lock"` |
| Config not being read | Verify `/data/openclaw.json` exists with `gateway.mode="local"` |
| State lost after restart | Set `OPENCLAW_STATE_DIR=/data` in `fly.toml` |

### Update machine memory without full redeploy

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

---

## Updates

```bash
git pull
fly deploy
fly status && fly logs
```

---

## Private Deployment (Hardened)

Use when: outbound-only calls, no public webhooks, gateway hidden from internet scanners.

```bash
fly deploy -c fly.private.toml

# Release public IPs
fly ips list -a my-openclaw
fly ips release <public-ipv4> -a my-openclaw
fly ips release <public-ipv6> -a my-openclaw
fly ips allocate-v6 --private -a my-openclaw
```

### Access private deployment

```bash
# Option A: Local proxy
fly proxy 3000:3000 -a my-openclaw
# Open http://localhost:3000

# Option B: WireGuard VPN
fly wireguard create

# Option C: SSH only
fly ssh console -a my-openclaw
```

---

## Cost

| Config | Cost |
|---|---|
| shared-cpu-2x, 2GB RAM | ~$10–15/month |
| Free tier | Includes some allowance |

---

## Notes

- Fly.io uses x86 architecture (not ARM)
- Persistent data lives at `/data` on the volume
- Signal requires Java + signal-cli — custom image, keep 2GB+ RAM

---

## Fractera Notes

- Fractera needs less RAM — `shared-cpu-1x` with 1GB likely enough
- Three services (app/bridge/media) can run in one container via `npm run start` from repo root
- Persistent volumes: mount at `/data` for SQLite DB and `storage/` for media
- `OPENCLAW_STATE_DIR` equivalent for Fractera: `DATABASE_URL` and media service path env vars
- Port mapping: internal 3000 → Fly HTTPS proxy (same pattern)
- Cost estimate for Fractera: ~$5–8/month on Fly.io
