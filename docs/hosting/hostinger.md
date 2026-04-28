# Hosting — Hostinger

Source: https://docs.openclaw.ai/hosting/hostinger
Applies to: OpenClaw. Fractera can use the VPS option.

---

## Option A: 1-Click Managed OpenClaw

Fastest path — Hostinger handles infrastructure, Docker, and auto-updates.

1. From Hostinger OpenClaw page — choose Managed OpenClaw plan and checkout
2. Select messaging channel: WhatsApp (QR code) or Telegram (bot token)
3. Click Finish — access dashboard from OpenClaw Overview in hPanel

Optional: select Ready-to-Use AI credits during checkout — no external API keys needed.

---

## Option B: OpenClaw on VPS

More control — OpenClaw deployed via Docker, managed through Docker Manager in hPanel.

1. Choose OpenClaw on VPS plan and checkout
2. Configure:
   - Gateway token — auto-generated, save it
   - WhatsApp number with country code (optional)
   - Telegram bot token from BotFather (optional)
   - API keys (if not using Ready-to-Use AI credits)
3. Click Deploy → open dashboard via hPanel → Open

Updates: press Update in Docker Manager → pulls latest image.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Dashboard not loading | Wait a few minutes for container to finish provisioning; check Docker Manager logs |
| Container keeps restarting | Check Docker Manager logs for missing tokens or invalid API keys |
| Telegram not responding | Send pairing code message directly in OpenClaw chat |

---

## Fractera Notes

- Option B (VPS) is the relevant path for Fractera
- Hostinger VPS starts at ~$4–5/mo — comparable to Hetzner
- Use standard Linux VPS setup: Node 20+, PM2, Nginx (see Fractera README)
- Hostinger hPanel Docker Manager is an alternative to PM2 for process management
