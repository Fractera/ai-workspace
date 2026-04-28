# Kimi Code CLI

Source: https://moonshotai.github.io/kimi-cli + AGENTS.md from https://github.com/MoonshotAI/kimi-code

---

## What is Kimi Code

Kimi Code is an intelligent programming service for developers included in Kimi membership. Built on Kimi's latest flagship models — provides AI-assisted capabilities (code reading, file editing, command execution) via CLI and VS Code extension. Subscribers can also obtain an API Key to integrate into third-party tools.

### Core Advantages

- **Continuous model upgrades** — always uses latest Kimi flagship model; model ID `kimi-for-coding` stays stable, backend updates automatically
- **Broad compatibility** — works with Kimi Code CLI, VS Code, Claude Code, Roo Code, OpenCode, OpenClaw, and more
- **Ultra-fast response** — up to 100 tokens/s output speed
- **High-frequency concurrency** — ~300–1,200 requests per 5-hour window, up to 30 concurrent requests

---

## API Access

### OAuth (Official Clients)

```bash
kimi /login    # CLI — auto OAuth, no API key needed
```

VS Code extension: login button in sidebar.

### API Key (Third-Party Tools)

Generate in **Kimi Code Console** (up to 5 keys; shown only once — save immediately).

#### Service Endpoints

| Protocol | Base URL |
|---|---|
| OpenAI Compatible | `https://api.kimi.com/coding/v1` |
| Anthropic Compatible | `https://api.kimi.com/coding/` |

Model ID: always use `kimi-for-coding` (stable ID — backend auto-updates to latest model).

### Using in Claude Code

```bash
# Set in Claude Code settings or environment
ANTHROPIC_BASE_URL=https://api.kimi.com/coding/
ANTHROPIC_API_KEY=<your-kimi-code-api-key>
```

### Kimi Platform vs Kimi Code Platform

| Item | Kimi Code | Kimi Platform |
|---|---|---|
| Base URL (OpenAI) | `https://api.kimi.com/coding/v1` | `https://api.moonshot.cn/v1` |
| Billing | Membership subscription, rate limited | Pay-as-you-go |
| Best for | Terminal/IDE Agent programming | Product integration, enterprise, multimodal |

---

## Quota and Limits

- Quota refreshes every **7 days** from subscription date — unused quota does not carry over
- **Rolling 5-hour frequency window** — too many requests triggers rate limiting, auto-recovers after window rolls
- All devices and API Keys **share the same quota** (CLI + VS Code + third-party tools)
- Devices inactive 30+ days auto-unbound — run `/login` again to restore
- Kimi Code shares quota with Kimi membership monthly total — if monthly quota hits limit, Kimi Code freezes until reset or upgrade

Check quota, manage API Keys, view devices: **Kimi Code Console**

---

## Subscription Plans

| Plan | Monthly | Annual | Description |
|---|---|---|---|
| **Moderato** | $15/mo ($19 regular) | $180/yr | Weekly refreshed quotas, multi-device login |
| **Allegretto** | $31/mo ($39 regular) | $372/yr | Ample weekly limits, increased concurrency — recommended |
| **Allegro** | $79/mo ($99 regular) | $948/yr | Expansive quota for intensive development |
| **Vivace** | $159/mo ($199 regular) | $1,908/yr | Highest weekly quotas for complex projects and large codebases |

All plans include other Kimi membership benefits.

Default model: **kimi-for-coding** (powered by kimi-k2.6)

---

## Install

```bash
# macOS / Linux
curl -LsSf https://code.kimi.com/install.sh | bash

# Windows PowerShell
Invoke-RestMethod https://code.kimi.com/install.ps1 | Invoke-Expression
```

---

## Auth

```bash
kimi login
# or
kimi /login
# Select platform → OAuth or manual API key → credentials auto-saved
```

---

## Launch

```bash
kimi                    # interactive shell (default)
kimi-cli                # alias
kimi --print            # non-interactive, print output
kimi --output-format stream-json --yolo  # Fractera bridge mode
```

---

## Tech Stack

