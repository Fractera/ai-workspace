# Model Providers

Qwen Code allows you to configure multiple model providers through the `modelProviders` setting in your `settings.json`. This enables you to switch between different AI models and providers using the `/model` command.

## Overview

Use `modelProviders` to declare curated model lists per auth type that the `/model` picker can switch between. Keys must be valid auth types (`openai`, `anthropic`, `gemini`, etc.). Each entry requires an `id` and must include `envKey`, with optional `name`, `description`, `baseUrl`, and `generationConfig`. Credentials are never persisted in settings; the runtime reads them from `process.env[envKey]`. Qwen OAuth models remain hard-coded and cannot be overridden.

> **Note:** Only the `/model` command exposes non-default auth types. Anthropic, Gemini, etc., must be defined via `modelProviders`. The `/auth` command lists Qwen OAuth, Alibaba Cloud Coding Plan, and API Key as the built-in authentication options.

> **Warning:** Duplicate model IDs within the same `authType`: Defining multiple models with the same `id` under a single `authType` is currently not supported. If duplicates exist, the first occurrence wins and subsequent duplicates are skipped with a warning. This is a known limitation planned to be addressed in a future release.

## Supported Auth Types

The `modelProviders` object keys must be valid `authType` values:

| Auth Type | Description |
|-----------|-------------|
| `openai` | OpenAI-compatible APIs (OpenAI, Azure OpenAI, local inference servers like vLLM/Ollama) |
| `anthropic` | Anthropic Claude API |
| `gemini` | Google Gemini API |
| `qwen-oauth` | Qwen OAuth (hard-coded, cannot be overridden in `modelProviders`) |

> **Warning:** If an invalid auth type key is used (e.g., a typo like `"openai-custom"`), the configuration will be silently skipped and the models will not appear in the `/model` picker.

## SDKs Used for API Requests

| Auth Type | SDK Package |
|-----------|------------|
| `openai` | `openai` — Official OpenAI Node.js SDK |
| `anthropic` | `@anthropic-ai/sdk` — Official Anthropic SDK |
| `gemini` | `@google/genai` — Official Google GenAI SDK |
| `qwen-oauth` | `openai` with custom provider (DashScope-compatible) |

The `baseUrl` you configure should be compatible with the corresponding SDK's expected API format.

## Configuration Examples by Auth Type

### OpenAI-compatible providers (openai)

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-your-actual-openai-key-here",
    "OPENROUTER_API_KEY": "sk-or-your-actual-openrouter-key-here"
  },
  "modelProviders": {
    "openai": [
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "envKey": "OPENAI_API_KEY",
        "baseUrl": "https://api.openai.com/v1",
        "generationConfig": {
          "timeout": 60000,
          "maxRetries": 3,
          "enableCacheControl": true,
          "contextWindowSize": 128000,
          "modalities": {
            "image": true
          },
          "customHeaders": {
            "X-Client-Request-ID": "req-123"
          },
          "extra_body": {
            "enable_thinking": true,
            "service_tier": "priority"
          },
          "samplingParams": {
            "temperature": 0.2,
            "top_p": 0.8,
            "max_tokens": 4096,
            "presence_penalty": 0.1,
            "frequency_penalty": 0.1
          }
        }
      },
      {
        "id": "gpt-4o-mini",
        "name": "GPT-4o Mini",
        "envKey": "OPENAI_API_KEY",
        "baseUrl": "https://api.openai.com/v1",
        "generationConfig": {
          "timeout": 30000,
          "samplingParams": {
            "temperature": 0.5,
            "max_tokens": 2048
          }
        }
      },
      {
        "id": "openai/gpt-4o",
        "name": "GPT-4o (via OpenRouter)",
        "envKey": "OPENROUTER_API_KEY",
        "baseUrl": "https://openrouter.ai/api/v1",
        "generationConfig": {
          "timeout": 120000,
          "maxRetries": 3,
          "samplingParams": {
            "temperature": 0.7
          }
        }
      }
    ]
  }
}
```

### Anthropic (anthropic)

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-your-actual-anthropic-key-here"
  },
  "modelProviders": {
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "envKey": "ANTHROPIC_API_KEY",
        "baseUrl": "https://api.anthropic.com/v1",
        "generationConfig": {
          "timeout": 120000,
          "maxRetries": 3,
          "contextWindowSize": 200000,
          "samplingParams": {
            "temperature": 0.7,
            "max_tokens": 8192,
            "top_p": 0.9
          }
        }
      },
      {
        "id": "claude-3-opus",
        "name": "Claude 3 Opus",
        "envKey": "ANTHROPIC_API_KEY",
        "baseUrl": "https://api.anthropic.com/v1",
        "generationConfig": {
          "timeout": 180000,
          "samplingParams": {
            "temperature": 0.3,
            "max_tokens": 4096
          }
        }
      }
    ]
  }
}
```

### Google Gemini (gemini)

