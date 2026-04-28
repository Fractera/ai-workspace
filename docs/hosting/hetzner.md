# Hosting — Hetzner VPS

Source: https://docs.openclaw.ai/hosting/hetzner
Applies to: OpenClaw (~$5/mo). Fractera is lighter — same setup works for less.

---

## Quick Path

1. Provision Hetzner VPS (Ubuntu or Debian)
2. Install Docker
3. Clone repository
4. Create persistent host directories
5. Configure `.env` and `docker-compose.yml`
6. Bake binaries into image
7. `docker compose up -d`
8. Access via SSH tunnel

---

## Step 1 — Provision VPS

Create Ubuntu or Debian VPS on Hetzner. Connect:

```bash
ssh root@YOUR_VPS_IP
```

Treat as stateful — not disposable infrastructure.

---

## Step 2 — Install Docker

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh

docker --version
docker compose version
```

---

## Step 3 — Clone Repository

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
```

---

## Step 4 — Create Persistent Host Directories

```bash
mkdir -p /root/.openclaw/workspace

# Set ownership to container user (uid 1000)
chown -R 1000:1000 /root/.openclaw
```

---

## Step 5 — Configure .env

```env
OPENCLAW_IMAGE=openclaw:latest
OPENCLAW_GATEWAY_TOKEN=
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_PORT=18789

OPENCLAW_CONFIG_DIR=/root/.openclaw
OPENCLAW_WORKSPACE_DIR=/root/.openclaw/workspace

GOG_KEYRING_PASSWORD=
XDG_CONFIG_HOME=/home/node/.openclaw
```

Generate keyring password:
```bash
openssl rand -hex 32
```

Do NOT commit this file.

---

## Step 6 — docker-compose.yml

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
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${OPENCLAW_CONFIG_DIR}:/home/node/.openclaw
      - ${OPENCLAW_WORKSPACE_DIR}:/home/node/.openclaw/workspace
    ports:
      # Loopback-only — access via SSH tunnel (recommended)
      # Remove 127.0.0.1: to expose publicly
      - "127.0.0.1:${OPENCLAW_GATEWAY_PORT}:18789"
    command:
      ["node", "dist/index.js", "gateway",
       "--bind", "${OPENCLAW_GATEWAY_BIND}",
       "--port", "${OPENCLAW_GATEWAY_PORT}",
       "--allow-unconfigured"]
```

---

## Step 7 — Build and Launch

See `docs/hosting/docker-vm.md` for Dockerfile with baked binaries.

```bash
docker compose build
docker compose up -d openclaw-gateway
docker compose logs -f openclaw-gateway
# Expected: [gateway] listening on ws://0.0.0.0:18789
```

---

## Step 8 — Access from Laptop

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

Open: http://127.0.0.1:18789/

---

## Infrastructure as Code (Terraform)

Community-maintained Terraform setup:
- Modular config with remote state management
- Automated provisioning via cloud-init
- Security hardening (UFW, SSH-only)
- SSH tunnel configuration

Repos:
- Infrastructure: `openclaw-terraform-hetzner`
- Docker config: `openclaw-docker-config`

---

## Fractera Notes

- **CX11 (2GB, €3.29/mo)** — enough for Fractera. No Docker build OOM risk.
- **CAX11 ARM (2GB, €3.29/mo)** — ARM-based, even cheaper, Node.js runs fine
- Persistent volumes: `/root/.fractera/data/` (SQLite) + `/root/.fractera/storage/` (media)
- No custom Dockerfile needed — `node:20-bookworm` + `npm install`
- SSH tunnel: `ssh -N -L 3000:127.0.0.1:3000 root@YOUR_VPS_IP`
- **Hetzner is the recommended default for Fractera `install.sh` server mode** — cheapest reliable Linux VPS with good EU/US coverage
