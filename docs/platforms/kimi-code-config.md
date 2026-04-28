# Kimi Code CLI — Configuration

Source: https://moonshotai.github.io/kimi-cli/en/guides/config

---

## Config File Location

Default: `~/.kimi/config.toml` (auto-created on first run)

```bash
kimi --config-file /path/to/config.toml          # specify file
kimi --config '{"default_model": "kimi-for-coding", ...}'  # pass inline
```

Formats: TOML or JSON. JSON → TOML auto-migration if `config.json` exists but `config.toml` does not.

---

## Complete Configuration Example

```toml
default_model = "kimi-for-coding"
default_thinking = false
default_yolo = false
default_plan_mode = false
default_editor = ""
theme = "dark"
merge_all_available_skills = false

[providers.kimi-for-coding]
type = "kimi"
base_url = "https://api.kimi.com/coding/v1"
api_key = "sk-xxx"

[models.kimi-for-coding]
provider = "kimi-for-coding"
model = "kimi-for-coding"
max_context_size = 262144

[loop_control]
max_steps_per_turn = 100
max_retries_per_step = 3
max_ralph_iterations = 0
reserved_context_size = 50000
compaction_trigger_ratio = 0.85

[background]
max_running_tasks = 4
keep_alive_on_exit = false
agent_task_timeout_s = 900

[services.moonshot_search]
base_url = "https://api.kimi.com/coding/v1/search"
api_key = "sk-xxx"

[services.moonshot_fetch]
base_url = "https://api.kimi.com/coding/v1/fetch"
api_key = "sk-xxx"

[mcp.client]
tool_call_timeout_ms = 60000
```

---

## Configuration Items

### Top-level

| Key | Type | Default | Description |
|---|---|---|---|
| `default_model` | string | — | Default model name (must be defined in `models`) |
| `default_thinking` | boolean | false | Enable Thinking mode by default |
| `default_yolo` | boolean | false | Enable YOLO (auto-approve) by default |
| `default_plan_mode` | boolean | false | Start new sessions in plan mode by default |
| `default_editor` | string | auto | External editor command (`"vim"`, `"code --wait"`) |
| `theme` | string | `"dark"` | Terminal color theme: `"dark"` or `"light"` |
| `merge_all_available_skills` | boolean | false | Merge skills from all brand directories |

---

### providers

Each provider is a unique key under `[providers.<name>]`.

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | Yes | Provider type (`"kimi"`, `"openai_legacy"`, `"openai_responses"`) |
| `base_url` | string | Yes | API base URL |
| `api_key` | string | Yes | API key |
| `env` | table | No | Env vars to set before creating the provider |
| `custom_headers` | table | No | Custom HTTP headers |

```toml
[providers.moonshot-cn]
type = "kimi"
base_url = "https://api.moonshot.cn/v1"
api_key = "sk-xxx"
custom_headers = { "X-Custom-Header" = "value" }
```

---

### models

Each model is a unique key under `[models.<name>]`.

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | string | Yes | Provider name (must be defined in `providers`) |
| `model` | string | Yes | Model identifier used in API |
| `max_context_size` | integer | Yes | Maximum context length in tokens |
| `capabilities` | array | No | Model capabilities list |

```toml
[models.kimi-for-coding]
provider = "kimi-for-coding"
model = "kimi-for-coding"
max_context_size = 262144
capabilities = ["thinking", "image_in"]
```

---

### loop_control

| Field | Default | Description |
|---|---|---|
| `max_steps_per_turn` | 100 | Maximum steps per turn |
| `max_retries_per_step` | 3 | Maximum retries per step |
| `max_ralph_iterations` | 0 | Extra auto-iterations after user message; 0=disabled, -1=unlimited |
| `reserved_context_size` | 50000 | Reserved tokens for LLM response generation |
| `compaction_trigger_ratio` | 0.85 | Context usage ratio to trigger auto-compaction (0.5–0.99) |

---

### background

| Field | Default | Description |
|---|---|---|
| `max_running_tasks` | 4 | Max concurrent background tasks |
| `keep_alive_on_exit` | false | Keep background tasks running when CLI exits |
| `agent_task_timeout_s` | 900 | Max runtime in seconds for a background Agent task |

---

### services

**moonshot_search** — web search service (enables `SearchWeb` tool)

**moonshot_fetch** — web fetch service (enables `FetchURL` tool)

```toml
[services.moonshot_search]
base_url = "https://api.kimi.com/coding/v1/search"
api_key = "sk-xxx"

[services.moonshot_fetch]
base_url = "https://api.kimi.com/coding/v1/fetch"
api_key = "sk-xxx"
```

Both auto-configured by `/login` when using Kimi Code platform.

---

### mcp

```toml
[mcp.client]
tool_call_timeout_ms = 60000    # MCP tool call timeout in milliseconds
```

---

### hooks (Beta)

```toml
[[hooks]]
event = "PreToolUse"
matcher = "Shell"
command = ".kimi/hooks/safety-check.sh"
timeout = 10

[[hooks]]
event = "PostToolUse"
matcher = "WriteFile"
command = "prettier --write"
```

| Field | Required | Description |
|---|---|---|
| `event` | Yes | Event type (`PreToolUse`, `PostToolUse`) |
| `command` | Yes | Shell command to execute |
| `matcher` | No | Regex filter condition |
| `timeout` | No | Timeout in seconds (default 30) |

