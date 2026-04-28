# Open Claw — README (GitHub)

Source: https://github.com/openclaw/openclaw

---

## What is OpenClaw

Personal AI assistant you run on your own devices. Answers on channels you already use. Can speak and listen on macOS/iOS/Android. Renders a live Canvas. The Gateway is the control plane — the product is the assistant.

---

## Supported Channels

WhatsApp · Telegram · Slack · Discord · Google Chat · Signal · iMessage · BlueBubbles · IRC · Microsoft Teams · Matrix · Feishu · LINE · Mattermost · Nextcloud Talk · Nostr · Synology Chat · Tlon · Twitch · Zalo · Zalo Personal · WeChat · QQ · WebChat

---

## Install (Recommended)

Runtime: Node 24 (recommended) or Node 22.14+

```bash
npm install -g openclaw@latest
# or
pnpm add -g openclaw@latest

openclaw onboard --install-daemon
```

Onboard installs the Gateway daemon (launchd/systemd user service) so it stays running.

---

## Quick Start

```bash
openclaw onboard --install-daemon

openclaw gateway --port 18789 --verbose

# Send a message
openclaw message send --target +1234567890 --message "Hello from OpenClaw"

# Talk to the assistant
openclaw agent --message "Ship checklist" --thinking high
```

---

## Gateway Port

**18789** (default)

---

## Security Defaults (DM Access)

OpenClaw connects to real messaging surfaces. Treat inbound DMs as untrusted input.

Default behavior on Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack:

- `dmPolicy="pairing"` — unknown senders receive a pairing code, message not processed
- Approve: `openclaw pairing approve <channel> <code>`
- Public inbound DMs: set `dmPolicy="open"` + include `"*"` in allowlist (`allowFrom`)
- Run `openclaw doctor` to surface risky/misconfigured DM policies

---

## Highlights

- **Local-first Gateway** — single control plane for sessions, channels, tools, events
- **Multi-channel inbox** — 20+ channels
- **Multi-agent routing** — route channels/accounts/peers to isolated agents
- **Voice Wake + Talk Mode** — wake words on macOS/iOS, continuous voice on Android
- **Live Canvas** — agent-driven visual workspace with A2UI
- **First-class tools** — browser, canvas, nodes, cron, sessions, Discord/Slack actions
- **Companion apps** — macOS menu bar + iOS/Android nodes
- **Skills** — onboarding-driven setup with bundled/managed/workspace skills

---

## Security Model

- Default: tools run on host for main session (full access when just you)
- Group/channel safety: `agents.defaults.sandbox.mode: "non-main"` — non-main sessions run in sandboxes
- Default sandbox backend: Docker (SSH and OpenShell also available)
- Typical sandbox: allow bash/process/read/write/edit/sessions; deny browser/canvas/nodes/cron/discord/gateway

---

## Operator Chat Commands

```
/status  /new  /reset  /compact  /think <level>
/verbose on|off  /trace on|off  /usage off|tokens|full
/restart  /activation mention|always
```

Session tools: `sessions_list` · `sessions_history` · `sessions_send`
Skills registry: ClawHub

---

## Configuration

Minimal `~/.openclaw/openclaw.json`:

```json
{
  "agent": {
    "model": "<provider>/<model-id>"
  }
}
```

---

## Agent Workspace & Skills

- Workspace root: `~/.openclaw/workspace` (configurable via `agents.defaults.workspace`)
- Injected prompt files: `AGENTS.md` · `SOUL.md` · `TOOLS.md`
- Skills: `~/.openclaw/workspace/skills/<skill>/SKILL.md`

---

## Development Channels

| Channel | Tag | npm dist-tag |
|---|---|---|
| `stable` | `vYYYY.M.D` | `latest` |
| `beta` | `vYYYY.M.D-beta.N` | `beta` |
| `dev` | moving head of main | `dev` |

Switch: `openclaw update --channel stable|beta|dev`

---

## From Source

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install

# First run only
pnpm openclaw setup

# Optional: prebuild Control UI
pnpm ui:build

# Dev loop (auto-reload)
pnpm gateway:watch

# Full build
pnpm build && pnpm ui:build
```

Note: `pnpm openclaw ...` runs TypeScript directly via tsx. `pnpm build` produces `dist/` for Node/packaged binary.

---

## Companion Apps (optional)

**macOS (OpenClaw.app)** — menu bar, Voice Wake, WebChat, remote gateway control via SSH

**iOS node** — pairs via Gateway WebSocket; voice + Canvas; `openclaw nodes ...`

**Android node** — pairs via device pairing (`openclaw devices ...`); Connect/Chat/Voice tabs, Camera, Screen capture

---

## Sponsors

OpenAI · GitHub · NVIDIA · Vercel · Blacksmith · Convex

---

## Fractera Integration Notes

- Gateway port: **18789** — no conflict with Fractera stack
- `openclaw onboard --install-daemon` sets up persistent daemon — same pattern as Fractera services
- Skills system (`~/.openclaw/workspace/skills/`) — potential integration point with Fractera Skills Marketplace
- Multi-agent routing could complement Fractera's parallel terminal architecture
- Planned for: Fractera **v1.4**
