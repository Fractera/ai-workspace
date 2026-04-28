# Open Claw — Node.js Requirements

Source: https://docs.openclaw.ai/nodejs

---

## Version Requirements

- **Node 24** — default, recommended for all installs, CI, and release workflows
- **Node 22.14+** — supported (active LTS), upgrade to 24 when convenient
- Installer script detects and installs Node automatically

```bash
node -v   # v24.x.x = recommended · v22.14.x+ = supported
```

---

## Install Node

### macOS

```bash
brew install node
```

Or download from nodejs.org. Also supported: nvm · fnm · mise · asdf

### Linux

NodeSource (recommended):
```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Or via version manager: nvm · fnm · mise · asdf

### Windows

Download installer from nodejs.org, or:
```powershell
winget install OpenJS.NodeJS
# or
choco install nodejs
# or
scoop install nodejs
```

---

## Troubleshooting

### `openclaw: command not found`

npm global bin directory not in PATH.

```bash
npm prefix -g        # find global prefix
echo "$PATH"         # check if <prefix>/bin is listed
```

Add to `~/.zshrc` or `~/.bashrc`:

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

Then open a new terminal.

### EACCES permission errors on Linux (`npm install -g`)

```bash
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```

Add the `export PATH=...` line to `~/.bashrc` or `~/.zshrc` permanently.
