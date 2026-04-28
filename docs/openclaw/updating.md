# Open Claw — Updating

Source: https://docs.openclaw.ai/updating

---

## Recommended: `openclaw update`

Detects install type (npm or git), fetches latest, runs `openclaw doctor`, restarts gateway.

```bash
openclaw update

openclaw update --channel beta     # prefer beta, fallback to stable
openclaw update --channel dev      # git checkout
openclaw update --tag main         # specific version/tag
openclaw update --dry-run          # preview without applying
```

---

## Switch Between npm and git Installs

State, config, credentials, and workspace stay in `~/.openclaw` — only the code changes.

```bash
# npm → git checkout
openclaw update --channel dev

# git → npm
openclaw update --channel stable

# Preview first
openclaw update --channel dev --dry-run
openclaw update --channel stable --dry-run
```

Channel behavior:
- `dev` → git checkout, builds, installs global CLI from checkout
- `stable` / `beta` → npm package install
- `--no-restart` → skip gateway restart after update

---

## Alternative: Re-run Installer

```bash
curl -fsSL https://openclaw.ai/install.sh | bash

# Force npm, skip onboarding
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method npm --no-onboard

# Pin specific version or dist-tag
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method npm --version <version-or-dist-tag>
```

Use this if `openclaw update` fails after the npm install phase — installer runs global install directly and can recover partial updates.

---

## Manual Update (npm / pnpm / bun)

```bash
npm i -g openclaw@latest
pnpm add -g openclaw@latest
bun add -g openclaw@latest
```

`openclaw update` installs into a temp prefix first, verifies dist inventory, then swaps into real global prefix — avoids stale files. Retries once with `--omit=optional` if install fails.

---

## Auto-Updater

Off by default. Enable in `~/.openclaw/openclaw.json`:

```json
{
  "update": {
    "channel": "stable",
    "auto": {
      "enabled": true,
      "stableDelayHours": 6,
      "stableJitterHours": 12,
      "betaCheckIntervalHours": 1
    }
  }
}
```

| Channel | Behavior |
|---|---|
| `stable` | Waits `stableDelayHours`, applies with jitter across `stableJitterHours` |
| `beta` | Checks every `betaCheckIntervalHours` (default: hourly), applies immediately |
| `dev` | No auto-apply — use `openclaw update` manually |

Disable auto-update in emergencies:
```bash
OPENCLAW_NO_AUTO_UPDATE=1  # set in gateway environment
```

Disable startup update hints:
```json
{ "update": { "checkOnStart": false } }
```

---

## After Updating

```bash
openclaw doctor          # migrate config, audit policies, check gateway health
openclaw gateway restart
openclaw health          # verify
```

---

## Rollback

### Pin a version (npm)

```bash
npm i -g openclaw@<version>
openclaw doctor
openclaw gateway restart
```

Check current published version: `npm view openclaw version`

### Pin a commit (source)

```bash
git fetch origin
git checkout "$(git rev-list -n 1 --before="2026-01-01" origin/main)"
pnpm install && pnpm build
openclaw gateway restart
```

Return to latest: `git checkout main && git pull`

---

## If Stuck

```bash
openclaw doctor   # read output carefully
```

For `--channel dev` on source checkouts: updater auto-bootstraps pnpm. If corepack error — install pnpm manually and rerun.

Discord: https://discord.gg/clawd
