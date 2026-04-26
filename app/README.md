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
| Production crashes during development | Built-in error isolation — crashes stay contained, the rest keeps running |
| Expensive infrastructure | Runs on any $2–5/month VPS, no cloud lock-in |
| Mobile development is painful | Full workspace on any device with a browser |

**No cloud provider required.** No managed database. No object storage subscription. Just a server and your AI subscriptions.

---

## What's inside

- **All major AI coding platforms** — Claude Code, Codex, Gemini CLI, Qwen Code, Kimi Code, Open Code (OpenRouter)
- **Interactive terminals** — run multiple sessions in parallel, switch without losing context
- **Built-in auth** — email/password, guest mode, role-based access
- **Data portability** — export/import your database and files in one click
- **Auto-updates** — pull the latest version from upstream without touching the server manually
- **Skills Marketplace** — community-built extensions at [fractera.ai](https://fractera.ai)

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

## Get started

### Option A — Instant deploy (recommended)

Visit [fractera.ai](https://fractera.ai), sign in with GitHub, and use the **Deploy** skill from the marketplace.

The skill will ask for your server credentials, deploy everything automatically, and have your workspace ready at your domain within minutes. No manual steps required.

Need a domain? We'll provide a free `your-name.fractera.ai` subdomain during testing.

### Option B — Manual setup

```bash
# 1. Fork this repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/fractera-light.git
cd fractera-light/app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — generate AUTH_SECRET with: openssl rand -base64 32

# 4. Start the bridge server (required for AI platforms)
cd ../bridges/claude-code
npm install
node server.js &

# 5. Start the app
cd ../app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first registered account becomes the architect (admin).

### Authenticate your AI platforms

```bash
claude auth          # Claude Code
codex login          # Codex
gemini auth          # Gemini CLI
qwen auth            # Qwen Code
kimi login           # Kimi Code
# Open Code → set OPENROUTER_API_KEY in .env.local or use the UI
```

---

## Free skills offer

Get up to **8 free skills** from Fractera — notify us at **admin@fractera.ai** with proof:

| Action | Skills |
|--------|--------|
| Fork this repository | +1 |
| Star this repository | +1 |
| Leave a review on [fractera.ai](https://fractera.ai) | +1 |
| Post on X (Twitter) — send us the link | +1 |
| Write on Medium — send us the link | +2 |
| Write on dev.to or any dev publication — send us the link | +2 |

---

## Changelog

### 1.0.0 — Initial release
- Multi-platform terminal workspace (Claude Code, Codex, Gemini, Qwen, Kimi, Open Code)
- Parallel terminal sessions — switch without losing context
- Built-in auth: email/password, guest mode, architect role
- Data export/import (database + storage in one zip)
- Auto-update from upstream without AI assistance
- Info panel with live README rendering
- LightRAG and Open Claw previews in carousel

---

## Links

- **Marketplace** → [fractera.ai](https://fractera.ai)
- **Fractera Pro** → [github.com/Fractera/fractera](https://github.com/Fractera/fractera)
- **Repository** → [github.com/Fractera/fractera-light](https://github.com/Fractera/fractera-light)
- **Contact** → admin@fractera.ai
