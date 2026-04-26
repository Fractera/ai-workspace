# Fractera Light

**One workspace. Every AI end-coding platform. Your server.**

Fractera Light gives you a single self-hosted interface to Claude Code, Codex, Gemini CLI, Qwen, Kimi, and 300+ models via OpenRouter — all under one roof, on a server that costs $2–5/month.

From the first launch you get authentication, a database, and file storage — all running on your server, completely free. No subscriptions, no managed services, no hidden costs.

---

## Why Fractera Light

| Problem | Fractera Light |
|---------|---------------|
| Switching between AI tools breaks flow | All platforms in one carousel, one window |
| Cloud DBs and storage cost money | SQLite + local filesystem, zero extras |
| Production crashes during development | Built-in error isolation — crashes stay contained |
| Expensive infrastructure | Runs on any $2–5/month VPS, no cloud lock-in |
| Mobile development is painful | Full workspace on any device with a browser |

**No cloud provider required.** No managed database. No object storage subscription. Just a server and your AI subscriptions.

---

## What's inside

- **All major AI coding platforms** — Claude Code, Codex, Gemini CLI, Qwen Code, Kimi Code, Open Code (OpenRouter)
- **Parallel terminal sessions** — run multiple agents simultaneously, switch without losing context
- **Built-in auth** — email/password, guest mode, role-based access (architect/user/guest)
- **Data portability** — export/import your database and files in one click
- **Auto-updates** — pull the latest version directly from the workspace footer
- **Skills Marketplace** — community-built extensions at [fractera.ai](https://fractera.ai)

---

## Repository structure

```
fractera-light/
  app/               ← Next.js application (port 3000)
  bridges/
    claude-code/     ← Bridge server — connects app to all AI CLIs
  README.md
  ARCHITECTURE.md
  CLAUDE.md
  .env.example       ← Environment variable template
```

---

## Get started

### Option A — Instant deploy (recommended)

Visit [fractera.ai](https://fractera.ai), sign in with GitHub, and use the **Deploy** skill from the marketplace. The skill connects to your server, deploys everything automatically, and has your workspace ready at your domain within minutes.

Need a domain? We provide a free `your-name.fractera.ai` subdomain during testing.

### Option B — Fork and run manually

#### 1. Fork this repository

Click **Fork** on GitHub — this creates your own copy under your account. You keep full control, can push changes, and contribute back via Pull Requests.

```bash
git clone https://github.com/YOUR_USERNAME/fractera-light.git
cd fractera-light
```

#### 2. Install dependencies

```bash
cd app && npm install && cd ..
cd bridges/claude-code && npm install && cd ../..
```

#### 3. Configure environment

```bash
cp .env.example app/.env.local
```

Open `app/.env.local` and set at minimum:

```bash
# Required — generate with: openssl rand -base64 32
AUTH_SECRET=your-secret-here
```

All other values have working defaults for local development.

#### 4. Run in development mode

Open **two terminals**:

**Terminal 1 — Bridge server:**
```bash
cd bridges/claude-code
node server.js
```

Expected output:
```
Claude Code Bridge listening on ws://localhost:3200
PTY Bridge listening on ws://localhost:3201
Codex Bridge listening on ws://localhost:3202
Gemini Bridge listening on ws://localhost:3203
Qwen Bridge  listening on ws://localhost:3204
Kimi Bridge  listening on ws://localhost:3205
OpenCode Bridge listening on ws://localhost:3206
```

**Terminal 2 — Next.js app:**
```bash
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
The **first registered account** becomes the architect (admin).

#### 5. Authenticate your AI platforms

Run once in your terminal:

```bash
claude auth          # Claude Code
codex login          # Codex
gemini auth          # Gemini CLI
qwen auth            # Qwen Code
kimi login           # Kimi Code
# Open Code → enter API key in the workspace UI (Open Code card in carousel)
```

---

## Run in production

```bash
# Install Node.js 20+ and pm2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pm2

# Clone your fork
git clone https://github.com/YOUR_USERNAME/fractera-light.git
cd fractera-light

# Install
cd app && npm install && cd ..
cd bridges/claude-code && npm install && cd ../..

# Configure
cp .env.example app/.env.local
nano app/.env.local

# Start bridge (persists across reboots)
pm2 start bridges/claude-code/server.js --name fractera-bridge

# Build and start app
cd app && npm run build
pm2 start "npm run start" --name fractera-app
pm2 save && pm2 startup
```

#### Update to latest version

Click the **update badge** in the coding workspace footer — runs `git pull → npm install → restart` automatically.

---

## Roadmap

| Version | Feature | Status |
|---------|---------|--------|
| **1.0** | Multi-platform terminals, auth, data export | ✅ Current |
| **1.1** | LightRAG — shared memory across all agents | 🔜 Coming |
| **1.2** | Open Claw — multi-agent orchestration | 🔜 Coming |

All updates are free for self-hosted users.

> For complex apps requiring multilingual routing or parallel slot architecture → [Fractera Pro](https://github.com/Fractera/fractera)

---

## Free skills offer

Get up to **8 free skills** — send proof to **admin@fractera.ai**:

| Action | Skills |
|--------|--------|
| Fork this repository | +1 |
| Star this repository | +1 |
| Leave a review on [fractera.ai](https://fractera.ai) | +1 |
| Post on X (Twitter) — send us the link | +1 |
| Write on Medium — send us the link | +2 |
| Write on dev.to or any dev publication | +2 |

---

## Changelog

### 1.0.0
- Multi-platform terminal workspace (Claude Code, Codex, Gemini, Qwen, Kimi, Open Code)
- Parallel terminal sessions
- Built-in auth: email/password, guest mode, architect role
- Data export/import (database + storage in one zip)
- Auto-update from workspace footer
- Info panel with live README rendering
- LightRAG and Open Claw previews in carousel

---

## Links

- **Marketplace** → [fractera.ai](https://fractera.ai)
- **Fractera Pro** → [github.com/Fractera/fractera](https://github.com/Fractera/fractera)
- **Repository** → [github.com/Fractera/fractera-light](https://github.com/Fractera/fractera-light)
- **Contact** → admin@fractera.ai