- Python 3.12+ (tooling configured for 3.14)
- CLI framework: Typer
- Async runtime: asyncio
- LLM abstraction: kosong (unified provider layer)
- MCP integration: fastmcp
- Logging: loguru
- Package management: uv + uv_build
- Binaries: PyInstaller
- Tests: pytest + pytest-asyncio
- Lint/format: ruff
- Types: pyright + ty

---

## Architecture

| Component | Location | Purpose |
|---|---|---|
| CLI entry | `src/kimi_cli/cli/__init__.py` | Typer, parses flags, routes to KimiCLI |
| App/runtime | `src/kimi_cli/app.py` | `KimiCLI.create()` — loads config, model, runtime, agent spec |
| Config | `src/kimi_cli/config.py` | User config at `~/.kimi/config.toml` |
| LLM | `src/kimi_cli/llm.py` | Provider/model selection |
| Core loop | `src/kimi_cli/soul/kimisoul.py` | Main agent loop — input → LLM → tools → output |
| Context | `src/kimi_cli/soul/context.py` | Conversation history + checkpoints |
| Toolset | `src/kimi_cli/soul/toolset.py` | Loads tools by import path, runs tool calls, bridges MCP |
| Approvals | `src/kimi_cli/soul/approval.py` | Tool-facing approval facade |
| Agent specs | `src/kimi_cli/agents/` | YAML specs — extend base agents, select tools, register subagents |
| Built-in tools | `src/kimi_cli/tools/` | agent, shell, file, web, todo, background, dmail, think, plan |
| UI frontends | `src/kimi_cli/ui/` | shell / print / acp / wire |
| Wire/events | `src/kimi_cli/wire/` | Event types and transport between soul and UI |
| MCP | `src/kimi_cli/mcp.py` | MCP tool management, stored in share dir |
| Slash commands | `src/kimi_cli/soul/slash.py` | Soul-level slash commands |

---

## User Data Paths

| Path | Purpose |
|---|---|
| `~/.kimi/config.toml` | User config |
| `~/.kimi/` | Logs, sessions, MCP config |
| `session/subagents/<agent_id>/` | Subagent instance metadata, prompts, wire logs, context |

---

## Slash Commands

- `/skill:<name>` — load `SKILL.md` as user prompt
- `/flow:<name>` — execute embedded flow
- `/login` — authenticate

---

## Key Packages

| Package | Purpose |
|---|---|
| `kosong` | LLM abstraction layer — unified message structures, async tool orchestration, pluggable chat providers |
| `kaos` (PyKAOS) | OS abstraction — file operations and command execution, switchable between local and remote SSH |

---

## Dev Commands

```bash
make prepare      # sync deps for all workspace packages + install git hooks
make format       # ruff format
make check        # lint + type check
make test         # pytest
make ai-test      # AI-powered tests
make build        # build package
make build-bin    # PyInstaller binary
```

Use `uv run ...` when running tools directly.

---

## Fractera Bridge Config

In `CLAUDE.md` / bridge config:
```
Kimi Code Bridge: :3205
Flags: --print --output-format stream-json
```

---

## Key Features

### Shell Command Mode

Press `Ctrl-X` to switch to shell command mode — run shell commands directly without leaving Kimi Code CLI. Note: built-in shell commands like `cd` are not supported yet.

### VS Code Extension

Kimi Code CLI integrates with VS Code via the Kimi Code VS Code Extension.

### ACP (Agent Client Protocol)

Kimi Code CLI is an ACP server — works with any ACP-compatible editor (Zed, JetBrains, etc.).

```bash
# Run in terminal first, complete login
kimi /login

# Start as ACP server
kimi acp
```

Config for Zed / JetBrains (`~/.config/zed/settings.json` or `~/.jetbrains/acp.json`):

```json
{
  "agent_servers": {
    "Kimi Code CLI": {
      "type": "custom",
      "command": "kimi",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

### Zsh Integration

```bash
git clone https://github.com/MoonshotAI/zsh-kimi-cli.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/kimi-cli
```

Add `kimi-cli` to plugins in `~/.zshrc`:
```
plugins=(... kimi-cli)
```

After restart: press `Ctrl-X` to switch to agent mode.

---

## MCP Support

```bash
# Add streamable HTTP server
kimi mcp add --transport http context7 https://mcp.context7.com/mcp \
  --header "CONTEXT7_API_KEY: ctx7sk-your-key"

