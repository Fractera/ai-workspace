# Fractera AI Workspace — Install Reference

> This file is a reference document for the setup agent.
> The setup logic lives in `~/.claude/CLAUDE.md` — the global agent.
> Do not run setup from this file directly.

---

## Phase 1 — Dependency install order

Run from the project root (`~/ai-workspace/`), in this exact order:

```bash
# 1. Fix npm cache permissions (macOS/Linux — run silently)
sudo chown -R $(whoami) ~/.npm 2>/dev/null || true

# 2. Root dependencies (installs concurrently — required for npm run dev)
npm install

# 3. Next.js application
npm install --prefix app

# 4. Bridge server (postinstall auto-fixes node-pty permissions on macOS)
npm install --prefix bridges/platforms

# 5. Media service
npm install --prefix services/media

# 6. Start all services together
npm run dev
```

Verify after start: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` → `200` or `307`

If any step fails — read `app/CLAUDE.md` before retrying. Never guess.

---

## Phase 2 — AI platform install table

For each platform: **read the doc file first**, then run the install command.

| Platform | Install — Mac/Linux | Install — Windows | Doc path | Verify | Auth |
|---|---|---|---|---|---|
| **Claude Code** | Already running | — | `docs/platforms/claude-code/` | `claude --version` | Already authenticated |
| **Codex CLI** | `npm install -g @openai/codex` | `npm install -g @openai/codex` | `docs/platforms/codex/` | `codex --version` | `codex login` |
| **Gemini CLI** | `npm install -g @google/gemini-cli` | `npm install -g @google/gemini-cli` | `docs/platforms/gemini-cli/` | `gemini --version` | `gemini` (browser) |
| **Qwen Code** | `curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.sh \| bash` | `curl -fsSL -o %TEMP%\install-qwen.bat ... && %TEMP%\install-qwen.bat` | `docs/platforms/qwen-code/` | `qwen --version` | `qwen auth` |
| **Kimi Code** | `curl -LsSf https://code.kimi.com/install.sh \| bash` | `Invoke-RestMethod https://code.kimi.com/install.ps1 \| Invoke-Expression` | `docs/platforms/kimi-code/` | `kimi --version` | `kimi` → `/login` |
| **OpenCode** | `curl -fsSL https://opencode.ai/install \| bash` | `npm install -g opencode-ai` | `docs/platforms/open-code/` | `opencode --version` | `opencode` → `/connect` |

After each successful install → set `active: true` in:
`app/app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts`

**Roadmap (skip — not available yet):**
- Company Brain (LightRAG) — v1.3
- Open Claw — v1.4

---

## Documentation rule

**Never use training memory as the source for install commands.**
Always read the doc file for the platform first.
If a command fails — re-read the doc. Never retry the same failed command without reading.
