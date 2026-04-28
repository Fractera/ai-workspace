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

## Hosting Providers Documented by OpenClaw

Source: docs.openclaw.ai (deployment guides)

| Provider | Type | Notes |
|---|---|---|
| VPS (any Linux) | Standard | Hetzner, DigitalOcean, Vultr, Linode |
| Hetzner | VPS | Recommended by OpenClaw, cheap, EU |
| Docker VM | Container | Shared Docker steps |
| Kubernetes | Container | K8s |
| Fly.io | PaaS | Good for always-on small instances |
| GCP | Cloud | Google Cloud |
| Azure | Cloud | Microsoft Azure |
| Railway | PaaS | Easy deploy, free tier |
| Render | PaaS | Free tier available |
| Northflank | PaaS | Container-based |

---

## Fractera Hosting Recommendation (current thinking)

For the `install.sh` server scenario, the target is a **standard Linux VPS**:
- Ubuntu 22.04+
- 1–2 GB RAM
- Node 20+ via NodeSource
- PM2 for process management
- Nginx as reverse proxy
- Let's Encrypt for HTTPS

This matches what Fractera README already documents and what OpenClaw uses for VPS deployment.

---

## TODO

- [ ] Pull OpenClaw VPS deployment guide into `docs/hosting/vps.md`
- [ ] Pull OpenClaw Docker guide into `docs/hosting/docker.md`
- [ ] Pull OpenClaw Fly.io guide into `docs/hosting/fly.md`
- [ ] Write `docs/hosting/fractera-vps.md` — Fractera-specific VPS steps for `install.sh` server mode
