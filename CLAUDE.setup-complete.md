# Fractera Setup Complete

**Date:** 2026-04-29T21:20:00Z

## Platform Installation Report

| Platform | Version | Status | Notes |
|---|---|---|---|
| Claude Code | (running) | ✅ Ready | Already installed and authenticated |
| Codex CLI | 0.125.0 | ✅ Ready | Run `codex login` to authenticate |
| Gemini CLI | 0.40.0 | ✅ Ready | Run `gemini` for browser auth on first run |
| Qwen Code | 0.15.5 | ✅ Ready | Run `qwen auth` to authenticate |
| Kimi Code | 1.40.0 | ✅ Ready | Run `kimi` then `/login` to authenticate |
| OpenCode | 1.14.29 | ✅ Ready | Run `opencode` then `/connect` to authenticate |
| Company Brain (LightRAG) | — | ⏳ Pending v1.3 | Not yet available |
| Open Claw | — | ⏳ Pending v1.4 | Not yet available |

## Issues Encountered

- npm cache had root-owned files — fixed with `sudo chown -R 501:20 ~/.npm`
- Dev server must be started from the `app/` directory

## Startup Command

```bash
cd app && npm run dev
```

App runs at http://localhost:3000
