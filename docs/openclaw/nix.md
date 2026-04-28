# Open Claw — Nix

Source: https://docs.openclaw.ai/containers/nix
Repo: https://github.com/openclaw/nix-openclaw (source of truth)
Declarative install via Home Manager module.

---

## What You Get

- Gateway + macOS app + tools (whisper, spotify, cameras) — all pinned
- Launchd service that survives reboots
- Plugin system with declarative config
- Instant rollback: `home-manager switch --rollback`

---

## Quick Start

### Step 1 — Install Determinate Nix

Follow: https://determinate.systems/posts/determinate-nix-installer

### Step 2 — Create Local Flake

```bash
mkdir -p ~/code/openclaw-local
# Copy templates/agent-first/flake.nix from the nix-openclaw repo
```

### Step 3 — Configure Secrets

Set up messaging bot token and model provider API key. Plain files at `~/.secrets/` work fine.

### Step 4 — Switch

```bash
home-manager switch
```

### Step 5 — Verify

Confirm launchd service is running and bot responds to messages.

---

## Nix-Mode Runtime Behavior

`OPENCLAW_NIX_MODE=1` (set automatically by nix-openclaw) — enters deterministic mode, disables auto-install flows.

Manual set:
```bash
export OPENCLAW_NIX_MODE=1
```

macOS GUI app (doesn't inherit shell env vars):
```bash
defaults write ai.openclaw.mac openclaw.nixMode -bool true
```

### What Changes in Nix Mode

- Auto-install and self-mutation flows disabled
- Missing dependencies surface Nix-specific remediation messages
- UI shows read-only Nix mode banner

---

## Config and State Paths

| Variable | Default |
|---|---|
| `OPENCLAW_HOME` | `HOME` / `USERPROFILE` / `os.homedir()` |
| `OPENCLAW_STATE_DIR` | `~/.openclaw` |
| `OPENCLAW_CONFIG_PATH` | `$OPENCLAW_STATE_DIR/openclaw.json` |

Set these explicitly under Nix to keep runtime state out of the immutable store.

---

## Service PATH Discovery

Launchd/systemd gateway auto-discovers Nix-profile binaries:

- `NIX_PROFILES` set → every entry added to service PATH (right-to-left precedence)
- `NIX_PROFILES` unset → `~/.nix-profile/bin` added as fallback

Applies to both macOS launchd and Linux systemd.
