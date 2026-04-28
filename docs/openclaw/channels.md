# Open Claw — Chat Channels

Source: https://docs.openclaw.ai/channels

OpenClaw connects to any chat app you already use via the Gateway. Text supported everywhere; media and reactions vary by channel.

---

## Delivery Notes

- **Telegram** — markdown image syntax `![alt](url)` converted into media replies on outbound path when possible
- **Slack** — multi-person DMs (MPIM) route as group chats — group policy, mention behavior, and group-session rules apply
- **WhatsApp** — install-on-demand: onboarding shows setup flow before Baileys runtime deps are staged; Gateway loads WhatsApp runtime only when channel is active

---

## Supported Channels

| Channel | Notes |
|---|---|
| **WhatsApp** | Most popular; uses Baileys, requires QR pairing |
| **Telegram** | Bot API via grammY; supports groups |
| **Discord** | Discord Bot API + Gateway; servers, channels, DMs |
| **Slack** | Bolt SDK; workspace apps |
| **Signal** | signal-cli; privacy-focused |
| **Google Chat** | Google Chat API app via HTTP webhook |
| **Microsoft Teams** | Bot Framework; enterprise support (bundled plugin) |
| **iMessage / BlueBubbles** | Recommended for iMessage; uses BlueBubbles macOS server REST API (bundled plugin); edit, unsend, effects, reactions, group management — edit broken on macOS 26 Tahoe |
| **iMessage (legacy)** | Legacy via imsg CLI — deprecated, use BlueBubbles for new setups |
| **IRC** | Classic IRC servers; channels + DMs with pairing/allowlist controls |
| **Matrix** | Matrix protocol (bundled plugin) |
| **Mattermost** | Bot API + WebSocket; channels, groups, DMs (bundled plugin) |
| **Nextcloud Talk** | Self-hosted chat via Nextcloud Talk (bundled plugin) |
| **LINE** | LINE Messaging API bot (bundled plugin) |
| **Feishu** | Feishu/Lark bot via WebSocket (bundled plugin) |
| **Nostr** | Decentralized DMs via NIP-04 (bundled plugin) |
| **Synology Chat** | Synology NAS Chat via outgoing+incoming webhooks (bundled plugin) |
| **Tlon** | Urbit-based messenger (bundled plugin) |
| **Twitch** | Twitch chat via IRC connection (bundled plugin) |
| **QQ Bot** | QQ Bot API; private chat, group chat, rich media (bundled plugin) |
| **WeChat** | Tencent iLink Bot via QR login; private chats only (external plugin) |
| **Zalo** | Zalo Bot API; Vietnam's popular messenger (bundled plugin) |
| **Zalo Personal** | Zalo personal account via QR login (bundled plugin) |
| **WebChat** | Gateway WebChat UI over WebSocket |
| **Voice Call** | Telephony via Plivo or Twilio (plugin, installed separately) |
| **Yuanbao** | Tencent Yuanbao bot (external plugin) |

---

## Fractera Notes

- Fractera does not currently implement chat channel integrations — this is an OpenClaw v1.4 feature area
- When Open Claw is integrated (Fractera v1.4), these channels become available to Fractera users via the OpenClaw gateway
- Most relevant for Fractera users: Telegram (bot token setup) and Discord (bot token) — simplest to configure
