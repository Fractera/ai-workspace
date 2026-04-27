
# ⚡ Fractera AI Workspace: Self-Hosted Multi-Agent End-Coding Platform

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"/>
  <img src="https://img.shields.io/badge/Deploy-Self--Hosted-success.svg" alt="Self-Hosted"/>
  <img src="https://img.shields.io/badge/Models-Claude_|_Gemini_|_Codex_|_Qwen_|_Kimi_|_OpenRouter-orange.svg" alt="AI Models"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"/>
</p>

<p align="center">
  <strong>Anthropic:</strong> Claude Code &nbsp;·&nbsp;
  <strong>OpenAI:</strong> Codex &nbsp;·&nbsp;
  <strong>Google:</strong> Gemini CLI &nbsp;·&nbsp;
  <strong>Alibaba:</strong> Qwen Code &nbsp;·&nbsp;
  <strong>Moonshot:</strong> Kimi Code &nbsp;·&nbsp;
  <strong>OpenRouter:</strong> 300+ models
</p>

> **One workspace. Every AI coding platform. Zero cloud dependency.** Fractera AI Workspace is an open-source, self-hosted interface that brings Claude Code, Codex, Gemini CLI, Qwen, Kimi, and 300+ OpenRouter models into a single, powerful unified terminal.

Each AI platform runs on its own paid subscription — no extra API keys needed. Claude Code uses your Anthropic subscription, Gemini CLI uses your Google account, Codex uses your OpenAI subscription, and so on. The only exception is Open Code, which connects to OpenRouter and lets you access 300+ free and paid models with a single key.

Keep your code private on your own server and build applications in minutes without paying for managed cloud services.

<p align="center">
  <img src="docs/fractera-coding.png" alt="Fractera AI Workspace Demo" width="800"/>
</p>

---

⭐ **Support Open Source:** If Fractera saves you time and money, please **Star this repository** to help other developers discover privacy-first AI tools! ⭐

---

