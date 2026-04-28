# Qwen Code — Overview (GitHub README)

## Why Qwen Code?

Qwen Code is an open-source AI agent for the terminal, optimized for Qwen series models. It helps you understand large codebases, automate tedious work, and ship faster.

- **Multi-protocol, flexible providers:** use OpenAI / Anthropic / Gemini-compatible APIs, Alibaba Cloud Coding Plan, OpenRouter, Fireworks AI, or bring your own API key.
- **Open-source, co-evolving:** both the framework and the Qwen3-Coder model are open-source—and they ship and evolve together.
- **Agentic workflow, feature-rich:** rich built-in tools (Skills, SubAgents) for a full agentic workflow and a Claude Code-like experience.
- **Terminal-first, IDE-friendly:** built for developers who live in the command line, with optional integration for VS Code, Zed, and JetBrains IDEs.

---

## Installation

### Quick Install (Recommended)

**Linux / macOS**

```bash
bash -c "$(curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.sh)"
```

**Windows (Run as Administrator)**

Works in both Command Prompt and PowerShell:

```powershell
powershell -Command "Invoke-WebRequest 'https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen.bat' -OutFile (Join-Path $env:TEMP 'install-qwen.bat'); & (Join-Path $env:TEMP 'install-qwen.bat')"
```

> **Note:** It's recommended to restart your terminal after installation to ensure environment variables take effect.

### Manual Installation

#### Prerequisites

Make sure you have Node.js 20 or later installed. Download it from nodejs.org.

#### NPM

```bash
npm install -g @qwen-code/qwen-code@latest
```

#### Homebrew (macOS, Linux)

```bash
brew install qwen-code
```

---

## Quick Start

```bash
# Start Qwen Code (interactive)
qwen

# Then, in the session:
/help
/auth
```

On first use, you'll be prompted to sign in. You can run `/auth` anytime to switch authentication methods.

Example prompts:

- What does this project do?
- Explain the codebase structure.
- Help me refactor this function.
- Generate unit tests for this module.

### Use Qwen Code for Coding Tasks in Claw

Copy the prompt below and paste it into your agent:

```
Use Qwen Code as a coding agent. First, fetch and read this skill reference:
https://raw.githubusercontent.com/QwenLM/qwen-code/refs/heads/main/.qwen/skills/qwen-code-claw/SKILL.md
Then follow the instructions inside to install, authenticate, and use Qwen Code via acpx for all coding tasks.
```

---

## Authentication

Qwen Code supports the following authentication methods:

- **API Key (recommended):** use an API key from Alibaba Cloud Model Studio (Beijing / intl) or any supported provider (OpenAI, Anthropic, Google GenAI, and other compatible endpoints).
- **Coding Plan:** subscribe to the Alibaba Cloud Coding Plan (Beijing / intl) for a fixed monthly fee with higher quotas.

> ⚠️ **Qwen OAuth was discontinued on April 15, 2026.** If you were previously using Qwen OAuth, please switch to one of the methods above. Run `qwen` and then `/auth` to reconfigure.

### API Key (recommended)

Use an API key to connect to Alibaba Cloud Model Studio or any supported provider. Supports multiple protocols:

- **OpenAI-compatible:** Alibaba Cloud ModelStudio, ModelScope, OpenAI, OpenRouter, and other OpenAI-compatible providers
- **Anthropic:** Claude models
- **Google GenAI:** Gemini models

