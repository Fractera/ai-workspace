# Open Claw — ClawDock

Source: https://docs.openclaw.ai/containers/clawdock
Shell-helper layer for Docker-based OpenClaw installs. Short commands instead of `docker compose ...` invocations.

---

## Install

```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/clawdock/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
echo 'source ~/.clawdock/clawdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```

Note: old path `scripts/shell-helpers/clawdock-helpers.sh` was removed — use `scripts/clawdock/clawdock-helpers.sh`.

---

## Commands

### Basic Operations

| Command | Description |
|---|---|
| `clawdock-start` | Start the gateway |
| `clawdock-stop` | Stop the gateway |
| `clawdock-restart` | Restart the gateway |
| `clawdock-status` | Check container status |
| `clawdock-logs` | Follow gateway logs |

### Container Access

| Command | Description |
|---|---|
| `clawdock-shell` | Open shell inside the gateway container |
| `clawdock-cli <command>` | Run OpenClaw CLI commands in Docker |
| `clawdock-exec <command>` | Execute arbitrary command in the container |

### Web UI and Pairing

| Command | Description |
|---|---|
| `clawdock-dashboard` | Open the Control UI URL |
| `clawdock-devices` | List pending device pairings |
| `clawdock-approve <id>` | Approve a pairing request |

### Setup and Maintenance

| Command | Description |
|---|---|
| `clawdock-fix-token` | Configure gateway token inside the container |
| `clawdock-update` | Pull, rebuild, and restart |
| `clawdock-rebuild` | Rebuild the Docker image only |
| `clawdock-clean` | Remove containers and volumes |

### Utilities

| Command | Description |
|---|---|
| `clawdock-health` | Run gateway health check |
| `clawdock-token` | Print the gateway token |
| `clawdock-cd` | Jump to OpenClaw project directory |
| `clawdock-config` | Open `~/.openclaw` |
| `clawdock-show-config` | Print config files with redacted values |
| `clawdock-workspace` | Open the workspace directory |

---

## First-Time Flow

```bash
clawdock-start
clawdock-fix-token
clawdock-dashboard

# If browser says pairing required:
clawdock-devices
clawdock-approve <request-id>
```

---

## Config and Secrets

| File | Purpose |
|---|---|
| `<project>/.env` | Docker-specific: image name, ports, gateway token |
| `~/.openclaw/.env` | Env-backed provider keys and bot tokens |
| `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` | Stored provider OAuth/API-key auth |
| `~/.openclaw/openclaw.json` | Behavior config |

```bash
clawdock-show-config  # inspect .env files and openclaw.json with redacted values
```