## 📑 Table of Contents
- [Why Fractera?](#-why-fractera-the-privacy-first-advantage)
- [Core Features](#-core-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quickstart](#-quickstart)
- [Deploy to a VPS](#-deploy-to-a-vps)
- [Lightweight Deploy](#-lightweight-deploy--2month-server--home-computer)
- [Free Skills](#-free-skills-marketplace)
- [Roadmap](#️-roadmap)
- [FAQ](#-faq)
- [Changelog](#-changelog)

---

<p align="center">
  <strong>👆 Click the image to star the repository</strong><br/><br/>
  <a href="https://github.com/Fractera/ai-workspace/stargazers" target="_blank" rel="noopener noreferrer">
    <img src="docs/fractera-star.jpeg" alt="Star Fractera on GitHub" width="600"/>
  </a>
</p>

---

## 🥊 Why Fractera? (The Privacy-First Advantage)

Switching between different AI CLIs and web interfaces breaks your flow. Existing cloud solutions lock you in and charge monthly fees. Fractera puts everything in one parallel carousel on your own hardware.

| Feature | Cloud AI Workspaces | ⚡ **Fractera AI Workspace** |
| :--- | :--- | :--- |
| **Privacy & Security** | Code sent to 3rd-party servers | **100% Local / Self-Hosted** |
| **Infrastructure Cost**| $20-$50/month subscriptions | **Free ($2-5/mo VPS is enough)** |
| **Model Lock-in** | Stuck with one ecosystem | **Agnostic (Claude, Gemini, Codex, etc.)** |
| **Database/Storage** | Managed & Metered | **Built-in SQLite + Local FS (Free)** |

---

## 🚀 Core Features

* 🔀 **Parallel Interactive Terminals:** Run multiple AI sessions simultaneously. Switch between Claude and Gemini without losing context.
* 🔐 **Built-in Authentication:** Ready-to-use email/password auth, guest mode, and role-based access control. First user becomes the Architect (Admin).
* 💽 **Absolute Data Portability:** Export and import your entire database and file storage in a single click.
* 🖼️ **Media Library:** Upload, crop, preview, and manage images and videos. Generate full favicon and PWA icon sets from a single image.
* 🗄️ **Database Browser:** View and edit your SQLite data directly from the workspace UI — no external tools needed.
* 🔄 **Seamless Auto-Updates:** Pull the latest open-source version from upstream without touching the server via SSH.
* 🧩 **Skills Marketplace:** Extend your workspace with community-built AI extensions at [fractera.ai](https://fractera.ai).

---

## 🛠️ Tech Stack

Built for speed, simplicity, and zero maintenance:

* **Frontend:** Next.js 16.2, React 19, Tailwind v4, shadcn/ui
* **Backend:** Next.js API routes, Node.js bridge server (WebSocket), Express media service
* **Database:** SQLite via better-sqlite3 — no external database required
* **Authentication:** NextAuth v5 — email/password, guest mode, role-based access (architect / user / guest)
* **Object Storage:** Local filesystem (`storage/`) — no S3, no cloud storage subscriptions
* **Media Service:** Standalone HTTP service on port 3300 — upload, crop, favicon generation, PWA icons
* **Architecture:** Parallel Slot Architecture with built-in error isolation

---

## ✅ Prerequisites

Before you start, install the following on your machine.

### System requirements

- **OS:** macOS 15+, Windows 11 24H2+, or Ubuntu 20.04+
- **RAM:** 4 GB minimum · 16 GB recommended for large codebases and long sessions
- **Shell:** Bash, Zsh, or PowerShell

### Node.js 20+

Required to run the app, bridge server, and media service.

Download from [nodejs.org](https://nodejs.org) or use your package manager. Verify:

```bash
node --version  # must be v20.0.0 or higher
```

### AI platform CLIs

Install the platforms you want to use. Each one uses your existing paid subscription — no API key needed except for OpenRouter.

**Claude Code** (Anthropic)
```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex
```

**Codex** (OpenAI)
```bash
npm i -g @openai/codex
# or
brew install codex
```

**Gemini CLI** (Google)
```bash
npm install -g @google/gemini-cli
# or
brew install gemini-cli
```

**Qwen Code** (Alibaba)
```bash
# macOS / Linux
bash -c "$(curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.sh)" -s --source qwenchat

# Windows
curl -fsSL -o %TEMP%\install-qwen.bat https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.bat && %TEMP%\install-qwen.bat --source qwenchat
```

**Kimi Code** (Moonshot)
```bash
# macOS / Linux
curl -LsSf https://code.kimi.com/install.sh | bash

# Windows (PowerShell)
Invoke-RestMethod https://code.kimi.com/install.ps1 | Invoke-Expression
```

**Open Code** (OpenRouter — 300+ models)
```bash
curl -fsSL https://opencode.ai/install | bash
```
> Open Code requires an API key from [openrouter.ai](https://openrouter.ai). Many models are free. Set the key via **Settings → Configure** inside the app.

---

## 📦 Quickstart

### Step 1: Fork this repository

<p align="center">
  <strong>👆 Click the image to fork the repository</strong><br/><br/>
  <a href="https://github.com/Fractera/ai-workspace/fork">
    <img src="docs/fractera-fork.jpeg" alt="Fork Fractera on GitHub" width="600"/>
  </a>
</p>

**Find the `Fork` button in the top-right corner of this page and click it.** This creates your own copy of the project on your GitHub account — and helps us grow the community. Thank you! 🙏

Once forked, clone your copy:
```bash
# Replace YOUR_USERNAME with your GitHub username
git clone https://github.com/YOUR_USERNAME/ai-workspace.git
cd ai-workspace
```

### Step 2: Install Dependencies

The project has three services — install dependencies for all of them:

```bash
# App (Next.js)
cd app && npm install

# Bridge server (WebSocket connections to AI platforms)
cd ../bridges/platforms && npm install

# Media service (image/video storage, favicon generation)
cd ../services/media && npm install

cd ..
```

### Step 3: Configure Environment

```bash
cd app
cp .env.example .env.local
```

The default `.env.local` includes a working `AUTH_SECRET` so the app starts immediately — **no manual editing required**.

All further configuration (title, theme, language, OpenRouter key) is done **inside the running app** through the Settings panel. Register your first account, click **Start Coding**, then open **Settings → Configure**.

### Step 4: Start the Application

One command from the repo root starts all three services simultaneously:

```bash
# From ai-workspace/ (repo root):
npm run dev
```

This starts:
- `http://localhost:3000` — the main workspace
- `ws://localhost:3200–3206` — bridge server for all AI platforms
- `http://localhost:3300` — media service

Open [http://localhost:3000](http://localhost:3000). The first registered account automatically becomes the **Architect** (admin) and gets access to the full coding workspace.

### Step 5: Connect Your AI Platforms

Each platform works through your **existing paid subscription** — no separate API key is needed. Run the authentication command once in your terminal and your credentials are stored securely on your machine:

```bash
claude auth       # Claude Code — uses your Anthropic subscription
gemini auth       # Gemini CLI — uses your Google account
codex login       # Codex — uses your OpenAI subscription
qwen auth         # Qwen Code — uses your Alibaba Cloud account
kimi login        # Kimi Code — uses your Moonshot account
```

**Open Code (OpenRouter)** is the exception — it requires an API key because it routes requests to 300+ different models. Get a free key at [openrouter.ai](https://openrouter.ai) and set it via **Settings → Configure** in the UI. Many models on OpenRouter are completely free.

---

## 🌍 Deploy to a VPS

This guide walks you through deploying Fractera on a $2–5/month Ubuntu 22+ server from scratch. Follow every step in order.

### Prerequisites
- A VPS running Ubuntu 22.04+ (any provider: Hetzner, DigitalOcean, Vultr, etc.)
- A domain name pointed to your server's IP (or use the IP directly for testing)
- SSH access to your server

### Step 1: Connect to your server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # should print v20.x.x
```

### Step 3: Install PM2 (process manager)

PM2 keeps your services running after you close the terminal and restarts them automatically if they crash.

```bash
npm install -g pm2
```

### Step 4: Clone your fork

```bash
cd /home
git clone https://github.com/YOUR_USERNAME/ai-workspace.git
cd ai-workspace
```

### Step 5: Install dependencies

```bash
cd app && npm install
cd ../bridges/platforms && npm install
cd ../services/media && npm install
cd ../..
```

### Step 6: Configure environment

```bash
cd app
cp .env.example .env.local
nano .env.local
```

Required changes:
- Replace `AUTH_SECRET` with a strong random secret — generate one at [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Set `NEXT_PUBLIC_GITHUB_URL` to your fork URL

> ⚠️ Never use the default `AUTH_SECRET` in production. Changing it later will log out all existing users.

### Step 7: Build the app

```bash
cd app
npm run build
```

### Step 8: Start all services with PM2

```bash
cd /home/ai-workspace

# Start the Next.js app
pm2 start "npm run start --prefix app" --name fractera-app

# Start the bridge server
pm2 start "node bridges/platforms/server.js" --name fractera-bridge

# Start the media service
pm2 start "node services/media/server.js" --name fractera-media

# Save PM2 config so it restarts on server reboot
pm2 save
pm2 startup  # run the command it outputs
```

Check everything is running:
```bash
pm2 status
```

### Step 9: Install Nginx

```bash
sudo apt-get install -y nginx
```

### Step 10: Configure Nginx as reverse proxy

```bash
sudo nano /etc/nginx/sites-available/fractera
```

Paste this configuration (replace `your-domain.com`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Main app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Media service
    location /media-api/ {
        proxy_pass http://localhost:3300/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable the config:
```bash
sudo ln -s /etc/nginx/sites-available/fractera /etc/nginx/sites-enabled/
sudo nginx -t  # test config
sudo systemctl reload nginx
```

### Step 11: Enable HTTPS with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot will automatically configure Nginx for HTTPS and set up auto-renewal.

### Step 12: Open firewall ports

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 13: Verify

Open `https://your-domain.com` in your browser. Register your account — the first user becomes the Architect. Go to **Settings → Configure** to set your app title, theme, and connect OpenRouter if needed.

**Alternative: Instant Deploy** Visit [fractera.ai](https://fractera.ai), sign in with GitHub, and use the **Deploy skill** from the marketplace to handle all of the above automatically.

---

## 💡 Lightweight Deploy — $2/month Server + Home Computer

If you want to minimize hosting costs, this workflow lets you run a production website on a $2–3/month VPS (1 GB RAM) while doing all AI coding on your home machine.

### How it works

You develop on your home computer where you have the AI terminals, 16 GB RAM, and all the CLI tools. When you're ready to publish, you push to GitHub. The server picks up the changes, rebuilds, and serves the updated site to visitors — with no AI terminals running on the server at all.

### What runs on the cheap server

- Next.js app (`npm start`) — ~200 MB RAM
- Media service — ~50 MB RAM
- Nginx + SSL — ~30 MB RAM
- **Total: ~300–400 MB** — fits comfortably in 1 GB

### What does NOT run on the server

- AI terminals (Claude Code, Gemini, Codex, etc.) — not needed for serving the site
- Bridge server — can be skipped entirely
- Any CLI tools — not installed on the server

### What visitors get

The full website works normally — pages, auth, database, media files, all features you built. The only thing missing is the coding workspace, which is only visible to the architect anyway.

### Step 1: Set up auto-deploy on your server

After completing the standard VPS setup, add a deploy script:

```bash
# On your server, create /home/ai-workspace/deploy.sh
nano /home/ai-workspace/deploy.sh
```

Paste:
```bash
#!/bin/bash
cd /home/ai-workspace
git pull origin main
cd app && npm install --silent && npm run build
pm2 restart fractera-app
pm2 restart fractera-media
echo "Deploy complete"
```

Make it executable:
```bash
chmod +x /home/ai-workspace/deploy.sh
```

### Step 2: Start only the app and media service (skip the bridge)

```bash
pm2 start "npm run start --prefix app" --name fractera-app
pm2 start "node services/media/server.js" --name fractera-media
pm2 save
```

### Step 3: Trigger deploy from your home computer after each push

```bash
# After git push, run on your home machine:
ssh root@YOUR_SERVER_IP "/home/ai-workspace/deploy.sh"
```

Or set up a GitHub Action to trigger the deploy script automatically on every push to `main`.

### Cost comparison

| Setup | RAM needed | Monthly cost (Hetzner) |
|---|---|---|
| Full workspace (AI terminals) | 16 GB | ~$20–40/month |
| Site only (this workflow) | 1 GB | ~$2–4/month |

The AI coding happens on your home computer for free — you only pay to serve the result.

---

## 🎁 Free Skills Marketplace

Earn up to 8 free skills from the Fractera marketplace to supercharge your workspace. Send proof to `admin@fractera.ai`:

- 🍴 Fork this repository `(+1 skill)`
- ⭐ Star this repository `(+1 skill)`
- 📝 Leave a review on fractera.ai `(+1 skill)`
- 🐦 Post on X (Twitter) with a link `(+1 skill)`
- ✍️ Write an article on Medium `(+2 skills)`
- 💻 Write on dev.to or any dev blog `(+2 skills)`

---

## 🗺️ Roadmap

- [x] **v1.2** — Media Library, Database Browser, PWA icons, full agent documentation. *(Current)*
- [ ] **v1.3** — LightRAG Integration: shared context and memory across all AI agents.
- [ ] **v1.4** — Open Claw: multi-agent orchestration.

*All updates are free for self-hosted users. Need enterprise features like multilingual routing? Check out [Fractera Pro](https://github.com/Fractera/fractera).*

---

## 💼 Custom Development & Support

**Need a custom AI application or tailored infrastructure?** While Fractera AI Workspace is open-source, our team is available for hire to build bespoke, production-ready AI solutions for your business.

Whether you need complex custom integrations, multilingual routing, parallel slot architecture, or a completely proprietary app built on top of Fractera, we can build it for you.

**📫 Let's build something amazing together:**
- ✉️ **Reach out to us:** [admin@fractera.ai](mailto:admin@fractera.ai)
- 👔 **CEO:** Julia Kovalchuk
- 💻 **CTO:** Roma Bolshiyanov (Armstrong)

*Drop us an email to discuss your project requirements and get a quote!*

---

## ❓ FAQ

**Can Fractera run on a weak mobile phone?**

Yes. Your phone only displays the terminal output — all the heavy computation happens on your server. The phone itself does almost nothing, so even an older or low-end device works fine as a client.

**Can I host Fractera on Vercel or similar platforms?**

No. Fractera requires a real dedicated server because it runs multiple long-lived background processes simultaneously — the Next.js app, the bridge server, and the media service. Serverless platforms like Vercel are designed for short-lived functions and cannot support this. A dedicated VPS also gives you full cost control — you will never be surprised by a large bill from unexpected compute usage.

**Can I connect a cloud database, S3, or other cloud services?**

The platform puts no restrictions on this at all. Use whatever external services you normally use — connect them the same way you always do, through environment variables. You can add any variable directly in production via **Settings → Configure** inside the app, without touching the server. The built-in SQLite database and local file storage exist to protect you from unexpected costs by default — but the choice is entirely yours.

---

## 📋 Changelog

---

**v1.2.1** — 2026-04-27 13:00

- Crop format selector (16:9 / 1:1 / 9:16) moved inside the cropper — works correctly on mode switch
- CLAUDE.md updated with full database and media storage API instructions for AI agents

---

**v1.2.0** — 2026-04-26 23:59

Database Browser — inline SQLite table viewer and editor built into the workspace.

- New "Database" button in the Settings menu opens a full-panel database browser
- Left sidebar (250px, sticky) lists all application tables: users, sessions, accounts, verification_tokens
- Right area shows all columns and rows with horizontal scroll support
- Hover any row to reveal: pencil icon per cell, delete button at far right
- Pencil opens an edit modal with context-aware input type:
  - `roles` column — multi-checkbox selector (architect / user / guest), stored as JSON array
  - `is_active` — single select (1 / 0)
  - `provider` — single select (credentials / google / github / guest)
  - `locale` — single select (en / ru / es / fr / de / zh)
  - All other columns — free textarea
- Delete row with confirmation overlay (one row at a time)
- All edits and deletes show toast feedback
- API routes secured: table names validated against sqlite_master, column names validated against PRAGMA table_info — no SQL injection possible
- Media database (services/media/data/media.db) is intentionally separate and not shown here

---

**v1.1.0** — 2026-04-26 23:00

Media Library — standalone media service and full asset management system.

- New standalone HTTP service `services/media/` running on port 3300, isolated from the main Next.js app
- SQLite database for media metadata: title, description, original filename, MIME type, dimensions, duration, storage key
- Image upload with built-in canvas-based cropper — three aspect ratio modes: 16:9 horizontal, 1:1 square, 9:16 vertical
- Video upload with direct storage (no crop)
- Media library panel in workspace Settings menu — list view with search, preview, copy URL, rename, delete
- Search across title, description, original filename and file URL with relevance-based sorting
- Inline preview popup for images and videos directly in the panel
- Per-file edit panel (pencil icon) for setting custom title and description independently from original filename
- Delete confirmation flow to prevent accidental removal
- Copy URL button with clipboard toast feedback
- Favicon and PWA icon generation from a single square source image: favicon.ico (16+32px combined), favicon-16/32.png, apple-touch-icon.png (180×180), icon-192/512.png, og-image.jpg (1200×630), manifest.json
- Project is PWA-ready at the icon level — manifest and all required icon sizes generated automatically
- CLAUDE.md and AGENTS.md updated with full media service API documentation for AI agents
- All three services (app, bridge, media) start together via single `npm run dev` from repo root

---

**v1.0.0** — 2026-04-26 20:00

Initial public release of Fractera AI Workspace — a self-hosted, open-source platform for running multiple AI coding agents in a single unified workspace.

- Multi-platform terminal workspace: Claude Code, Codex, Gemini CLI, Qwen Code, Kimi Code, Open Code (OpenRouter)
- Parallel interactive terminal sessions — switch between agents without losing context
- Single bridge server process manages all platform WebSocket connections on ports 3200–3206
- Built-in authentication: email/password registration, guest mode, architect role (first registered user)
- Role-based access control — architect gets coding workspace, users get standard access
- Data export/import — full backup and restore of SQLite database and storage files as a single zip
- Safe import merge — incoming data is merged with existing records, nothing is overwritten
- Auto-update from upstream GitHub repository via UI button, no SSH required
- Settings panel with environment variable editor — configure API keys, title, theme without touching files
- Info panel with live README rendering from GitHub or local file
- Proxy-based route protection (Next.js 16 native, no middleware.ts)
- Dark/light/system theme switcher with persistent preference
- Full shadcn/ui component library integrated
- Toast notifications wired globally via root layout

---

<p align="center">
  <i>Built with ❤️ for developers who value freedom.</i>
</p>
