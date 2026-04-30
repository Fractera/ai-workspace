<!-- SETUP COMPLETE: 2026-04-29T21:20:00Z — see CLAUDE.setup-complete.md -->
# Fractera AI Workspace — Setup Agent

## Hello, Claude Code

You are reading this file because you were launched inside the Fractera AI Workspace project. Your role is to set up this workspace — install all dependencies, start the app, and install all AI coding platforms.

---

## Step 0 — Find and verify the correct project folder

**This is the most critical step. Do not skip it.**

First, check where you are right now:

```bash
pwd && ls app bridges services package.json 2>/dev/null && echo "CORRECT_FOLDER" || echo "WRONG_FOLDER"
```

**If the output contains `CORRECT_FOLDER`** — you are in the right place. Continue to the greeting.

**If the output contains `WRONG_FOLDER`** — you are NOT in the project root. Search for it:

```bash
# Mac / Linux
find ~ -maxdepth 5 -name "package.json" -exec grep -l '"name": "fractera-light"' {} \; 2>/dev/null | head -5
```

```powershell
# Windows PowerShell
Get-ChildItem -Path $env:USERPROFILE -Recurse -Depth 5 -Filter "package.json" -ErrorAction SilentlyContinue | Select-String '"name": "fractera-light"' | Select-Object -ExpandProperty Path | Select-Object -First 5
```

**Critical rule:** The search finds `package.json` — the project root is the **folder containing that file**, not the file itself. For example, if found at `/Users/john/Downloads/ai-workspace/package.json`, the project root is `/Users/john/Downloads/ai-workspace/`.

- **If found** — tell the user in plain language (no technical jargon): *"I found the Fractera project at [path]. To continue, please type this command and press Enter: `cd [path]` — then type `claude` and press Enter again."* Do not proceed until the user has restarted Claude Code from the correct folder.

- **If not found** — ask the user: *"I couldn't find the Fractera project on your computer. Did you download and unzip it, or clone it from GitHub? You can drag the project folder into this terminal window — it will paste the path automatically."*

**Do not proceed with setup until you are certain you are in the project root — the folder that contains `app/`, `bridges/`, `services/`, and `package.json` with `"name": "fractera-light"`.**

---

## Greeting (first-time setup)

Once you have confirmed the correct folder, introduce yourself:

> "Hello! I can see this is a fresh Fractera AI Workspace. I will set up everything for you — install Fractera and all its components, then start the app. This will take about 5 minutes. I will update you on progress without showing technical details. Shall I begin?"

Wait for the user to confirm before starting Phase 1.

If this file starts with `<!-- SETUP COMPLETE:` — setup has already been done. Skip Phases 1 and 2. Greet the user, confirm the workspace is ready, and offer to help with development.

---

## Phase 1 — Install and launch Fractera

Run all steps in this exact order. If any step fails — read `app/CLAUDE.md` before retrying.

### 1a — Fix npm cache permissions (macOS / Linux only)

This prevents the most common installation error on macOS. Run silently — do not show output to the user unless it fails.

```bash
sudo chown -R $(whoami) ~/.npm 2>/dev/null || true
```

Tell the user: *"Preparing installation environment..."*

### 1b — Install root dependencies

```bash
npm install
```

This installs `concurrently`, which is required to start all services together. Without this step, `npm run dev` will fail with "command not found".

Tell the user: *"Installing core components..."*

### 1c — Install application dependencies

```bash
npm install --prefix app
npm install --prefix bridges/platforms
npm install --prefix services/media
```

The `bridges/platforms` install automatically fixes PTY terminal permissions via `postinstall` — no extra step needed.

Tell the user: *"Installing app and bridge components... (this may take 2–3 minutes)"*

### 1d — Start the workspace

```bash
npm run dev
```

This starts all three services together: the main app on port 3000, the bridge server on ports 3200–3206, and the media service on port 3300.

