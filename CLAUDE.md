# Fractera AI Workspace — Setup Agent

## Hello, Claude Code

You are reading this file because you were launched in the Fractera AI Workspace project folder. Your role is to set up this workspace completely — install Fractera itself and all AI coding platforms.

### Step 0 — Verify you are in the right folder

Before anything else, confirm you are inside the Fractera project. The correct folder contains ALL of the following:

```
app/           ← Next.js application
bridges/       ← WebSocket bridge server
services/      ← Media and other services
CLAUDE.md      ← this file
package.json   ← root package with "name": "fractera-light"
```

Run this check:

```bash
ls app bridges services package.json 2>/dev/null && echo "OK" || echo "MISSING"
```

**If the check passes** — you are in the right place. Continue to the greeting below.

**If the check fails** — you are in the wrong folder. Tell the user:

> "I don't see the Fractera project files here. Let me search for them on your computer."

Then search:

```bash
# Mac / Linux
find ~ -maxdepth 4 -name "package.json" -exec grep -l '"name": "fractera-light"' {} \; 2>/dev/null | head -5
```

```powershell
# Windows PowerShell
Get-ChildItem -Path $env:USERPROFILE -Recurse -Depth 4 -Filter "package.json" -ErrorAction SilentlyContinue | Select-String '"name": "fractera-light"' | Select-Object -ExpandProperty Path | Select-Object -First 5
```

If found — tell the user the exact path and ask them to run:
```bash
cd <found-path>
claude
```

If not found — ask the user:
> "I couldn't find the Fractera project automatically. Could you tell me where you saved it? For example, did you download a zip and extract it somewhere, or clone it with git? You can drag the folder into this terminal window to get the path."

Do not proceed until you are in the correct folder.

---

**On first read, introduce yourself and propose the setup:**

Say something like:
> "Hello! I can see this is a fresh Fractera AI Workspace. I'll set up everything for you — install Fractera dependencies, launch the app, and install all 6 AI coding platforms (Codex, Gemini CLI, Qwen Code, Kimi Code, OpenCode — plus Claude Code is already running). This will take a few minutes. Shall I begin?"

Wait for confirmation before proceeding.

If CLAUDE.md starts with `<!-- SETUP COMPLETE:` — setup has already been done. Skip Phases 1 and 2. Greet the user, confirm the workspace is ready, and offer to help with development.

---

## Phase 1 — Launch Fractera

Install dependencies and start the app:

```bash
npm install --prefix app
npm install --prefix bridges/platforms
npm install --prefix services/media
npm run dev
```

Verify: http://localhost:3000 responds (try after ~10 seconds).

If any npm install fails — read `app/CLAUDE.md` for the full project structure before retrying.

---

## Phase 2 — Install AI platforms

For each platform in the table below, follow this procedure:

1. **Try** the install command for the detected OS
2. **Verify** by running the verify command
3. **If it fails** — STOP. Read the documentation file listed in the Doc path column. Find the root cause. Apply the fix. Retry.
4. **Never** stop on error — keep going until verified or documented as unresolvable on this OS
5. **Never** use internet search or training memory as primary source — always read the doc file first

### Platform table

| Platform | Install — Mac/Linux | Install — Windows (PowerShell) | Doc path | Verify | Auth (after install) |
|---|---|---|---|---|---|
| **Claude Code** | Already installed — you are Claude Code | — | `docs/platforms/claude-code/` | `claude --version` | Already authenticated |
| **Codex CLI** | `npm install -g @openai/codex` | `npm install -g @openai/codex` | `docs/platforms/codex/` | `codex --version` | `codex login` |
| **Gemini CLI** | `npm install -g @google/gemini-cli` | `npm install -g @google/gemini-cli` | `docs/platforms/gemini-cli/` | `gemini --version` | `gemini` (browser auth on first run) |
| **Qwen Code** | `curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.sh \| bash` | `curl -fsSL -o %TEMP%\install-qwen.bat https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.bat && %TEMP%\install-qwen.bat` | `docs/platforms/qwen-code/` | `qwen --version` | `qwen auth` |
| **Kimi Code** | `curl -LsSf https://code.kimi.com/install.sh \| bash` | `Invoke-RestMethod https://code.kimi.com/install.ps1 \| Invoke-Expression` | `docs/platforms/kimi-code/` | `kimi --version` | `kimi` then `/login` |
| **OpenCode** | `curl -fsSL https://opencode.ai/install \| bash` | `npm install -g opencode-ai` | `docs/platforms/open-code/` | `opencode --version` | `opencode` then `/connect` |

### Roadmap items — skip for now

- **Company Brain (LightRAG)** — coming in v1.3, no CLI yet. Note it in the final report as "pending v1.3".
- **Open Claw** — coming in v1.4, no CLI yet. Note it in the final report as "pending v1.4".

---

## Documentation rule (CRITICAL)

If any command fails:

1. **STOP** — do not retry the same command blindly
2. **READ** the doc file for that platform (path in the table above)
3. **Identify** the root cause from the documentation
4. **Apply** the documented fix
5. **Retry**

Repeat until verified. The docs contain install troubleshooting, OS-specific notes, and alternative install methods. Use them. Do not guess.

---

## Phase 3 — Archive and final report

When all platforms are installed and verified:

**1. Create `/CLAUDE.setup-complete.md`** with:
- Date and time of completion (ISO 8601 format)
- Table: Platform | Version | Status | Notes
- Any errors encountered and how they were resolved

**2. Prepend to this file (`/CLAUDE.md`) the line:**
```
<!-- SETUP COMPLETE: <ISO datetime> — see CLAUDE.setup-complete.md -->
```
This flag tells Claude Code on future startups that setup is done — skip Phases 1 and 2.

**3. Print the summary table** in the terminal.

**4. Tell the user — read this aloud carefully:**

---

> **Fractera is ready. Here is what to do next — follow these steps in order.**
>
> **Step 1 — Register your account**
> Open http://localhost:3000 in your browser. You will see a registration form.
> Register now. The **first account registered becomes the Architect** — this is the admin role with full access to the coding workspace.
>
> ⚠️ **Save your email address somewhere safe.** The Architect email is stored only in the local database. If you forget it, recovery without AI assistance is not possible.
>
> **Step 2 — Open the coding workspace**
> After registering, you will see the main page. In the top-right corner, click the **"Start Coding"** button. A coding workspace panel will open.
>
> **Step 3 — Configure your first AI platform**
> Inside the coding workspace, click the **Settings** button (gear icon, top-left of the panel). A settings menu will appear. Select **"Configure"** to open the environment variable editor.
>
> Here you can add API keys for any AI platform. For Claude Code, you are already authenticated. For other platforms, add their keys now — or do it later from the same Settings → Configure menu.
>
> **Step 4 — Authenticate each platform**
> Each platform needs a one-time login after installation. See the Auth column in the platform table above. You can do this now from your terminal, or launch each platform from the carousel inside the workspace and authenticate on first run.

---

- The full installation log has been saved to `CLAUDE.setup-complete.md`

---

## On future startups

If this file starts with `<!-- SETUP COMPLETE:` — do not run setup again.

Instead:
- Greet the user briefly
- Confirm the workspace is running (or offer to start it with `npm run dev`)
- Offer to help with development tasks
