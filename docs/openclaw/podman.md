# Open Claw — Podman (Rootless)

Source: https://docs.openclaw.ai/containers/podman

Model: Podman runs gateway container → host `openclaw` CLI is the control plane → persistent state on host under `~/.openclaw`.

---

## Prerequisites

- Podman in rootless mode
- OpenClaw CLI installed on the host
- Optional: `systemd --user` for Quadlet-managed auto-start
- Optional: `sudo` for `loginctl enable-linger` (boot persistence on headless host)

---

## Quick Start

```bash
# 1. One-time setup
./scripts/podman/setup.sh

# 2. Start gateway container
./scripts/run-openclaw-podman.sh launch

# 3. Onboarding
./scripts/run-openclaw-podman.sh launch setup
# Open http://127.0.0.1:18789/

# 4. Manage from host CLI
export OPENCLAW_CONTAINER=openclaw
openclaw dashboard --no-open
openclaw gateway status --deep
openclaw doctor
openclaw channels login
```

---

## Setup Details

`./scripts/podman/setup.sh`:
- Builds `openclaw:local` in rootless Podman store (or uses `OPENCLAW_IMAGE`)
- Creates `~/.openclaw/openclaw.json` with `gateway.mode: "local"` if missing
- Creates `~/.openclaw/.env` with `OPENCLAW_GATEWAY_TOKEN` if missing

### Quadlet (Linux systemd, optional)

```bash
./scripts/podman/setup.sh --quadlet
# or: OPENCLAW_PODMAN_QUADLET=1 ./scripts/podman/setup.sh
```

---

## Systemd Quadlet Commands

Quadlet file: `~/.config/containers/systemd/openclaw.container`

```bash
systemctl --user start openclaw.service
systemctl --user stop openclaw.service
systemctl --user status openclaw.service
journalctl --user -u openclaw.service -f

# After editing Quadlet file
systemctl --user daemon-reload
systemctl --user restart openclaw.service

# Boot persistence on headless/SSH hosts
sudo loginctl enable-linger "$(whoami)"
```

---

## Config, Env, and Storage

| Path | Purpose |
|---|---|
| `~/.openclaw` | Config dir |
| `~/.openclaw/workspace` | Workspace dir |
| `~/.openclaw/.env` | Token file |

Container bind-mounts:
- `OPENCLAW_CONFIG_DIR` → `/home/node/.openclaw`
- `OPENCLAW_WORKSPACE_DIR` → `/home/node/.openclaw/workspace`

State survives container replacement: `openclaw.json`, auth profiles, channel state, sessions, workspace.

---

## Useful Env Vars

| Variable | Default | Purpose |
|---|---|---|
| `OPENCLAW_PODMAN_CONTAINER` | `openclaw` | Container name |
| `OPENCLAW_PODMAN_IMAGE` / `OPENCLAW_IMAGE` | — | Image to run |
| `OPENCLAW_PODMAN_GATEWAY_HOST_PORT` | — | Host port → container 18789 |
| `OPENCLAW_PODMAN_BRIDGE_HOST_PORT` | — | Host port → container 18790 |
| `OPENCLAW_PODMAN_PUBLISH_HOST` | `127.0.0.1` | Host interface for published ports |
| `OPENCLAW_GATEWAY_BIND` | `lan` | Gateway bind mode inside container |
| `OPENCLAW_PODMAN_USERNS` | `keep-id` | `keep-id` / `auto` / `host` |

---

## Podman + Tailscale

- Keep Podman publish host at `127.0.0.1`
- Prefer host-managed `tailscale serve` over `openclaw gateway --tailscale serve`
- On macOS with local browser device-auth issues → use Tailscale access

---

## Useful Commands

```bash
podman logs -f openclaw                    # Container logs
podman stop openclaw                       # Stop container
podman rm -f openclaw                      # Remove container
openclaw dashboard --no-open               # Dashboard URL from host CLI
openclaw gateway status --deep             # Health + service scan
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `EACCES` on config/workspace | Ensure host paths owned by current user (container runs with `--userns=keep-id --user <uid>:<gid>`) |
| Gateway blocked (missing `gateway.mode=local`) | Ensure `~/.openclaw/openclaw.json` has `gateway.mode="local"` — setup.sh creates it if missing |
| CLI commands hit wrong target | Use `openclaw --container <name>` or `export OPENCLAW_CONTAINER=<name>` |
| `openclaw update` fails with `--container` | Expected — rebuild/pull image, restart container or Quadlet service |
| Quadlet service won't start | `systemctl --user daemon-reload` → start; on headless: `sudo loginctl enable-linger "$(whoami)"` |
| SELinux blocks bind mounts | Launcher auto-adds `:Z` on Linux when SELinux is enforcing/permissive |
