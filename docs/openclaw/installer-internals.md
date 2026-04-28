# Open Claw — Installer Internals

Source: https://docs.openclaw.ai/installer-internals

---

## Three Installer Scripts

| Script | Platform | What it does |
|---|---|---|
| `install.sh` | macOS / Linux / WSL | Installs Node if needed, installs OpenClaw via npm (default) or git, runs onboarding |
| `install-cli.sh` | macOS / Linux / WSL | Installs Node + OpenClaw into local prefix (`~/.openclaw`), no root required |
| `install.ps1` | Windows PowerShell | Installs Node if needed, installs OpenClaw via npm or git, runs onboarding |

---

## install.sh (recommended for macOS/Linux/WSL)

```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --help
```

### Flow

1. **Detect OS** — macOS and Linux (incl. WSL). Installs Homebrew if missing on macOS.
2. **Ensure Node 24** — checks version, installs via Homebrew (macOS) or NodeSource (Linux apt/dnf/yum). Node 22.14+ also supported.
3. **Ensure Git** — installs if missing.
4. **Install OpenClaw**
   - npm (default): global npm install
   - git: clone/update repo, install deps with pnpm, build, install wrapper at `~/.local/bin/openclaw`
5. **Post-install**
   - Refreshes gateway service (`openclaw gateway install --force` + restart)
   - Runs `openclaw doctor --non-interactive` on upgrades and git installs
   - Runs onboarding if TTY available and not disabled
   - Sets `SHARP_IGNORE_GLOBAL_LIBVIPS=1`

### Source checkout detection

If run inside an OpenClaw checkout (`package.json` + `pnpm-workspace.yaml`):
- Offers: use checkout (git) or use global install (npm)
- No TTY → defaults to npm with warning
- Exits code 2 for invalid method selection

### Examples

```bash
# Default
curl -fsSL https://openclaw.ai/install.sh | bash

# Skip onboarding
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard

# Git install
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git

# GitHub main via npm
npm install -g github:openclaw/openclaw#main

# Non-interactive (CI)
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-prompt --no-onboard
```

---

## install-cli.sh (local prefix, no root)

Everything under `~/.openclaw`, no system Node dependency.

### Flow

1. **Install local Node** — downloads pinned Node LTS tarball to `<prefix>/tools/node-v<version>`, verifies SHA-256
2. **Ensure Git** — apt/dnf/yum on Linux, Homebrew on macOS
3. **Install OpenClaw under prefix**
   - npm: installs under prefix, writes wrapper to `<prefix>/bin/openclaw`
   - git: clones/updates checkout, still writes wrapper to `<prefix>/bin/openclaw`
4. **Refresh gateway** — if already loaded, runs `openclaw gateway install --force` + restart

### Examples

```bash
# Default
curl -fsSL https://openclaw.ai/install-cli.sh | bash

# Custom prefix + version
# (see flags reference on official docs)

# Git install
curl -fsSL https://openclaw.ai/install-cli.sh | bash -s -- --install-method git

# Automation JSON output
# (see flags reference on official docs)
```

---

## install.ps1 (Windows PowerShell 5+)

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### Flow

1. **Ensure PowerShell 5+**
2. **Ensure Node 24** — tries winget, then Chocolatey, then Scoop. Node 22.14+ also supported.
3. **Install OpenClaw**
   - npm (default): global npm install
   - git: clone/update, build with pnpm, wrapper at `%USERPROFILE%\.local\bin\openclaw.cmd`
4. **Post-install**
   - Adds bin directory to user PATH
   - Refreshes gateway service
   - Runs `openclaw doctor --non-interactive`
5. **Failure handling** — `iwr | iex` reports terminating error without closing session

### Examples

```powershell
# Default
iwr -useb https://openclaw.ai/install.ps1 | iex

# Git install
iwr -useb https://openclaw.ai/install.ps1 | iex -InstallMethod git

# Skip onboarding
iwr -useb https://openclaw.ai/install.ps1 | iex -NoOnboard
```

---

## CI / Automation

```bash
# install.sh non-interactive npm
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-prompt --no-onboard

# install.sh non-interactive git
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-prompt --no-onboard --install-method git
```

---

## Troubleshooting

- `openclaw not found` → check `npm prefix -g`, add to `$PATH`
- `EACCES on Linux` → npm permissions issue, use `install-cli.sh` (no root)
- `sharp/libvips` → `SHARP_IGNORE_GLOBAL_LIBVIPS=1` (set automatically by installer)
- Windows: `npm error spawn git / ENOENT` → install Git for Windows
- Windows: `openclaw is not recognized` → restart terminal, check PATH
- Git missing with `--install-method git` on Windows → installer exits, prints Git for Windows link
