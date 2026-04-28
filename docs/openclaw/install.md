# Open Claw — Installation

Source: https://docs.openclaw.ai/install

---

## System Requirements

- Node 24 (recommended) or Node 22.14+ — installer handles this automatically
- macOS · Linux · Windows (native + WSL2, WSL2 more stable)
- pnpm only needed if building from source

---

## Recommended: Installer Script

Detects OS, installs Node if needed, installs OpenClaw, launches onboarding.

### macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Windows (PowerShell)

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### Without onboarding

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

---

## Alternative Install Methods

### Local prefix installer (no system-wide Node)

Keeps OpenClaw and Node under `~/.openclaw`:

```bash
curl -fsSL https://openclaw.ai/install-cli.sh | bash
```

Switch channels: `openclaw update --channel dev` / `openclaw update --channel stable`

### npm / pnpm / bun

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### From source

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build
pnpm link --global
openclaw onboard --install-daemon
```

### From GitHub main branch

```bash
npm install -g github:openclaw/openclaw#main
```

### Containers & package managers

Docker · Podman · Nix · Ansible · Bun — see official docs for each.

---

## Verify Installation

```bash
openclaw --version       # CLI available
openclaw doctor          # config issues
openclaw gateway status  # Gateway running
```

---

## Managed Startup (after install)

```bash
openclaw onboard --install-daemon
# or
openclaw gateway install
```

- macOS → LaunchAgent
- Linux / WSL2 → systemd user service
- Windows → Scheduled Task (Startup-folder fallback if task creation denied)

---

## Cloud / VPS Deployment

Supported: VPS · Docker · Kubernetes · Fly.io · Hetzner · GCP · Azure · Railway · Render · Northflank

---

## Troubleshooting: `openclaw not found`

```bash
node -v           # Node installed?
npm prefix -g     # Where are global packages?
echo "$PATH"      # Is global bin dir in PATH?
```

If `$(npm prefix -g)/bin` not in PATH, add to `~/.zshrc` or `~/.bashrc`:

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Then open a new terminal.

---

## Fractera Integration Notes

- Gateway port: **18789** — no conflict with Fractera stack
- Node requirement: Node 24 — Fractera requires 20+, install.sh should warn users
- Planned for: Fractera **v1.4**
