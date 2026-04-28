# Kimi Code — Providers and Models

Kimi Code CLI supports multiple LLM platforms, which can be configured via configuration files or the `/login` command.

## Platform Selection

The easiest way to configure is to run the `/login` command (alias `/setup`) in Shell mode and follow the wizard to complete platform and model selection:

1. Select an API platform
2. Enter your API key
3. Select a model from the available list

After configuration, Kimi Code CLI automatically saves settings to `~/.kimi/config.toml` and reloads.

`/login` currently supports the following platforms:

| Platform | Description |
|---|---|
| Kimi Code | Kimi Code platform, supports search and fetch services |
| platform.kimi.com | China region API endpoint |
| platform.kimi.ai | Global region API endpoint |

For other platforms, please manually edit the configuration file.

## Provider Types

The `type` field in `providers` configuration specifies the API provider type. Different types use different API protocols and client implementations.

| Type | Description |
|---|---|
| `kimi` | Kimi API |
| `openai_legacy` | OpenAI Chat Completions API |
| `openai_responses` | OpenAI Responses API |
| `anthropic` | Anthropic Claude API |
| `gemini` | Google Gemini API |
| `vertexai` | Google Vertex AI |

### kimi

For connecting to the Kimi API, including Kimi Code and Kimi Platform.

```toml
[providers.kimi-for-coding]
type = "kimi"
base_url = "https://api.kimi.com/coding/v1"
api_key = "sk-xxx"
```

### openai_legacy

For platforms compatible with the OpenAI Chat Completions API, including the official OpenAI API and various compatible services.

```toml
[providers.openai]
type = "openai_legacy"
base_url = "https://api.openai.com/v1"
api_key = "sk-xxx"
```

### openai_responses

For the OpenAI Responses API (newer API format).

```toml
[providers.openai-responses]
type = "openai_responses"
base_url = "https://api.openai.com/v1"
api_key = "sk-xxx"
```

### anthropic

For connecting to the Anthropic Claude API.

```toml
[providers.anthropic]
type = "anthropic"
base_url = "https://api.anthropic.com"
api_key = "sk-ant-xxx"
```

### gemini

For connecting to the Google Gemini API.

```toml
[providers.gemini]
type = "gemini"
base_url = "https://generativelanguage.googleapis.com"
api_key = "xxx"
```

### vertexai

For connecting to Google Vertex AI. Requires setting necessary environment variables via the `env` field.

```toml
[providers.vertexai]
type = "vertexai"
base_url = "https://xxx-aiplatform.googleapis.com"
api_key = ""
env = { GOOGLE_CLOUD_PROJECT = "your-project-id" }
```

All provider types support adding custom HTTP request headers via the `custom_headers` field. See Config Files for details.

## Model Capabilities

The `capabilities` field in model configuration declares the capabilities supported by the model. This affects feature availability in Kimi Code CLI.

| Capability | Description |
|---|---|
| `thinking` | Supports Thinking mode (deep reasoning), can be toggled |
| `always_thinking` | Always uses Thinking mode (cannot be disabled) |
| `image_in` | Supports image input |
| `video_in` | Supports video input |

```toml
[models.gemini-3-pro-preview]
provider = "gemini"
model = "gemini-3-pro-preview"
max_context_size = 262144
capabilities = ["thinking", "image_in"]
```

### thinking

Declares that the model supports Thinking mode. When enabled, the model performs deeper reasoning before answering, suitable for complex problems. In Shell mode, you can use the `/model` command to switch models and Thinking mode, or control it at startup with `--thinking` / `--no-thinking` parameters.

### always_thinking

Indicates the model always uses Thinking mode and cannot be disabled. Currently, the Kimi Code platform does not have any models with this capability.

### image_in

When image input capability is enabled, you can paste images in conversations (Ctrl-V).

### video_in

When video input capability is enabled, you can send video content in conversations.

## Search and Fetch Services

The `SearchWeb` and `FetchURL` tools depend on external services, currently only provided by the Kimi Code platform.

When selecting the Kimi Code platform using `/login`, search and fetch services are automatically configured.

| Service | Corresponding Tool | Behavior When Not Configured |
|---|---|---|
| `moonshot_search` | SearchWeb | Tool unavailable |
| `moonshot_fetch` | FetchURL | Falls back to local fetching |

When using other platforms, the `FetchURL` tool is still available but will fall back to local fetching.
