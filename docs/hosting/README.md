# Hosting — Reference for Fractera Deployment

## Why This Folder Exists

OpenClaw documents deployment on a wide range of hosting providers.
Fractera is significantly lighter than OpenClaw (no Python runtime, no vector DB, no daemon architecture) — so any host that runs OpenClaw will comfortably run Fractera.

This folder collects hosting documentation to use as reference when:
1. Answering user questions about hosting during installation (Claude Code chat context)
2. Writing the automated server deployment script (Fractera v1.5+ / install.sh server scenario)
3. Recommending hosting options in README and Getting Started guide

---

## Key Insight

OpenClaw requires:
- Node 24+
- Persistent daemon (launchd / systemd / Scheduled Task)
- 1–2 GB RAM minimum for Gateway + channels

Fractera requires:
- Node 20+
- Three Node.js services (app, bridge, media) via PM2 or similar
- 512 MB RAM minimum (1 GB recommended)

**If a host runs OpenClaw → it runs Fractera with headroom to spare.**

---

## Provider Overview

| Provider | Type | Cost | Guide | Fractera fit |
|---|---|---|---|---|
| **Hetzner** | VPS | ~€3–5/mo | [hetzner.md](hetzner.md) | **Recommended** — cheapest reliable Linux VPS, EU/US |
| **Oracle Cloud** | Cloud | **Free** | — | Best free option — 4 ARM vCPUs + 24GB RAM Always Free |
| DigitalOcean | VPS | ~$6/mo | [digitalocean.md](digitalocean.md) | Good, simple, reliable |
| Fly.io | PaaS | ~$5–8/mo | [fly.md](fly.md) | Easy HTTPS, good for small instances |
| GCP | Cloud | ~$5–12/mo | [gcp.md](gcp.md) | e2-micro free tier available |
| Azure | Cloud | ~$55–195/mo | [azure.md](azure.md) | Enterprise; overkill for personal use |
| Hostinger | VPS | ~$4–5/mo | [hostinger.md](hostinger.md) | Good price, hPanel management |
| Railway | PaaS | free tier | — | One-click, browser setup |
| Northflank | PaaS | — | — | One-click, container-based |
| Render | PaaS | free tier | — | Free tier available |
| Kubernetes | Container | varies | [kubernetes.md](kubernetes.md) | AKS/EKS/GKE/k3s — for teams |
| Docker VM | Container | varies | [docker-vm.md](docker-vm.md) | Generic Docker on any Linux VPS |
| Linux (generic) | Any | varies | [linux-server.md](linux-server.md) | General tuning for any provider |

---

## Fractera Hosting Recommendations

### Personal / Solo Developer
**Hetzner CX11** — €3.29/mo, 2 vCPU, 2GB RAM, Ubuntu 22.04
- Enough for Fractera (app + bridge + media = ~300–400MB RAM)
- Add 2GB swap for safety
- PM2 + Nginx + Let's Encrypt

**Oracle Cloud Always Free ARM** — $0/mo, 4 ARM vCPUs, 24GB RAM
- Enough for Fractera + LightRAG (v1.3) + OpenClaw (v1.4) simultaneously
- Best option if cost is the priority

### Team / Production
**Hetzner CX21** — €5.77/mo, 2 vCPU, 4GB RAM
- Comfortable headroom for multiple users
- Same setup, just bigger

**Fly.io** — ~$5–8/mo
- Automatic HTTPS, easy scaling
- No SSH needed for basic ops

---

## install.sh Server Mode Target (v1.5+)

For the automated `install.sh` server deployment, the baseline target:
- **OS:** Ubuntu 22.04+
- **RAM:** 1 GB minimum (2 GB recommended)
- **Node:** 20+ via NodeSource
- **Process manager:** PM2
- **Reverse proxy:** Nginx
- **HTTPS:** Let's Encrypt / Certbot

This matches Fractera README standard deployment and OpenClaw VPS pattern.

---

## Startup Tuning (All Providers)

From OpenClaw Linux server guide — applies to Fractera too:

```bash
# Add to ~/.bashrc or PM2 ecosystem config
export NODE_COMPILE_CACHE=/var/tmp/fractera-compile-cache
mkdir -p /var/tmp/fractera-compile-cache
export OPENCLAW_NO_RESPAWN=1
```

For systemd units:
```ini
[Service]
Environment=NODE_COMPILE_CACHE=/var/tmp/fractera-compile-cache
Restart=always
RestartSec=2
TimeoutStartSec=90
```

---

## Files in This Folder

| File | Provider |
|---|---|
| [README.md](README.md) | This index |
| [azure.md](azure.md) | Microsoft Azure Linux VM |
| [digitalocean.md](digitalocean.md) | DigitalOcean Droplet |
| [docker-vm.md](docker-vm.md) | Generic Docker VM runtime |
| [fly.md](fly.md) | Fly.io |
| [gcp.md](gcp.md) | GCP Compute Engine |
| [hetzner.md](hetzner.md) | Hetzner VPS |
| [hostinger.md](hostinger.md) | Hostinger VPS |
| [kubernetes.md](kubernetes.md) | Kubernetes |
| [linux-server.md](linux-server.md) | Generic Linux server tuning |

---

## TODO

- [ ] Write `fractera-vps.md` — Fractera-specific VPS steps for `install.sh` server mode
- [ ] Add Oracle Cloud Always Free guide
- [ ] Add Railway guide
