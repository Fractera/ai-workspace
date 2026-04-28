# Hosting — Linux Server (Generic)

Source: https://docs.openclaw.ai/hosting/linux-server
Applies to: OpenClaw. All tuning tips apply to Fractera equally.

---

## Provider Overview

| Provider | Type | Notes |
|---|---|---|
| Railway | PaaS | One-click, browser setup |
| Northflank | PaaS | One-click, browser setup |
| DigitalOcean | VPS | Simple paid VPS |
| Oracle Cloud | VPS | Always Free ARM tier |
| Fly.io | PaaS | Fly Machines |
| Hetzner | VPS | Docker on VPS — **recommended for Fractera** |
| Hostinger | VPS | VPS with one-click setup |
| GCP | Cloud | Compute Engine |
| Azure | Cloud | Linux VM |
| AWS | Cloud | EC2 / Lightsail / free tier |
| Raspberry Pi | Self-hosted | ARM |

---

## How Cloud Setups Work

- Gateway runs on VPS — owns state + workspace
- Connect from laptop/phone via Control UI, Tailscale, or SSH
- VPS is the source of truth — back up state + workspace regularly
- **Secure default:** keep Gateway on loopback, access via SSH tunnel or Tailscale Serve
- If binding to `lan` or `tailnet` — require `gateway.auth.token` or `gateway.auth.password`

---

## Shared Company Agent on VPS

Valid when all users are in the same trust boundary and agent is business-only:

- Dedicated VPS/VM/container + dedicated OS user
- Do NOT sign into personal Apple/Google accounts or personal browser profiles on that host
- If users are adversarial to each other → split by gateway/host/OS user

---

## Startup Tuning (Small VMs and ARM Hosts)

Enable Node module compile cache to speed up CLI startup:

```bash
grep -q 'NODE_COMPILE_CACHE' ~/.bashrc || cat >> ~/.bashrc <<'EOF'
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
mkdir -p /var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1
EOF
source ~/.bashrc
```

- `NODE_COMPILE_CACHE` — improves repeated command startup times
- `OPENCLAW_NO_RESPAWN=1` — avoids extra startup overhead from self-respawn
- First run warms cache; subsequent runs are faster

---

## systemd Tuning (Optional)

Edit user unit:

```bash
systemctl --user edit openclaw-gateway.service
```

```ini
[Service]
Environment=OPENCLAW_NO_RESPAWN=1
Environment=NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
Restart=always
RestartSec=2
TimeoutStartSec=90
```

For system unit: `sudo systemctl edit openclaw-gateway.service`

Recommendations:
- Prefer SSD-backed disks for state/cache paths
- `Restart=always` for automated recovery
- `RestartSec=2` — brief delay before restart

---

## Fractera Notes

- All startup tuning (`NODE_COMPILE_CACHE`, `OPENCLAW_NO_RESPAWN`) applies to Fractera Node.js services too
- Add to PM2 ecosystem config or systemd unit for Fractera services
- **Oracle Cloud Always Free ARM** — 4 ARM vCPUs + 24GB RAM free — more than enough for Fractera + LightRAG + OpenClaw
- For `install.sh` server mode: target Ubuntu 22.04+ on any provider from the list above
