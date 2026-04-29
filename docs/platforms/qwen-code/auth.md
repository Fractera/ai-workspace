# Authentication

Qwen Code supports three authentication methods. Pick the one that matches how you want to run the CLI:

- **Qwen OAuth**: sign in with your qwen.ai account in a browser. Free with a daily quota.
- **Alibaba Cloud Coding Plan**: use an API key from Alibaba Cloud. Paid subscription with diverse model options and higher quotas.
- **API Key**: bring your own API key. Flexible to your own needs — supports OpenAI, Anthropic, Gemini, and other compatible endpoints.

## Option 1: Qwen OAuth (Free)

Use this if you want the simplest setup and you're using Qwen models.

- **How it works**: on first start, Qwen Code opens a browser login page. After you finish, credentials are cached locally so you usually won't need to log in again.
- **Requirements**: a qwen.ai account + internet access (at least for the first login).
- **Benefits**: no API key management, automatic credential refresh.
- **Cost & quota**: free, with a quota of 60 requests/minute and 1,000 requests/day.

Start the CLI and follow the browser flow:

```bash
qwen
```

Or authenticate directly without starting a session:

```bash
qwen auth qwen-oauth
```

> **Note:** In non-interactive or headless environments (e.g., CI, SSH, containers), you typically cannot complete the OAuth browser login flow. In these cases, please use the Alibaba Cloud Coding Plan or API Key authentication method.

## Option 2: Alibaba Cloud Coding Plan

Use this if you want predictable costs with diverse model options and higher usage quotas.

- **How it works**: Subscribe to the Coding Plan with a fixed monthly fee, then configure Qwen Code to use the dedicated endpoint and your subscription API key.
- **Requirements**: Obtain an active Coding Plan subscription from Alibaba Cloud ModelStudio (Beijing) or Alibaba Cloud ModelStudio (intl), depending on the region of your account.
- **Benefits**: Diverse model options, higher usage quotas, predictable monthly costs, access to a wide range of models (Qwen, GLM, Kimi, Minimax and more).

Alibaba Cloud Coding Plan is available in two regions:

| Region | Console URL |
|--------|------------|
| Aliyun ModelStudio (Beijing) | `bailian.console.aliyun.com` |
| Alibaba Cloud (intl) | `bailian.console.alibabacloud.com` |

### Interactive setup

**Option A: From the terminal (recommended for first-time setup)**

```bash
# Interactive — prompts for region and API key
qwen auth coding-plan

# Or non-interactive — pass region and key directly
qwen auth coding-plan --region china --key sk-sp-xxxxxxxxx
```

**Option B: Inside a Qwen Code session**

Enter `qwen` in the terminal to launch Qwen Code, then run the `/auth` command and select Alibaba Cloud Coding Plan. Choose your region, then enter your `sk-sp-xxxxxxxxx` key.

After authentication, use the `/model` command to switch between all Alibaba Cloud Coding Plan supported models (including `qwen3.5-plus`, `qwen3-coder-plus`, `qwen3-coder-next`, `qwen3-max`, `glm-4.7`, and `kimi-k2.5`).

### Alternative: configure via settings.json

If you prefer to skip the interactive `/auth` flow, add the following to `~/.qwen/settings.json`:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3-coder-plus",
        "name": "qwen3-coder-plus (Coding Plan)",
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "description": "qwen3-coder-plus from Alibaba Cloud Coding Plan",
        "envKey": "BAILIAN_CODING_PLAN_API_KEY"
      }
    ]
  },
  "env": {
    "BAILIAN_CODING_PLAN_API_KEY": "sk-sp-xxxxxxxxx"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "qwen3-coder-plus"
  }
}
```

> **Note:** The Coding Plan uses a dedicated endpoint (`https://coding.dashscope.aliyuncs.com/v1`) that is different from the standard Dashscope endpoint. Make sure to use the correct `baseUrl`.

## Option 3: API Key (flexible)

Use this if you want to connect to third-party providers such as OpenAI, Anthropic, Google, Azure OpenAI, OpenRouter, ModelScope, or a self-hosted endpoint. Supports multiple protocols and providers.

### Recommended: One-file setup via settings.json

The simplest way to get started with API Key authentication is to put everything in a single `~/.qwen/settings.json` file:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3-coder-plus",
        "name": "qwen3-coder-plus",
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
    "name": "qwen3-coder-plus"
  }
}
```

What each field does:

| Field | Description |
|-------|-------------|
| `modelProviders` | Declares which models are available and how to connect to them. Keys (`openai`, `anthropic`, `gemini`) represent the API protocol. |
| `env` | Stores API keys directly in `settings.json` as a fallback (lowest priority — shell `export` and `.env` files take precedence). |
| `security.auth.selectedType` | Tells Qwen Code which protocol to use on startup (e.g. `openai`, `anthropic`, `gemini`). Without this, you'd need to run `/auth` interactively. |
| `model.name` | The default model to activate when Qwen Code starts. Must match one of the `id` values in your `modelProviders`. |

After saving the file, just run `qwen` — no interactive `/auth` setup needed.

### Supported protocols

| Protocol | `modelProviders` key | Environment variables | Providers |
|----------|--------------------|-----------------------|-----------|
| OpenAI-compatible | `openai` | `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` | OpenAI, Azure OpenAI, OpenRouter, ModelScope, Alibaba Cloud, any OpenAI-compatible endpoint |
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL` | Anthropic Claude |
| Google GenAI | `gemini` | `GEMINI_API_KEY`, `GEMINI_MODEL` | Google Gemini |

