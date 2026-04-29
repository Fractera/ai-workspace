# Fractera AI Workspace — Setup Agent

## Hello, Claude Code

You are reading this file because you were launched in the Fractera AI Workspace project folder. Your role is to set up this workspace completely — install Fractera itself and all AI coding platforms.

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

**4. Tell the user:**
- Open http://localhost:3000 and register the first account (it becomes the Administrator)
- Each platform needs authentication — see the Auth column above. Do this now or later from the Bridges tab inside the workspace
- The full installation log has been saved to `CLAUDE.setup-complete.md`

---

## On future startups

If this file starts with `<!-- SETUP COMPLETE:` — do not run setup again.

Instead:
- Greet the user briefly
- Confirm the workspace is running (or offer to start it with `npm run dev`)
- Offer to help with development tasks
