# Open Claw — Installation & Getting Started

Source: https://docs.openclaw.ai/install · /quickstart · /getting-started

---

## System Requirements

- Node.js 24 (or 22.14+)
- macOS · Linux · Windows · WSL2

---

## Installation

### macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Windows PowerShell

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### npm / pnpm / bun

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### Skip onboarding

```bash
curl -fsSL https://openclaw.ai/install.sh | bash --no-onboard
```

### From source

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw && pnpm install && pnpm build && pnpm ui:build
pnpm link --global
```

Also available: Docker · Podman · Nix · Ansible · Bun

---

## Setup (5 minutes)

### Step 1 — Install (above)

### Step 2 — Run onboarding wizard (~2 min)

```bash
openclaw onboard --install-daemon
```

Configures: model provider (Anthropic / OpenAI / Google), API key, Gateway daemon.

Daemon type per OS:
- macOS → LaunchAgent
- Linux / WSL2 → systemd user service
- Windows → Scheduled Task

### Step 3 — Verify Gateway

```bash
openclaw gateway status
```

Should show: listening on port **18789**

### Step 4 — Open Dashboard

```bash
openclaw dashboard
```

Opens Control UI in browser.

### Step 5 — Send first message

Type in the chat interface to confirm AI response.

---

## Verify Installation

```bash
openclaw --version     # CLI available
openclaw doctor        # Configuration issues
openclaw gateway status  # Daemon status
```

---

## Architecture

| Component | Description |
|---|---|
| Gateway daemon | Manages all API requests, runs on port 18789 |
| Dashboard / Control UI | Browser-based management interface |
| Channel connectors | Discord · Slack · Telegram · Teams · Signal |
| Tool / plugin system | Extensible integrations |

---

## Fractera Integration Notes

- **Port:** 18789 — no conflict with Fractera (3000), bridge (3200–3206), media (3300), LightRAG (9621)
- **Node requirement:** Node 24 or 22.14+ — Fractera requires Node 20+. Users need Node 24 for Open Claw. Worth noting in install script.
- **Model providers:** Anthropic, OpenAI, Google — same credentials users already have for Fractera platforms
- **Planned for:** Fractera v1.4

---

## Status

- [x] install.md — done
- [ ] REST API reference — not found at /api (404)
- [ ] Fractera integration implementation — pending v1.4
