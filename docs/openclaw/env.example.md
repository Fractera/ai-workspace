# Open Claw — .env Reference

Source: Official OpenClaw .env example

Locations:
- Local runs: `.env` in repo root
- Daemon (launchd/systemd): `~/.openclaw/.env`

Precedence (highest → lowest): process env → `./.env` → `~/.openclaw/.env` → `openclaw.json` env block

---

## Gateway Auth + Paths

```env
# Required if gateway binds beyond loopback.
# Leave blank to auto-generate on first start.
# Generate: openssl rand -hex 32
# WARNING: never paste example values from docs verbatim — gateway will refuse to start.
OPENCLAW_GATEWAY_TOKEN=

# Alternative auth mode (use token OR password, not both)
# OPENCLAW_GATEWAY_PASSWORD=

# Path overrides (defaults shown)
# OPENCLAW_STATE_DIR=~/.openclaw
# OPENCLAW_CONFIG_PATH=~/.openclaw/openclaw.json
# OPENCLAW_HOME=~

# Import missing keys from login shell profile
# OPENCLAW_LOAD_SHELL_ENV=1
# OPENCLAW_SHELL_ENV_TIMEOUT_MS=15000
```

---

## Model Provider API Keys (set at least one)

```env
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GEMINI_API_KEY=...
# OPENROUTER_API_KEY=sk-or-...

# Live/named keys
# OPENCLAW_LIVE_OPENAI_KEY=sk-...
# OPENCLAW_LIVE_ANTHROPIC_KEY=sk-ant-...
# OPENCLAW_LIVE_GEMINI_KEY=...

# Indexed keys (multiple accounts)
# OPENAI_API_KEY_1=...
# ANTHROPIC_API_KEY_1=...
# GEMINI_API_KEY_1=...

# Comma-separated key pools
# OPENAI_API_KEYS=sk-1,sk-2
# ANTHROPIC_API_KEYS=sk-ant-1,sk-ant-2
# GEMINI_API_KEYS=key-1,key-2

# Google alias
# GOOGLE_API_KEY=...

# Additional providers
# ZAI_API_KEY=...
# AI_GATEWAY_API_KEY=...
# TOKENHUB_API_KEY=...
# LKEAP_API_KEY=...
# MINIMAX_API_KEY=...
# SYNTHETIC_API_KEY=...
```

---

## Channels (set only what you enable)

```env
# TELEGRAM_BOT_TOKEN=123456:ABCDEF...
# DISCORD_BOT_TOKEN=...
# SLACK_BOT_TOKEN=xoxb-...
# SLACK_APP_TOKEN=xapp-...
# MATTERMOST_BOT_TOKEN=...
# MATTERMOST_URL=https://chat.example.com
# ZALO_BOT_TOKEN=...
# OPENCLAW_TWITCH_ACCESS_TOKEN=oauth:...
```

---

## Tools + Voice / Media (optional)

```env
# BRAVE_API_KEY=...
# PERPLEXITY_API_KEY=pplx-...
# FIRECRAWL_API_KEY=...

# ELEVENLABS_API_KEY=...
# XI_API_KEY=...         # alias for ElevenLabs
# INWORLD_API_KEY=...
# DEEPGRAM_API_KEY=...
```

---

## Fractera Integration Notes

- `ANTHROPIC_API_KEY` — same key users already use for Claude Code in Fractera
- `OPENROUTER_API_KEY` — same key used for Open Code platform in Fractera
- `OPENCLAW_GATEWAY_TOKEN` — will need to be stored in Fractera `.env.local` for API calls
- Gateway port: **18789**
- Planned for: Fractera **v1.4**