---

## Configuration Priority (Highest → Lowest)

1. **Environment variables** — temporary overrides, CI/CD
2. **CLI parameters** — specified at startup
3. **Configuration file** — `~/.kimi/config.toml`

### CLI Parameters

| Parameter | Description |
|---|---|
| `--config <TOML/JSON>` | Pass config inline (overrides config file) |
| `--config-file <PATH>` | Specify config file path |
| `--model, -m <NAME>` | Specify model name |
| `--thinking` / `--no-thinking` | Enable/disable thinking mode |
| `--yolo, --yes, -y` | Auto-approve all operations |
| `--plan` | Start in plan mode |

Note: `--config` and `--config-file` cannot be used together.

---

## Environment Variables

### Kimi Provider Variables

| Variable | Description |
|---|---|
| `KIMI_BASE_URL` | API base URL |
| `KIMI_API_KEY` | API key |
| `KIMI_MODEL_NAME` | Model identifier |
| `KIMI_MODEL_MAX_CONTEXT_SIZE` | Max context length in tokens |
| `KIMI_MODEL_CAPABILITIES` | Comma-separated capabilities: `thinking,image_in,video_in,always_thinking` |
| `KIMI_MODEL_TEMPERATURE` | Generation temperature |
| `KIMI_MODEL_TOP_P` | Nucleus sampling top_p |
| `KIMI_MODEL_MAX_TOKENS` | Max tokens per response |

```bash
export KIMI_BASE_URL="https://api.kimi.com/coding/v1"
export KIMI_API_KEY="sk-xxx"
export KIMI_MODEL_NAME="kimi-for-coding"
export KIMI_MODEL_MAX_CONTEXT_SIZE="262144"
export KIMI_MODEL_CAPABILITIES="thinking,image_in"
```

### OpenAI-Compatible Provider Variables

| Variable | Description |
|---|---|
| `OPENAI_BASE_URL` | API base URL |
| `OPENAI_API_KEY` | API key |

### Other Variables

| Variable | Default | Description |
|---|---|---|
| `KIMI_SHARE_DIR` | `~/.kimi` | Share directory — config, sessions, logs, runtime data |
| `KIMI_CLI_NO_AUTO_UPDATE` | — | Set to `1` to disable background update checks |
| `KIMI_CLI_PASTE_CHAR_THRESHOLD` | `1000` | Chars threshold for folding pasted text |
| `KIMI_CLI_PASTE_LINE_THRESHOLD` | `15` | Lines threshold for folding pasted text |

Note: `KIMI_SHARE_DIR` does not affect Agent Skills search paths — use `--skills-dir` for that.

---

## Providers and Models

### /login Platforms

| Platform | Description |
|---|---|
| Kimi Code | Kimi Code platform — includes search and fetch services |
| platform.kimi.com | China region API endpoint |
| platform.kimi.ai | Global region API endpoint |

For other platforms — manually edit the config file.

### Provider Types

| Type | Description |
|---|---|
| `kimi` | Kimi API (Kimi Code + Kimi Platform) |
| `openai_legacy` | OpenAI Chat Completions API + compatible services |
| `openai_responses` | OpenAI Responses API (newer format) |
| `anthropic` | Anthropic Claude API |
| `gemini` | Google Gemini API |
| `vertexai` | Google Vertex AI |

```toml
# Kimi
[providers.kimi-for-coding]
type = "kimi"
base_url = "https://api.kimi.com/coding/v1"
api_key = "sk-xxx"

# OpenAI compatible
[providers.openai]
type = "openai_legacy"
base_url = "https://api.openai.com/v1"
api_key = "sk-xxx"

# Anthropic
[providers.anthropic]
type = "anthropic"
base_url = "https://api.anthropic.com"
api_key = "sk-ant-xxx"

# Gemini
[providers.gemini]
type = "gemini"
base_url = "https://generativelanguage.googleapis.com"
api_key = "xxx"

# Vertex AI
[providers.vertexai]
type = "vertexai"
base_url = "https://xxx-aiplatform.googleapis.com"
api_key = ""
env = { GOOGLE_CLOUD_PROJECT = "your-project-id" }
```

### Model Capabilities

| Capability | Description |
|---|---|
| `thinking` | Supports Thinking mode (deep reasoning), can be toggled |
| `always_thinking` | Always uses Thinking mode, cannot be disabled |
| `image_in` | Supports image input (Ctrl-V paste) |
| `video_in` | Supports video input |

```toml
[models.gemini-3-pro-preview]
provider = "gemini"
model = "gemini-3-pro-preview"
max_context_size = 262144
capabilities = ["thinking", "image_in"]
```

### Search and Fetch Services

| Service | Tool | Without Config |
|---|---|---|
| `moonshot_search` | `SearchWeb` | Tool unavailable |
| `moonshot_fetch` | `FetchURL` | Falls back to local fetching |

Both auto-configured by `/login` on Kimi Code platform. `FetchURL` works on other platforms via local fallback.

**CJK IME fix** (XShell over SSH, broken IME after paste):
```bash
export KIMI_CLI_PASTE_LINE_THRESHOLD="2"
```
Folds any paste containing a newline into a single-line placeholder. Thresholds use OR logic.
