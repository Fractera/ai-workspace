
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

> **One workspace. Every AI coding platform. Zero cloud dependency.** > Fractera AI Workspace is an open-source, self-hosted interface that brings Claude Code, Codex, Gemini CLI, Qwen, Kimi, and 300+ OpenRouter models into a single, powerful unified terminal. 

Bring your own keys (BYOK), keep your code on your own server, and build applications in minutes without paying for expensive managed services.

<p align="center">
  <img src="docs/fractera-coding.png" alt="Fractera AI Workspace Demo" width="800"/>
</p>

---

⭐ **Support Open Source:** If Fractera saves you time and money, please **Star this repository** to help other developers discover privacy-first AI tools! ⭐

---

## 📑 Table of Contents
- [Why Fractera?](#-why-fractera)
- [Core Features](#-core-features)
- [Supported Platforms](#-supported-ai-platforms)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Quickstart (Local Dev)](#-quickstart)
- [Production Deployment](#-deploy-to-a-vps)
- [Earn Free Skills](#-free-skills-marketplace)
- [Roadmap](#-roadmap)

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
* 🔐 **Built-in Authentication:** Ready-to-use email/password auth, guest mode, and role-based access control (RBAC). First user becomes the Architect (Admin).
* 💽 **Absolute Data Portability:** Export and import your entire database and file storage in a single click.
* 🔄 **Seamless Auto-Updates:** Pull the latest open-source version from upstream without touching the server via SSH.
* 🧩 **Skills Marketplace:** Extend your workspace with community-built AI extensions at [fractera.ai](https://fractera.ai).

---

## 🛠️ Tech Stack
Built for speed, simplicity, and zero maintenance:
* **Frontend/Backend:** Next.js, Node.js
* **Database:** SQLite (No external DB required)
* **Architecture:** Parallel Slot Architecture with built-in error isolation.

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
```bash
# Install app dependencies
cd app && npm install

# Install bridge dependencies
cd ../bridges/platforms && npm install
```

### Step 3: Configure Environment
```bash
cd ../app
cp .env.example .env.local
```
*Note: The default `.env.local` includes a working `AUTH_SECRET` so the app starts immediately. You can configure API keys, themes, and titles later inside the UI.*

### Step 4: Run the Application
You will need two terminal windows.

**Terminal 1 (Bridge Server):**
```bash
# From the repo root:
node bridges/platforms/server.js
```

**Terminal 2 (App Server):**
```bash
# From the /app directory:
npm run dev
```
Open `http://localhost:3000`. Register your account (the first user becomes the Admin/Architect).

### Step 5: Authenticate Your AI 
Run each platform's auth command once in your local terminal. Credentials remain securely on your machine:
```bash
claude auth         # Claude Code
codex auth          # Codex
gemini auth         # Gemini CLI
qwen auth           # Qwen Code
kimi auth           # Kimi Code
openCode API login  # OpenCode
```
*(For OpenCode with OpenRouter, set the API key via Settings → Configure in the UI).*

---

## 🌍 Deploy to a VPS

Run Fractera on any cheap $2–5/month server (Ubuntu 22+ recommended).

```bash
git clone [https://github.com/YOUR_USERNAME/ai-workspace.git](https://github.com/YOUR_USERNAME/ai-workspace.git)
cd ai-workspace

# Install & Build
cd app && npm install
cd ../bridges/platforms && npm install
cd ../app
cp .env.example .env.local
npm run build

# Start services (Use PM2 or systemd in production)
npm start &
node ../bridges/platforms/server.js &
```
> ⚠️ **Production Security Note:** Replace `AUTH_SECRET` in your `.env.local` with a strong secret (generate at `generate-secret.vercel.app/32`). Point your domain to port 3000 and use Nginx/Caddy as a reverse proxy for HTTPS.

**Alternative: Instant Deploy** Visit [fractera.ai](https://fractera.ai), sign in with GitHub, and use the **Deploy skill** from the marketplace to handle VPS setup, environment, and HTTPS automatically.

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

- [x] **v1.0** — Multi-platform terminals, built-in auth, data export. *(Current)*
- [ ] **v1.1** — **LightRAG Integration:** Shared context/memory across all AI agents.
- [ ] **v1.2** — **Open Claw:** Multi-agent orchestration.

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


---

## 📋 Changelog

---

**v1.0.2** — 2026-04-26 23:59

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
- All edits and deletes show Sonner toast feedback
- API routes secured: table names validated against sqlite_master, column names validated against PRAGMA table_info — no SQL injection possible
- Media database (services/media/data/media.db) is intentionally separate and not shown here

---

**v1.0.1** — 2026-04-26 23:00

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
- Sonner toast notifications wired globally via root layout

---

**v1.0.1** — 2026-04-26 23:00

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

<p align="center">
  <i>Built with ❤️ for developers who value freedom.</i>
</p>


