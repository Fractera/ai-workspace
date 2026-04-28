# Kimi Code CLI

Source: https://moonshotai.github.io/kimi-cli + AGENTS.md from https://github.com/MoonshotAI/kimi-code

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

## Common Issues

| Problem | Fix |
|---|---|
| `kimi: command not found` | Add install path to `$PATH`; re-source `~/.bashrc` or `~/.zshrc` |
| Auth fails | Run `kimi /login` and follow OAuth flow |
| Python version error | Requires Python 3.12+; check with `python3 --version` |
| MCP tool not loading | Check `~/.kimi/` for MCP config; run `kimi --help` to verify tool registration |