The recommended way to configure models and providers is by editing `~/.qwen/settings.json` (create it if it doesn't exist). This file lets you define all available models, API keys, and default settings in one place.

#### Quick Setup in 3 Steps

**Step 1:** Create or edit `~/.qwen/settings.json`

Here is a complete example:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3.6-plus",
        "name": "qwen3.6-plus",
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "description": "Qwen3-Coder via Dashscope",
        "envKey": "DASHSCOPE_API_KEY"
      }
    ]
  },
  "env": {
    "DASHSCOPE_API_KEY": "sk-xxxxxxxxxxxxx"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "qwen3.6-plus"
  }
}
```

**Step 2:** Understand each field

| Field | What it does |
|---|---|
| `modelProviders` | Declares which models are available and how to connect to them. Keys like `openai`, `anthropic`, `gemini` represent the API protocol. |
| `modelProviders[].id` | The model ID sent to the API (e.g. `qwen3.6-plus`, `gpt-4o`). |
| `modelProviders[].envKey` | The name of the environment variable that holds your API key. |
| `modelProviders[].baseUrl` | The API endpoint URL (required for non-default endpoints). |
| `env` | A fallback place to store API keys (lowest priority; prefer `.env` files or `export` for sensitive keys). |
| `security.auth.selectedType` | The protocol to use on startup (`openai`, `anthropic`, `gemini`, `vertex-ai`). |
| `model.name` | The default model to use when Qwen Code starts. |

**Step 3:** Start Qwen Code — your configuration takes effect automatically:

```bash
qwen
```

Use the `/model` command at any time to switch between all configured models.

#### More Examples

- Coding Plan (Alibaba Cloud ModelStudio) — fixed monthly fee, higher quotas
- Multiple providers (OpenAI + Anthropic + Gemini)
- Enable thinking mode (for supported models like `qwen3.5-plus`)

> **Tip:** You can also set API keys via `export` in your shell or `.env` files, which take higher priority than `settings.json → env`. See the authentication guide for full details.

> **Security note:** Never commit API keys to version control. The `~/.qwen/settings.json` file is in your home directory and should stay private.

### Local Model Setup (Ollama / vLLM)

You can also run models locally — no API key or cloud account needed. This is not an authentication method; instead, configure your local model endpoint in `~/.qwen/settings.json` using the `modelProviders` field.

- Ollama setup
- vLLM setup

---

## Usage

As an open-source terminal agent, you can use Qwen Code in four primary ways:

- Interactive mode (terminal UI)
- Headless mode (scripts, CI)
- IDE integration (VS Code, Zed)
- SDKs (TypeScript, Python, Java)

### Interactive mode

```bash
cd your-project/
qwen
```

Run `qwen` in your project folder to launch the interactive terminal UI. Use `@` to reference local files (for example `@src/main.ts`).

### Headless mode

```bash
cd your-project/
qwen -p "your question"
```

Use `-p` to run Qwen Code without the interactive UI—ideal for scripts, automation, and CI/CD. Learn more: Headless mode.

### IDE integration

Use Qwen Code inside your editor (VS Code, Zed, and JetBrains IDEs):

- Use in VS Code
- Use in Zed
- Use in JetBrains IDEs

### SDKs

Build on top of Qwen Code with the available SDKs:

- **TypeScript:** Use the Qwen Code SDK
- **Python:** Use the Python SDK
- **Java:** Use the Java SDK

**Python SDK example:**

```python
import asyncio

from qwen_code_sdk import is_sdk_result_message, query


async def main() -> None:
    result = query(
        "Summarize the repository layout.",
        {
            "cwd": "/path/to/project",
            "path_to_qwen_executable": "qwen",
        },
    )

    async for message in result:
        if is_sdk_result_message(message):
            print(message["result"])


asyncio.run(main())
```

---

## Commands & Shortcuts

### Session Commands

- `/help` - Display available commands
- `/clear` - Clear conversation history
- `/compress` - Compress history to save tokens
- `/stats` - Show current session information
- `/bug` - Submit a bug report
- `/exit` or `/quit` - Exit Qwen Code

### Keyboard Shortcuts

- `Ctrl+C` - Cancel current operation
- `Ctrl+D` - Exit (on empty line)
- `Up/Down` - Navigate command history

> **Tip:** In YOLO mode (`--yolo`), vision switching happens automatically without prompts when images are detected. Learn more about Approval Mode.

---

## Configuration

Qwen Code can be configured via `settings.json`, environment variables, and CLI flags.

| File | Scope | Description |
|---|---|---|
| `~/.qwen/settings.json` | User (global) | Applies to all your Qwen Code sessions. Recommended for `modelProviders` and `env`. |
| `.qwen/settings.json` | Project | Applies only when running Qwen Code in this project. Overrides user settings. |

The most commonly used top-level fields in `settings.json`:

| Field | Description |
|---|---|
| `modelProviders` | Define available models per protocol (`openai`, `anthropic`, `gemini`, `vertex-ai`). |
| `env` | Fallback environment variables (e.g. API keys). Lower priority than shell `export` and `.env` files. |
| `security.auth.selectedType` | The protocol to use on startup (e.g. `openai`). |
| `model.name` | The default model to use when Qwen Code starts. |

See the Authentication section above for complete `settings.json` examples, and the settings reference for all available options.

---

## Benchmark Results

### Terminal-Bench Performance

| Agent | Model | Accuracy |
|---|---|---|
| Qwen Code | Qwen3-Coder-480A35B | 37.5% |
| Qwen Code | Qwen3-Coder-30BA3B | 31.3% |

---

## Ecosystem

Looking for a graphical interface?

- **AionUi** — A modern GUI for command-line AI tools including Qwen Code
- **Gemini CLI Desktop** — A cross-platform desktop/web/mobile UI for Qwen Code

---

## Troubleshooting

If you encounter issues, check the troubleshooting guide.

Common issues:

- **Qwen OAuth free tier was discontinued on 2026-04-15:** Qwen OAuth is no longer available. Run `qwen` → `/auth` and switch to API Key or Coding Plan. See the Authentication section above for setup instructions.
- To report a bug from within the CLI, run `/bug` and include a short title and repro steps.

---

## Connect with Us

- **Discord:** https://discord.gg/RN7tqZCeDK
- **Dingtalk:** https://qr.dingtalk.com/action/joingroup?code=v1,k1,+FX6Gf/ZDlTahTIRi8AEQhIaBlqykA0j+eBKKdhLeAE=&_dt_no_comment=1&origin=1

---

## Acknowledgments

This project is based on Google Gemini CLI. We acknowledge and appreciate the excellent work of the Gemini CLI team. Our main contribution focuses on parser-level adaptations to better support Qwen-Coder models.