```json
{
  "env": {
    "GEMINI_API_KEY": "AIza-your-actual-gemini-key-here"
  },
  "modelProviders": {
    "gemini": [
      {
        "id": "gemini-2.0-flash",
        "name": "Gemini 2.0 Flash",
        "envKey": "GEMINI_API_KEY",
        "baseUrl": "https://generativelanguage.googleapis.com",
        "generationConfig": {
          "timeout": 60000,
          "maxRetries": 2,
          "contextWindowSize": 1000000,
          "samplingParams": {
            "temperature": 0.4,
            "top_p": 0.95,
            "max_tokens": 8192,
            "top_k": 40
          }
        }
      }
    ]
  }
}
```

### Local Self-Hosted Models (via OpenAI-compatible API)

Most local inference servers (vLLM, Ollama, LM Studio, etc.) provide an OpenAI-compatible API endpoint. Configure them using the `openai` auth type with a local `baseUrl`:

```json
{
  "env": {
    "OLLAMA_API_KEY": "ollama",
    "VLLM_API_KEY": "not-needed",
    "LMSTUDIO_API_KEY": "lm-studio"
  },
  "modelProviders": {
    "openai": [
      {
        "id": "qwen2.5-7b",
        "name": "Qwen2.5 7B (Ollama)",
        "envKey": "OLLAMA_API_KEY",
        "baseUrl": "http://localhost:11434/v1",
        "generationConfig": {
          "timeout": 300000,
          "maxRetries": 1,
          "contextWindowSize": 32768,
          "samplingParams": {
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 4096
          }
        }
      },
      {
        "id": "llama-3.1-8b",
        "name": "Llama 3.1 8B (vLLM)",
        "envKey": "VLLM_API_KEY",
        "baseUrl": "http://localhost:8000/v1",
        "generationConfig": {
          "timeout": 120000,
          "maxRetries": 2,
          "contextWindowSize": 128000,
          "samplingParams": {
            "temperature": 0.6,
            "max_tokens": 8192
          }
        }
      },
      {
        "id": "local-model",
        "name": "Local Model (LM Studio)",
        "envKey": "LMSTUDIO_API_KEY",
        "baseUrl": "http://localhost:1234/v1",
        "generationConfig": {
          "timeout": 60000,
          "samplingParams": {
            "temperature": 0.5
          }
        }
      }
    ]
  }
}
```

For local servers that don't require authentication, use any placeholder value for the API key:

```bash
# For Ollama (no auth required)
export OLLAMA_API_KEY="ollama"

# For vLLM (if no auth is configured)
export VLLM_API_KEY="not-needed"
```

> **Note:** The `extra_body` parameter is only supported for OpenAI-compatible providers (`openai`, `qwen-oauth`). It is ignored for Anthropic and Gemini providers.

> **Note about `envKey`:** The `envKey` field specifies the name of an environment variable, not the actual API key value. Set the environment variable via a `.env` file (recommended) or the `env` field in `settings.json`.

## Alibaba Cloud Coding Plan

Alibaba Cloud Coding Plan provides a pre-configured set of Qwen models optimized for coding tasks with automatic model configuration updates.

### Overview

When you authenticate with an Alibaba Cloud Coding Plan API key using the `/auth` command, Qwen Code automatically configures the following models:

| Model ID | Name | Description |
|----------|------|-------------|
| `qwen3.5-plus` | qwen3.5-plus | Advanced model with thinking enabled |
| `qwen3-coder-plus` | qwen3-coder-plus | Optimized for coding tasks |
| `qwen3-max-2026-01-23` | qwen3-max-2026-01-23 | Latest max model with thinking enabled |

### Setup

1. Obtain an Alibaba Cloud Coding Plan API key from the China or International console.
2. Run the `/auth` command in Qwen Code.
3. Select Alibaba Cloud Coding Plan.
4. Select your region.
5. Enter your API key when prompted.

### Regions

| Region | Endpoint | Description |
|--------|----------|-------------|
| China | `https://coding.dashscope.aliyuncs.com/v1` | Mainland China endpoint |
| Global/International | `https://coding-intl.dashscope.aliyuncs.com/v1` | International endpoint |

### API Key Storage

When configured through `/auth`, the API key is stored using the reserved environment variable name `BAILIAN_CODING_PLAN_API_KEY`. By default, it is stored in the `env` field of `settings.json`.

> **Security Recommendation:** Move the API key from `settings.json` to a separate `.env` file:
> ```
> # ~/.qwen/.env
> BAILIAN_CODING_PLAN_API_KEY=your-api-key-here
> ```

### Automatic Updates

When Qwen Code detects a newer version of the model template, you will be prompted to update. Accepting will replace existing Coding Plan model configurations with the latest versions while preserving custom configurations.