### Step 1: Configure models and providers in ~/.qwen/settings.json

Define which models are available for each protocol. Each model entry requires at minimum an `id` and an `envKey` (the environment variable name that holds your API key).

> **Important:** It is recommended to define `modelProviders` in the user-scope `~/.qwen/settings.json` to avoid merge conflicts between project and user settings.

Multi-provider example:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "envKey": "OPENAI_API_KEY",
        "baseUrl": "https://api.openai.com/v1"
      }
    ],
    "anthropic": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "envKey": "ANTHROPIC_API_KEY"
      }
    ],
    "gemini": [
      {
        "id": "gemini-2.5-pro",
        "name": "Gemini 2.5 Pro",
        "envKey": "GEMINI_API_KEY"
      }
    ]
  }
}
```

**ModelConfig fields** (each entry inside `modelProviders`):

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Model ID sent to the API (e.g. `gpt-4o`, `claude-sonnet-4-20250514`) |
| `name` | No | Display name in the `/model` picker (defaults to `id`) |
| `envKey` | Yes | Environment variable name for the API key (e.g. `OPENAI_API_KEY`) |
| `baseUrl` | No | API endpoint override (useful for proxies or custom endpoints) |
| `generationConfig` | No | Fine-tune `timeout`, `maxRetries`, `samplingParams`, etc. |

> **Note:** When using the `env` field in `settings.json`, credentials are stored in plain text. For better security, prefer `.env` files or shell `export`.

### Step 2: Set environment variables

Qwen Code reads API keys from environment variables (specified by `envKey` in your model config). Priority order (highest to lowest):

**1. Shell environment / export (highest priority)**

```bash
# Alibaba Dashscope
export DASHSCOPE_API_KEY="sk-..."

# OpenAI / OpenAI-compatible
export OPENAI_API_KEY="sk-..."

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# Google GenAI
export GEMINI_API_KEY="AIza..."
```

**2. `.env` files**

Qwen Code auto-loads the first `.env` file it finds (variables are not merged across multiple files). Only variables not already present in `process.env` are loaded.

Search order (from the current directory, walking upward toward `/`):

1. `.qwen/.env` (preferred — keeps Qwen Code variables isolated from other tools)
2. `.env`

If nothing is found, it falls back to your home directory:

- `~/.qwen/.env`
- `~/.env`

> **Tip:** `.qwen/.env` is recommended over `.env` to avoid conflicts with other tools. Some variables (like `DEBUG` and `DEBUG_MODE`) are excluded from project-level `.env` files to avoid interfering with Qwen Code behavior.

**3. `settings.json` → `env` field (lowest priority)**

```json
{
  "env": {
    "DASHSCOPE_API_KEY": "sk-...",
    "OPENAI_API_KEY": "sk-...",
    "ANTHROPIC_API_KEY": "sk-ant-..."
  }
}
```

**Priority summary:**

| Priority | Source | Override behavior |
|----------|--------|------------------|
| 1 (highest) | CLI flags (`--openai-api-key`) | Always wins |
| 2 | System env (`export`, inline) | Overrides `.env` and `settings.json → env` |
| 3 | `.env` file | Only sets if not in system env |
| 4 (lowest) | `settings.json → env` | Only sets if not in system env or `.env` |

### Step 3: Switch models with /model

After launching Qwen Code, use the `/model` command to switch between all configured models. Models are grouped by protocol:

```
/model
```

You can also switch models directly with a command-line argument:

```bash
# In one terminal
qwen --model "qwen3-coder-plus"

# In another terminal
qwen --model "qwen3.5-plus"
```

## qwen auth CLI command

In addition to the in-session `/auth` slash command, Qwen Code provides a standalone `qwen auth` CLI command for managing authentication directly from the terminal.

### Interactive mode

```bash
qwen auth
```

You'll see a selector with arrow-key navigation:

```
Select authentication method:
> Qwen OAuth - Free · Up to 1,000 requests/day · Qwen latest models
  Alibaba Cloud Coding Plan - Paid · Up to 6,000 requests/5 hrs · All Alibaba Cloud Coding Plan Models
(Use ↑ ↓ arrows to navigate, Enter to select, Ctrl+C to exit)
```

### Subcommands

| Command | Description |
|---------|-------------|
| `qwen auth` | Interactive authentication setup |
| `qwen auth qwen-oauth` | Authenticate with Qwen OAuth |
| `qwen auth coding-plan` | Authenticate with Alibaba Cloud Coding Plan |
| `qwen auth coding-plan --region china --key sk-sp-…` | Non-interactive Coding Plan setup (for scripting) |
| `qwen auth status` | Show current authentication status |

Examples:

```bash
# Authenticate with Qwen OAuth directly
qwen auth qwen-oauth

# Set up Coding Plan interactively (prompts for region and key)
qwen auth coding-plan

# Set up Coding Plan non-interactively (useful for CI/scripting)
qwen auth coding-plan --region china --key sk-sp-xxxxxxxxx

# Check your current auth configuration
qwen auth status
```

## Security notes

- Don't commit API keys to version control.
- Prefer `.qwen/.env` for project-local secrets (and keep it out of git).
- Treat your terminal output as sensitive if it prints credentials for verification.
