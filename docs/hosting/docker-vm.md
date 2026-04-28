# Hosting — Docker VM Runtime

Source: https://docs.openclaw.ai/hosting/docker-vm
Applies to: OpenClaw (shared steps for GCP, Hetzner, and similar VPS providers)

---

## Key Rule: Bake Binaries at Build Time

Installing binaries inside a running container = lost on restart. All external binaries required by skills must be installed at **image build time**.

If you add skills later that need additional binaries:
1. Update the Dockerfile
2. Rebuild the image
3. Restart the containers

---

## Example Dockerfile

```dockerfile
FROM node:24-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Example binary 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog

# Example binary 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces

# Example binary 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production
CMD ["node","dist/index.js"]
```

Note: URLs above are for x86_64 (amd64). For ARM VMs (Hetzner ARM, GCP Tau T2A) — use ARM64 variants from each tool's release page.

---

## Build and Launch

```bash
docker compose build
docker compose up -d openclaw-gateway

# Verify binaries
docker compose exec openclaw-gateway which gog
docker compose exec openclaw-gateway which goplaces
docker compose exec openclaw-gateway which wacli

# Verify Gateway
docker compose logs -f openclaw-gateway
# Expected: [gateway] listening on ws://0.0.0.0:18789
```

If build fails with `Killed` or exit code 137 during `pnpm install` → VM is out of memory. Use a larger machine class.

---

## What Persists Where

| Component | Location | Persistence | Notes |
|---|---|---|---|
| Gateway config | `/home/node/.openclaw/` | Host volume mount | `openclaw.json`, `.env` |
| Model auth profiles | `/home/node/.openclaw/agents/` | Host volume mount | OAuth, API keys |
| Skill configs | `/home/node/.openclaw/skills/` | Host volume mount | Skill-level state |
| Agent workspace | `/home/node/.openclaw/workspace/` | Host volume mount | Code and agent artifacts |
| WhatsApp session | `/home/node/.openclaw/` | Host volume mount | Preserves QR login |
| Gmail keyring | `/home/node/.openclaw/` | Host volume + password | Requires `GOG_KEYRING_PASSWORD` |
| Plugin runtime deps | `/var/lib/openclaw/plugin-runtime-deps/` | Docker named volume | Generated bundled plugin deps |
| External binaries | `/usr/local/bin/` | Docker image | Must be baked at build time |
| Node runtime | Container filesystem | Docker image | Rebuilt every image build |
| Docker container | Ephemeral | Restartable | Safe to destroy |

---

## Fractera Notes

- Fractera doesn't need custom binaries baked into Docker — all three services (app/bridge/media) are pure Node.js
- For Fractera Docker: a simple `node:20-bookworm` base is enough
- Persistent volumes needed: `data/` (SQLite DB) and `storage/` (media files)
- PM2 inside Docker or separate containers per service both work
