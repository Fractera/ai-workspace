# Kimi Code CLI — Quick Start

Kimi Code CLI is an AI agent that runs in the terminal, helping you complete software development tasks and terminal operations. It can read and edit code, execute shell commands, search and fetch web pages, and autonomously plan and adjust actions during execution.

Kimi Code CLI is suited for:

- **Writing and modifying code:** Implementing new features, fixing bugs, refactoring code
- **Understanding projects:** Exploring unfamiliar codebases, answering architecture and implementation questions
- **Automating tasks:** Batch processing files, running builds and tests, executing scripts

Kimi Code CLI supports the following usage modes:

- **Interactive CLI (`kimi`):** Chat with AI in the terminal using natural language to describe tasks or execute shell commands directly
- **Browser UI (`kimi web`):** Open a graphical interface in your local browser, supporting session management, file references, code highlighting, and more
- **Agent integration (`kimi acp`):** Run as a service and integrate into IDEs and other local agent clients via the Agent Client Protocol

If you encounter issues or have suggestions, feel free to provide feedback via GitHub Issues.

## Before You Start

- **Operating system:** macOS, Linux, or Windows (via PowerShell)
- **Kimi account:** Requires a Kimi membership subscription, or a callable API key

## Installation

Run the installation script to complete the installation. The script will first install uv (a Python package manager), then install Kimi Code CLI via uv:

```bash
# Linux / macOS
curl -LsSf https://code.kimi.com/install.sh | bash

# Windows (PowerShell)
Invoke-RestMethod https://code.kimi.com/install.ps1 | Invoke-Expression
```

Verify the installation:

```bash
kimi --version
```

Due to macOS security checks (Gatekeeper), the first run of the `kimi` command may take longer. You can add your terminal application in "System Settings → Privacy & Security → Developer Tools" to speed up subsequent launches.

If you already have uv installed, you can also run:

```bash
uv tool install --python 3.13 kimi-cli
```

Kimi Code CLI supports Python 3.12–3.14, but Python 3.13 is recommended for best compatibility.

## First Run

### Start and Log In

Start Kimi Code CLI in the project directory where you want to work:

```bash
cd your-project
kimi
```

On first launch, enter `/login` to configure the API source:

```
/login
```

We recommend selecting the Kimi Code platform, which automatically opens the browser for OAuth authorization; selecting other platforms requires entering an API key. After configuration, it automatically saves and reloads. See the Providers and Models configuration documentation for details.

### Step 1: Ask a Question

Ask a question in natural language to quickly understand the project:

```
What is the overall architecture of this project? Where is the entry file?
```

Kimi Code CLI will automatically search and read relevant files, then provide an answer.

### Step 2: Make a Code Change

Try letting Kimi Code CLI modify code:

```
Add a "Quick Start" section to the README, including installation and running steps
```

Kimi Code CLI will show a diff and ask for confirmation before modifying files—you can approve, reject, or enter feedback to adjust direction. It won't change your code without permission.

### Step 3: Execute a Command

Kimi Code CLI can also run shell commands and analyze the results:

```
Run the tests and fix any failing cases
```

At this point, you've experienced three core capabilities: asking questions, modifying code, and executing commands.

If the project doesn't have an `AGENTS.md` file, you can run the `/init` command to have Kimi Code CLI analyze the project and generate this file, helping the AI better understand the project structure and conventions.

## Common Commands Cheat Sheet

| Command | Description |
|---|---|
| `kimi` | Start an interactive conversation |
| `kimi web` | Open the browser graphical interface |
| `/login` | Configure or switch API source |
| `/usage` | View remaining quota and limits |
| `/help` | View all commands and shortcuts |
| Ctrl-J | Newline (without submitting) |
| Ctrl-C / Ctrl-D | Interrupt current operation / Exit |

For the full command list, please refer to Slash Commands and Keyboard Shortcuts.

## FAQ

### Why do I get an authentication failure after entering my API Key?

First, confirm that your Key and Base URL belong to the same platform. `api.kimi.com` and `api.moonshot.cn` are two completely independent account systems; API Keys are not interchangeable:

| Platform | Base URL | Billing | Key Creation Portal |
|---|---|---|---|
| Kimi Code | OpenAI Compatible: `https://api.kimi.com/coding/v1`<br>Anthropic Compatible: `https://api.kimi.com/coding/` | Kimi membership subscription (with quota) | www.kimi.com/code/console |
| Kimi Platform | `https://api.moonshot.cn/v1` | Pay-as-you-go | platform.kimi.ai |

**What to do:** Go back to the corresponding platform's console to recreate a Key, and ensure the `base_url` (also called Entrypoint or Endpoint) configured in your tool matches the Key's platform.

### kimi command not found after installation

The installation script adds `kimi` to PATH, but you need to restart the terminal or run `source ~/.bashrc` (or `source ~/.zshrc`) for it to take effect. If it's still not found, check whether `~/.local/bin` is in your PATH.

### Browser doesn't pop up after /login

If you're on a remote server or in a headless environment, `/login` will display a URL; manually copy it to your browser to complete authorization.

For more issues, please refer to FAQ.

## Upgrade and Uninstall

Upgrade to the latest version:

```bash
uv tool upgrade kimi-cli --no-cache
```

Uninstall Kimi Code CLI:

```bash
uv tool uninstall kimi-cli
```
