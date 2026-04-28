# Open Claw — Uninstall

Source: https://docs.openclaw.ai/uninstall

---

## Easy Path (CLI still installed)

```bash
openclaw uninstall

# Non-interactive (automation / npx)
openclaw uninstall --all --yes --non-interactive
npx -y openclaw uninstall --all --yes --non-interactive
```

### Manual steps (same result)

```bash
# 1. Stop gateway service
openclaw gateway stop

# 2. Uninstall gateway service (launchd/systemd/schtasks)
openclaw gateway uninstall

# 3. Delete state + config
rm -rf "${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"

# 4. Delete workspace (optional — removes agent files)
rm -rf ~/.openclaw/workspace

# 5. Remove CLI (pick the one you used)
npm rm -g openclaw
pnpm remove -g openclaw
bun remove -g openclaw

# 6. macOS app (if installed)
rm -rf /Applications/OpenClaw.app
```

Notes:
- If you used profiles (`--profile` / `OPENCLAW_PROFILE`): repeat step 3 for each state dir (`~/.openclaw-<profile>`)
- Remote mode: state dir lives on the gateway host — run steps 1–4 there too

---

## Manual Service Removal (CLI not installed)

Use when gateway keeps running but `openclaw` is missing.

### macOS (launchd)

Default label: `ai.openclaw.gateway` (or `ai.openclaw.<profile>`; legacy `com.openclaw.*` may exist)

```bash
launchctl bootout gui/$UID/ai.openclaw.gateway
rm -f ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

Remove legacy plists if present: `~/Library/LaunchAgents/com.openclaw.*.plist`

### Linux (systemd user unit)

Default unit: `openclaw-gateway.service` (or `openclaw-gateway-<profile>.service`)

```bash
systemctl --user disable --now openclaw-gateway.service
rm -f ~/.config/systemd/user/openclaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task: `OpenClaw Gateway` (or `OpenClaw Gateway (<profile>)`)

```powershell
schtasks /Delete /F /TN "OpenClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.openclaw\gateway.cmd"
```

---

## Normal Install vs Source Checkout

### Normal install (install.sh / npm / pnpm / bun)

```bash
npm rm -g openclaw
# or: pnpm remove -g openclaw
# or: bun remove -g openclaw
```

### Source checkout (git clone)

1. Uninstall gateway service first (easy path or manual service removal above)
2. Delete the repo directory
3. Remove state + workspace as shown above
