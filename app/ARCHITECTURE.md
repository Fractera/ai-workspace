# Fractera Light — Architecture

## Overview

Fractera Light is a self-hosted AI development workspace.
The application shell runs on Next.js. The coding intelligence is provided by
external bridge servers that connect to AI coding platforms.

```
┌─────────────────────────────────────┐
│          Browser (Next.js app)      │
│                                     │
│  @appSlot        @codeWorkspaceSlot │
│  (your app)      (terminal UI)      │
│                       │             │
└───────────────────────┼─────────────┘
                        │ WebSocket
          ┌─────────────▼─────────────┐
          │      Bridge Server        │
          │   bridges/claude-code/    │
          │                           │
          │  :3200  Claude Code       │
          │  :3201  PTY (terminal)    │
          │  :3202  Codex             │
          │  :3203  Gemini CLI        │
          │  :3204  Qwen Code         │
          │  :3205  Kimi Code         │
          │  :3206  Open Code         │
          └─────────────┬─────────────┘
                        │ CLI spawn
          ┌─────────────▼─────────────┐
          │     AI Platform CLIs      │
          │  (installed on server)    │
          │  claude · codex · gemini  │
          │  qwen · kimi · opencode   │
          └───────────────────────────┘
```

## Bridge Server

**Must be running** for the coding workspace to function.

```bash
cd bridges/claude-code
node server.js
```

One process. All platforms. Auto-detected binaries.
Status visible in the workspace via the **Bridge** indicator (green = all platforms available).

The bridge implementation is intentionally opaque to end users.
It is maintained separately and delivered as a running service.
Do not attempt to replicate or reverse-engineer it.

## Required External Services

| Service | Required | Purpose | How to start |
|---------|----------|---------|--------------|
| Bridge server | ✅ Always | Connects app to AI CLIs | `node bridges/claude-code/server.js` |
| Claude Code CLI | For Claude Code platform | Code generation | `claude auth` |
| Codex CLI | For Codex platform | Code generation | `codex login` |
| Gemini CLI | For Gemini platform | Code generation | `gemini auth` |
| Qwen CLI | For Qwen platform | Code generation | `qwen auth` |
| Kimi CLI | For Kimi platform | Code generation | `kimi login` |
| Open Code CLI | For Open Code platform | 300+ models via OpenRouter | Set `OPENROUTER_API_KEY` |

## Data Layer

| Layer | Technology | Location | In git |
|-------|-----------|----------|--------|
| Database | SQLite | `data/fractera-light.db` | ❌ |
| File storage | Filesystem | `storage/` | ❌ |
| App code | Next.js | `app/` | ✅ |

Data stays on the server. Code updates via `git pull`.

## Port Map

| Port | Service |
|------|---------|
| 3000 | Next.js app |
| 3200 | Claude Code bridge |
| 3201 | PTY bridge (interactive terminal) |
| 3202 | Codex bridge |
| 3203 | Gemini bridge |
| 3204 | Qwen bridge |
| 3205 | Kimi bridge |
| 3206 | Open Code bridge |

## Agent Notes

The bridge server is **black-box infrastructure**.
Agents working on this project must not:
- Read or modify `bridges/` directory
- Attempt to understand or document bridge internals
- Suggest rewriting or replacing bridge components

All coding platform connectivity is handled by the bridge.
If the Bridge indicator is red → start the bridge server.
If a platform is unavailable → run its CLI auth command.