# Add HTTP server with OAuth
kimi mcp add --transport http --auth oauth linear https://mcp.linear.app/mcp

# Add stdio server
kimi mcp add --transport stdio chrome-devtools -- npx chrome-devtools-mcp@latest

# List, remove, authorize
kimi mcp list
kimi mcp remove chrome-devtools
kimi mcp auth linear

# Ad-hoc config file
kimi --mcp-config-file /path/to/mcp.json
```

MCP config file format:
```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": { "CONTEXT7_API_KEY": "YOUR_API_KEY" }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

---

## Dev Commands (Extended)

```bash
uv run kimi              # run Kimi Code CLI directly
make test-kimi-cli       # Kimi Code CLI tests only
make test-kosong         # kosong tests only
make test-pykaos         # pykaos tests only
make build-web           # build web UI and sync into package (requires Node.js/npm)
make help                # show all make targets
```

Note: `make build` and `make build-bin` automatically run `make build-web` to embed the web UI.

---

## Troubleshooting

### Installation and Authentication

**Empty model list during `/login`**
- Invalid/expired API key — check key validity
- Network issue — verify access to `api.kimi.com` or `api.moonshot.cn`
- Wrong Base URL — Kimi Code uses `api.kimi.com/coding/...`, Kimi Platform uses `api.moonshot.cn/v1`

**Invalid API key**
- Check for extra spaces or missing characters
- Check key status in console
- Check env var override: `echo $KIMI_API_KEY` — may override config file

**Membership expired / quota exhausted**
```bash
kimi /usage    # check current quota and membership status
```

### Interaction Issues

**`cd` doesn't work in shell mode**
Each shell command runs in an independent subprocess — `cd` only affects that subprocess.
Solutions:
```bash
kimi --work-dir /path/to/project    # specify working directory at startup
```
Or use absolute paths in commands.

**Working directory deleted during session**
Kimi detects this and exits cleanly with a crash report containing the session ID. Recover:
```bash
kimi -r <session-id>    # from the correct directory
```

**Image paste fails**
`Ctrl-V` paste fails with "Current model does not support image input" → switch to an image-capable model.

### ACP Issues

**IDE cannot connect to Kimi Code CLI**
```bash
kimi --version              # confirm CLI installed
~/.local/bin/kimi acp       # use absolute path if needed
cat ~/.kimi/logs/kimi.log   # check logs
```

### MCP Issues

**MCP server startup fails**
```bash
kimi mcp list                    # view configured servers
kimi mcp test <server-name>      # test server
```
Common causes: command not in PATH, invalid JSON in `~/.kimi/mcp.json`

**OAuth authorization fails**
```bash
kimi mcp auth <server-name>              # re-authorize
kimi mcp reset-auth <server-name>        # reset if corrupted
```

**Header format error**
```bash
# Correct (space after colon)
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: your-key"

# Wrong (no space or equals sign)
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY=your-key"
```

### Print / Wire Mode Issues

**Invalid JSONL input** — each line must be complete JSON, UTF-8, `\n` line endings (not `\r\n`)

```json
{"role": "user", "content": "Hello"}
```

**No output in print mode**
```bash
kimi --print --prompt "Hello"               # provide input via --prompt
kimi --print --output-format stream-json    # use streaming output
```

### Updates

**Upgrade Kimi Code CLI**
```bash
uv tool upgrade kimi-cli --no-cache    # --no-cache ensures latest version
```

**Disable update reminders**
```bash
export KIMI_CLI_NO_AUTO_UPDATE=1    # add to ~/.zshrc or ~/.bashrc
```

**macOS slow first run** — Gatekeeper security check on first launch, subsequent runs normal.
Add terminal app to: System Settings → Privacy & Security → Developer Tools

### VS Code Extension

| Problem | Fix |
|---|---|
| No workspace open error | Open a folder in VS Code |
| CLI not found | Install CLI manually, set `kimi.executablePath` in VS Code settings |
| Login fails | Try API key mode instead of OAuth |
| No response to messages | Confirm CLI available, model configured, workspace folder open; check "Kimi Code: Show Logs" |
| Connection timeout (30s) | Check network connection, retry |

**Contact:** code@moonshot.ai
