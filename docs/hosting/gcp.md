# Hosting — GCP Compute Engine

Source: https://docs.openclaw.ai/hosting/gcp
Applies to: OpenClaw (Fractera is lighter — same steps work with less RAM)

Goal: persistent Gateway on GCP Compute Engine using Docker, ~$5–12/mo.

---

## VM Size Reference

| Type | Specs | Cost | Notes |
|---|---|---|---|
| e2-medium | 2 vCPU, 4GB RAM | ~$25/mo | Most reliable for Docker builds |
| e2-small | 2 vCPU, 2GB RAM | ~$12/mo | Minimum recommended |
| e2-micro | 2 vCPU (shared), 1GB RAM | Free tier | Often OOM-kills Docker build |

---

## Step 1 — Install gcloud CLI

```bash
# Install from https://cloud.google.com/sdk/docs/install
gcloud init
gcloud auth login
```

---

## Step 2 — Create GCP Project

```bash
gcloud projects create my-openclaw-project --name="OpenClaw Gateway"
gcloud config set project my-openclaw-project

# Enable billing at https://console.cloud.google.com/billing

gcloud services enable compute.googleapis.com
```

---

## Step 3 — Create VM

```bash
gcloud compute instances create openclaw-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --boot-disk-size=20GB \
  --image-family=debian-12 \
  --image-project=debian-cloud
```

---

## Step 4 — SSH Into VM

```bash
gcloud compute ssh openclaw-gateway --zone=us-central1-a
```

Note: SSH key propagation takes 1–2 minutes after VM creation.

---

## Step 5 — Install Docker

```bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Log out and back in for group change to take effect
exit
gcloud compute ssh openclaw-gateway --zone=us-central1-a

docker --version
docker compose version
```

---

## Step 6 — Clone Repository

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
```

---

## Step 7 — Create Persistent Host Directories

```bash
mkdir -p ~/.openclaw
mkdir -p ~/.openclaw/workspace
```

---

## Step 8 — Configure .env

```env
OPENCLAW_IMAGE=openclaw:latest
OPENCLAW_GATEWAY_TOKEN=
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_PORT=18789

OPENCLAW_CONFIG_DIR=/home/$USER/.openclaw
OPENCLAW_WORKSPACE_DIR=/home/$USER/.openclaw/workspace

GOG_KEYRING_PASSWORD=
XDG_CONFIG_HOME=/home/node/.openclaw
```

Generate keyring password:
```bash
openssl rand -hex 32
```

Do NOT commit this file.

---

## Step 9 — docker-compose.yml

```yaml
services:
  openclaw-gateway:
    image: ${OPENCLAW_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - OPENCLAW_GATEWAY_BIND=${OPENCLAW_GATEWAY_BIND}
      - OPENCLAW_GATEWAY_PORT=${OPENCLAW_GATEWAY_PORT}
      - OPENCLAW_GATEWAY_TOKEN=${OPENCLAW_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
    volumes:
      - ${OPENCLAW_CONFIG_DIR}:/home/node/.openclaw
      - ${OPENCLAW_WORKSPACE_DIR}:/home/node/.openclaw/workspace
    ports:
      # Loopback-only — access via SSH tunnel (recommended)
      # Remove 127.0.0.1: prefix to expose publicly
      - "127.0.0.1:${OPENCLAW_GATEWAY_PORT}:18789"
    command:
      ["node", "dist/index.js", "gateway",
       "--bind", "${OPENCLAW_GATEWAY_BIND}",
       "--port", "${OPENCLAW_GATEWAY_PORT}",
       "--allow-unconfigured"]
```

---

## Step 10 — Build and Launch

See `docs/hosting/docker-vm.md` for Dockerfile with baked binaries.

```bash
docker compose build
docker compose up -d openclaw-gateway
docker compose logs -f openclaw-gateway
# Expected: [gateway] listening on ws://0.0.0.0:18789
```

If build fails with `Killed` / exit code 137 → VM is OOM. Upgrade to e2-small minimum.

Set trusted browser origin after LAN bind:
```bash
docker compose run --rm openclaw-cli config set \
  gateway.controlUi.allowedOrigins '["http://127.0.0.1:18789"]' --strict-json
```

---

## Step 11 — Access from Laptop

```bash
# SSH tunnel
gcloud compute ssh openclaw-gateway --zone=us-central1-a -- -L 18789:127.0.0.1:18789
```

Open: http://127.0.0.1:18789/

If Control UI shows unauthorized/disconnected:
```bash
docker compose run --rm openclaw-cli devices list
docker compose run --rm openclaw-cli devices approve <requestId>
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| SSH connection refused | Wait 1–2 min after VM creation, retry |
| OS Login issues | `gcloud compute os-login describe-profile` — check IAM permissions |
| OOM during Docker build | Upgrade machine type (see below) |

### Upgrade machine type

```bash
gcloud compute instances stop openclaw-gateway --zone=us-central1-a
gcloud compute instances set-machine-type openclaw-gateway \
  --zone=us-central1-a --machine-type=e2-small
gcloud compute instances start openclaw-gateway --zone=us-central1-a
```

---

## Service Accounts (CI/CD)

```bash
gcloud iam service-accounts create openclaw-deploy \
  --display-name="OpenClaw Deployment"

gcloud projects add-iam-policy-binding my-openclaw-project \
  --member="serviceAccount:openclaw-deploy@my-openclaw-project.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1"
```

Use principle of least privilege — avoid Owner role for automation.

---

## Fractera Notes

- **e2-micro (free tier)** is enough for Fractera — no Docker build OOM risk (pure Node.js, no pnpm heavy build)
- Persistent volumes: `~/.fractera/data/` (SQLite) and `~/.fractera/storage/` (media)
- No custom Dockerfile needed — `node:20-bookworm` base + `npm install` is sufficient
- SSH tunnel pattern identical: `gcloud compute ssh ... -- -L 3000:127.0.0.1:3000`
- Cost estimate: **free tier (e2-micro)** for light usage, ~$5/mo for e2-small