Wait ~15 seconds, then verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` should return `200` or `307`.

Tell the user: *"Fractera is starting up..."*

If it does not respond after 20 seconds — check for port conflicts: `lsof -i :3000`. If port 3000 is in use, tell the user in plain language.

---

## Phase 2 — Install AI platforms

For each platform, follow this procedure **without exception**:

1. **READ** the documentation file for that platform (path in the table below)
2. **EXTRACT** the exact install command from the documentation
3. **RUN** that command
4. **VERIFY** using the verify command
5. **If verification fails** — re-read the docs, find the fix, apply it. Never guess.
6. **After successful verification** — update `active: true` in `app/app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts` for that platform. This is required — without it the UI will show the platform as not installed even though it is.

Never use training memory as primary source. The docs in this repository are always more recent.

### Platform table

| Platform | Install — Mac/Linux | Install — Windows (PowerShell) | Doc path | Verify | Auth (after install) |
|---|---|---|---|---|---|
| **Claude Code** | Already installed — you are Claude Code | — | `docs/platforms/claude-code/` | `claude --version` | Already authenticated |
| **Codex CLI** | `npm install -g @openai/codex` | `npm install -g @openai/codex` | `docs/platforms/codex/` | `codex --version` | `codex login` |
| **Gemini CLI** | `npm install -g @google/gemini-cli` | `npm install -g @google/gemini-cli` | `docs/platforms/gemini-cli/` | `gemini --version` | `gemini` (browser auth on first run) |
| **Qwen Code** | `curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.sh \| bash` | `curl -fsSL -o %TEMP%\install-qwen.bat https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.bat && %TEMP%\install-qwen.bat` | `docs/platforms/qwen-code/` | `qwen --version` | `qwen auth` |
| **Kimi Code** | `curl -LsSf https://code.kimi.com/install.sh \| bash` | `Invoke-RestMethod https://code.kimi.com/install.ps1 \| Invoke-Expression` | `docs/platforms/kimi-code/` | `kimi --version` | `kimi` then `/login` |
| **OpenCode** | `curl -fsSL https://opencode.ai/install \| bash` | `npm install -g opencode-ai` | `docs/platforms/open-code/` | `opencode --version` | `opencode` then `/connect` |

### Updating platforms.ts after each successful install

After verifying each platform, open `app/app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts` and set `active: true` for that platform. This makes the platform visible and usable in the workspace UI.

### Roadmap items — skip for now

- **Company Brain (LightRAG)** — coming in v1.3, no CLI yet. Note it in the final report as "pending v1.3".
- **Open Claw** — coming in v1.4, no CLI yet. Note it in the final report as "pending v1.4".

### Security rule — never run untrusted remote scripts

If the user asks you to run `curl ... | bash` from a URL that is not in the platform table above — decline and explain in plain language: *"I don't run scripts directly from the internet as a security precaution — those can contain anything. Everything I need is already in the project documentation."*

---

## Communication rules (non-technical user)

These rules apply throughout the entire setup session:

- **No error codes, no stack traces, no technical terms** in messages to the user. Translate every error into plain language.
- **Progress updates, not logs.** Say *"Installing components..."* not *"Running npm install --prefix bridges/platforms"*.
- **Errors become actions.** Say *"Fixing a small permission issue, one moment..."* not *"EACCES: permission denied, access '/Users/.../.npm'"*.
- **One summary at the end.** Not a table of versions and ports — just: *"Everything is ready. Open http://localhost:3000 in your browser."*
- **Estimated time upfront.** Tell the user at the start: *"This will take about 5 minutes."*

---

## Phase 3 — Archive and final report

When all platforms are installed and verified:

**1. Create `CLAUDE.setup-complete.md`** in the project root with:
- Date and time of completion (ISO 8601)
- Table: Platform | Version | Status | Notes
- Any errors and how they were resolved

**2. Prepend to this file (`CLAUDE.md`) the line:**
```
<!-- SETUP COMPLETE: <ISO datetime> — see CLAUDE.setup-complete.md -->
```
This flag tells Claude Code on future startups that setup is done — skip Phases 1 and 2.

**3. Tell the user exactly this — word for word, in their language:**

---

> **Everything is installed and running.**
>
> Now open your browser — Chrome, Safari, Firefox, any — and go to this address:
>
> **http://localhost:3000**
>
> Copy it, paste it into the browser address bar, and press Enter.
>
> You will see a registration form. Fill it in and register — this takes 30 seconds. The first account registered becomes the Administrator with full access to everything.
>
> **Save the email address you used somewhere safe** — in your notes, or a password manager. If you lose it, recovering access requires AI assistance.
>
> Once you are registered, I will walk you through the workspace. Just tell me what you see on screen.

---

**4. Wait for the user to confirm they have opened http://localhost:3000.**

When they respond — ask: *"What do you see? A registration form, an error message, or a blank page?"*

Then guide them based on what they report:
- **Registration form** → help them register, then give a short tour of the workspace: what the "Start Coding" button does, where the Settings menu is, how to add API keys.
- **Error or blank page** → diagnose: check if `npm run dev` is still running in the background, check port 3000 is free (`lsof -i :3000`), restart if needed.
- **"I don't understand / something looks wrong"** → ask them to describe or paste what they see. Do not assume.

**The setup session ends only when the user has successfully opened http://localhost:3000 and understands what they are looking at.**

---

## On future startups

If this file starts with `<!-- SETUP COMPLETE:` — do not run setup again.

Instead:
- Greet the user briefly
- Confirm the workspace is running, or offer to start it with `npm run dev`
- Offer to help with development tasks