### Manual Configuration (Advanced)

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3-coder-plus",
        "name": "qwen3-coder-plus",
        "description": "Qwen3-Coder via Alibaba Cloud Coding Plan",
        "envKey": "YOUR_CUSTOM_ENV_KEY",
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1"
      }
    ]
  }
}
```

> **Warning:** If you also use automatic Coding Plan configuration, automatic updates may overwrite manual configurations that share the same `envKey` and `baseUrl`.

## Resolution Layers and Atomicity

The effective auth/model/credential values are chosen per field using the following precedence (first present wins):

| Layer (highest → lowest) | authType | model | apiKey | baseUrl |
|--------------------------|----------|-------|--------|---------|
| Programmatic overrides | `/auth` | `/auth` input | `/auth` input | `/auth` input |
| Model provider selection | — | `modelProvider.id` | `env[modelProvider.envKey]` | `modelProvider.baseUrl` |
| CLI arguments | `--auth-type` | `--model` | `--openaiApiKey` | `--openaiBaseUrl` |
| Environment variables | — | Provider-specific (e.g. `OPENAI_MODEL`) | Provider-specific (e.g. `OPENAI_API_KEY`) | Provider-specific (e.g. `OPENAI_BASE_URL`) |
| Settings (`settings.json`) | `security.auth.selectedType` | `model.name` | `security.auth.apiKey` | `security.auth.baseUrl` |
| Default / computed | Falls back to `AuthType.QWEN_OAUTH` | Built-in default (`qwen3-coder-plus`) | — | — |

> **Deprecation warning:** Directly configuring API credentials via `security.auth.apiKey` and `security.auth.baseUrl` in `settings.json` is deprecated. Migrate to `modelProviders` with `envKey`.

## Generation Config Layering: The Impermeable Provider Layer

### How it works

**When a `modelProvider` model IS selected:**

- The entire `generationConfig` from the provider is applied atomically
- The provider layer is completely impermeable — lower layers (CLI, env, settings) do not participate
- All fields not defined by the provider are set to `undefined` (not inherited from settings)

**When NO `modelProvider` model is selected (Runtime Model):**

- Configuration is built by resolving through layers: CLI → env → settings → defaults

### Per-field precedence for generationConfig

| Priority | Source | Behavior |
|----------|--------|----------|
| 1 | Programmatic overrides | Runtime `/model`, `/auth` changes |
| 2 | `modelProviders[authType][].generationConfig` | Impermeable layer — completely replaces all `generationConfig` fields |
| 3 | `settings.model.generationConfig` | Only used for Runtime Models |
| 4 | Content-generator defaults | Provider-specific defaults — only for Runtime Models |

### Atomic field treatment

The following fields are treated as atomic objects — provider values completely replace the entire object, no merging occurs:

- `samplingParams`
- `customHeaders`
- `extra_body`

### Example

```json
// User settings (~/.qwen/settings.json)
{
  "model": {
    "generationConfig": {
      "timeout": 30000,
      "samplingParams": { "temperature": 0.5, "max_tokens": 1000 }
    }
  }
}

// modelProviders configuration
{
  "modelProviders": {
    "openai": [{
      "id": "gpt-4o",
      "envKey": "OPENAI_API_KEY",
      "generationConfig": {
        "timeout": 60000,
        "samplingParams": { "temperature": 0.2 }
      }
    }]
  }
}
```

When `gpt-4o` is selected from `modelProviders`:

- `timeout` = `60000` (from provider)
- `samplingParams.temperature` = `0.2` (from provider, completely replaces settings object)
- `samplingParams.max_tokens` = `undefined` (not defined in provider, not inherited from settings)

When using `--model gpt-4` (Runtime Model, not from `modelProviders`):

- `timeout` = `30000` (from settings)
- `samplingParams.temperature` = `0.5` (from settings)
- `samplingParams.max_tokens` = `1000` (from settings)

The merge strategy for `modelProviders` itself is REPLACE: the entire `modelProviders` from project settings will override the corresponding section in user settings.

## Provider Models vs Runtime Models

### Provider Model

- Defined in `modelProviders` configuration
- Has a complete, atomic configuration package
- Appears in `/model` command list with full metadata
- Recommended for multi-model workflows and team consistency

### Runtime Model

- Created dynamically when using raw model IDs via CLI (`--model`), environment variables, or settings
- Configuration built by resolving through layers
- Automatically captured as a `RuntimeModelSnapshot` when a complete configuration is detected

**RuntimeModelSnapshot lifecycle:**

```bash
# This creates a RuntimeModelSnapshot with ID: $runtime|openai|my-custom-model
qwen --auth-type openai --model my-custom-model --openaiApiKey $KEY --openaiBaseUrl https://api.example.com/v1
```

The snapshot captures model ID, API key, base URL, and generation config, and persists across sessions.

## Selection Persistence and Recommendations

> **Important:** Define `modelProviders` in the user-scope `~/.qwen/settings.json` whenever possible. Keeping the provider catalog in user settings prevents merge/override conflicts between project and user scopes.

- Use **Provider Models** when: You have standard models shared across a team, need consistent configurations, or want to prevent accidental overrides.
- Use **Runtime Models** when: Quickly testing a new model, using temporary credentials, or working with ad-hoc endpoints.
