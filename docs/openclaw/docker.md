# Open Claw — Docker

Source: https://docs.openclaw.ai/containers/docker

> Docker is optional. Use it only if you want a containerized gateway or to validate the Docker flow. For fastest dev loop on your own machine — use normal install flow.

---

## Is Docker Right for Me?

- **Yes** — isolated/throwaway gateway environment, or running OpenClaw on a host without local installs
- **No** — running on your own machine and just want the fastest dev loop

Sandboxing note: default sandbox backend uses Docker when sandboxing is enabled, but sandboxing is **off by default** and does not require the full gateway to run in Docker.

---

## Prerequisites

- Docker Desktop (or Docker Engine) + Docker Compose v2
- At least 2 GB RAM for image build (`pnpm install` may OOM-kill on 1 GB hosts)
- Enough disk for images and logs

---

## Containerized Gateway

### Step 1 — Build the Image

```bash
# From repo root
./scripts/docker/setup.sh

# Or use pre-built image
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
./scripts/docker/setup.sh
```

Pre-built images: `ghcr.io/openclaw/openclaw` — tags: `main`, `latest`, `<version>` (e.g. `2026.2.26`)

### Step 2 — Complete Onboarding

Setup script runs onboarding automatically — prompts for provider API keys, generates gateway token, writes to `.env`, starts gateway via Docker Compose.

### Step 3 — Open Control UI

```bash
# Get URL
docker compose run --rm openclaw-cli dashboard --no-open
# Open http://127.0.0.1:18789/
```

### Step 4 — Configure Channels (optional)

```bash
# WhatsApp (QR)
docker compose run --rm openclaw-cli channels login

# Telegram
docker compose run --rm openclaw-cli channels add --channel telegram --token "<token>"

# Discord
docker compose run --rm openclaw-cli channels add --channel discord --token "<token>"
```

---

## Manual Flow

```bash
docker build -t openclaw:local -f Dockerfile .

docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js onboard --mode local --no-install-daemon

docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set --batch-json \
  '[{"path":"gateway.mode","value":"local"},{"path":"gateway.bind","value":"lan"},{"path":"gateway.controlUi.allowedOrigins","value":["http://localhost:18789","http://127.0.0.1:18789"]}]'

docker compose up -d openclaw-gateway
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `OPENCLAW_IMAGE` | Use remote image instead of building locally |
| `OPENCLAW_DOCKER_APT_PACKAGES` | Extra apt packages during build (space-separated) |
| `OPENCLAW_EXTENSIONS` | Pre-install plugin deps at build time |
| `OPENCLAW_EXTRA_MOUNTS` | Extra host bind mounts (comma-separated `source:target[:opts]`) |
| `OPENCLAW_HOME_VOLUME` | Persist `/home/node` in named Docker volume |
| `OPENCLAW_PLUGIN_STAGE_DIR` | Container path for generated bundled plugin deps |
| `OPENCLAW_SANDBOX` | Opt in to sandbox bootstrap (`1`, `true`, `yes`, `on`) |
| `OPENCLAW_DOCKER_SOCKET` | Override Docker socket path |
| `OPENCLAW_DISABLE_BONJOUR` | Disable Bonjour/mDNS advertising (defaults to `1` for Docker) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP/HTTP collector endpoint for OpenTelemetry |
| `OTEL_SERVICE_NAME` | Service name for OpenTelemetry resources |

---

## Health Checks

```bash
# No auth required
curl -fsS http://127.0.0.1:18789/healthz   # liveness
curl -fsS http://127.0.0.1:18789/readyz     # readiness

# Authenticated deep health snapshot
docker compose exec openclaw-gateway node dist/index.js health --token "$OPENCLAW_GATEWAY_TOKEN"
```

---

## LAN vs Loopback

| Bind mode | Who can reach gateway |
|---|---|
| `lan` (default) | Host browser and host CLI via published port |
| `loopback` | Only processes inside container network namespace |

Use `gateway.bind` values: `lan` / `loopback` / `custom` / `tailnet` / `auto` — not `0.0.0.0` or `127.0.0.1`.

---

## Host Local Providers (Ollama, LM Studio)

Inside Docker, `127.0.0.1` = the container itself. Use `host.docker.internal`:

| Provider | Host URL | Docker URL |
|---|---|---|
| LM Studio | `http://127.0.0.1:1234` | `http://host.docker.internal:1234` |
| Ollama | `http://127.0.0.1:11434` | `http://host.docker.internal:11434` |

Host services must also listen on `0.0.0.0`:
```bash
lms server start --port 1234 --bind 0.0.0.0
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

---

## Storage and Persistence

Docker Compose bind-mounts:
- `OPENCLAW_CONFIG_DIR` → `/home/node/.openclaw`
- `OPENCLAW_WORKSPACE_DIR` → `/home/node/.openclaw/workspace`

Named volume `openclaw-plugin-runtime-deps` → `/var/lib/openclaw/plugin-runtime-deps` (generated state — high churn, kept separate from user config).

**Disk growth hotspots:** `media/`, session JSONL files, `cron/runs/*.jsonl`, `openclaw-plugin-runtime-deps` volume, rolling logs under `/tmp/openclaw/`.

---

## Agent Sandbox (Quick Enable)

```json
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "non-main",
        "scope": "agent"
      }
    }
  }
}
```

```bash
scripts/sandbox-setup.sh
```

Sandbox modes: `off` | `non-main` | `all`
Sandbox scopes: `session` | `agent` | `shared`

---

## Shell Helpers

```bash
# Install ClawDock
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/clawdock/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
echo 'source ~/.clawdock/clawdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

See `docs/openclaw/clawdock.md` for all commands.

---

## Fractera Notes

- Fractera does not require Docker — three plain Node.js services via PM2
- Health check pattern (`/healthz`, `/readyz`) is a good reference for Fractera API routes
- `host.docker.internal` pattern useful if Fractera runs in Docker alongside Ollama or LM Studio
- Agent sandbox concept maps to Fractera's parallel terminal isolation per platform
