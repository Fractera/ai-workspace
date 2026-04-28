# Kimi Code — Config Files

Kimi Code CLI uses configuration files to manage API providers, models, services, and runtime parameters, supporting both TOML and JSON formats.

## Config File Location

The default configuration file is located at `~/.kimi/config.toml`. On first run, if the configuration file does not exist, Kimi Code CLI automatically creates a default configuration file.

You can specify a different configuration file (TOML or JSON format) via the `--config-file` parameter:

```bash
kimi --config-file /path/to/config.toml
```

When calling Kimi Code CLI programmatically, you can also pass the complete configuration content directly via the `--config` parameter:

```bash
kimi --config '{"default_model": "kimi-for-coding", "providers": {...}, "models": {...}}'
```

## Configuration Items

The configuration file contains the following top-level configuration items:

| Config Item | Type | Description |
|---|---|---|
| `default_model` | string | Default model name, must be a model defined in `models` |
| `default_thinking` | boolean | Whether to enable Thinking mode by default (default: false) |
| `default_yolo` | boolean | Whether to enable YOLO (auto-approve) mode by default (default: false) |
| `default_plan_mode` | boolean | Whether to start new sessions in plan mode by default (default: false); resumed sessions preserve their existing state |
| `default_editor` | string | Default external editor command (e.g., `"vim"`, `"code --wait"`), auto-detected when empty |
| `theme` | string | Terminal color theme, either `"dark"` or `"light"` (default: `"dark"`) |
| `merge_all_available_skills` | boolean | Whether to merge skills from all brand directories (default: false) |
| `providers` | table | API provider configuration |
| `models` | table | Model configuration |
| `loop_control` | table | Agent loop control parameters |
| `background` | table | Background task runtime parameters |
| `services` | table | External service configuration (search, fetch) |
| `mcp` | table | MCP client configuration |

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

## providers

`providers` defines API provider connection information. Each provider uses a unique name as key.

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | Yes | Provider type |
| `base_url` | string | Yes | API base URL |
| `api_key` | string | Yes | API key |
| `env` | table | No | Environment variables to set before creating the provider instance |
| `custom_headers` | table | No | Custom HTTP headers to attach to requests |

Example:

```toml
[providers.moonshot-cn]
type = "kimi"
base_url = "https://api.moonshot.cn/v1"
api_key = "sk-xxx"
custom_headers = { "X-Custom-Header" = "value" }
```

## models

`models` defines available models. Each model uses a unique name as key.

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | string | Yes | Provider name to use, must be defined in `providers` |
| `model` | string | Yes | Model identifier (model name used in the API) |
| `max_context_size` | integer | Yes | Maximum context length (in tokens) |
| `capabilities` | array | No | Model capability list |

Example:

```toml
[models.kimi-for-coding]
provider = "kimi-for-coding"
model = "kimi-for-coding"
max_context_size = 262144
capabilities = ["thinking", "image_in"]
```

## loop_control

`loop_control` controls Agent execution loop behavior.

| Field | Type | Default | Description |
|---|---|---|---|
| `max_steps_per_turn` | integer | 100 | Maximum steps per turn |
| `max_retries_per_step` | integer | 3 | Maximum retries per step |
| `max_ralph_iterations` | integer | 0 | Extra auto-iterations after each user message; 0 disables; -1 is unlimited |
| `reserved_context_size` | integer | 50000 | Reserved token count for LLM response generation |
| `compaction_trigger_ratio` | float | 0.85 | Context usage ratio threshold for auto-compaction (0.5–0.99) |

## background

`background` controls background task runtime behavior.

| Field | Type | Default | Description |
|---|---|---|---|
| `max_running_tasks` | integer | 4 | Maximum number of concurrent background tasks |
| `keep_alive_on_exit` | boolean | false | Whether to keep background tasks running when the CLI exits |
| `agent_task_timeout_s` | integer | 900 | Maximum runtime in seconds for a background Agent task |

## services

`services` configures external services used by Kimi Code CLI.

### moonshot_search

Configures the web search service. When enabled, the `SearchWeb` tool becomes available.

| Field | Type | Required | Description |
|---|---|---|---|
| `base_url` | string | Yes | Search service API URL |
| `api_key` | string | Yes | API key |
| `custom_headers` | table | No | Custom HTTP headers to attach to requests |

### moonshot_fetch

Configures the web fetch service. When enabled, the `FetchURL` tool prioritizes using this service to fetch webpage content.

| Field | Type | Required | Description |
|---|---|---|---|
| `base_url` | string | Yes | Fetch service API URL |
| `api_key` | string | Yes | API key |
| `custom_headers` | table | No | Custom HTTP headers to attach to requests |

When configuring the Kimi Code platform using the `/login` command, search and fetch services are automatically configured.

## mcp

`mcp` configures MCP client behavior.

| Field | Type | Default | Description |
|---|---|---|---|
| `client.tool_call_timeout_ms` | integer | 60000 | MCP tool call timeout (milliseconds) |

## hooks

`hooks` configures lifecycle hooks (Beta feature).

Use the `[[hooks]]` array syntax to define multiple hooks:

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

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | string | Yes | Event type |
| `command` | string | Yes | Shell command to execute |
| `matcher` | string | No | Regex filter condition |
| `timeout` | integer | No | Timeout in seconds, default 30 |

## Config Overrides and Priority

Kimi Code CLI configuration can be set through multiple methods, with different sources overriding each other by priority.

### Priority

Configuration priority from highest to lowest:

1. **Environment variables** – Highest priority, for temporary overrides or CI/CD environments
2. **CLI parameters** – Parameters specified at startup
3. **Configuration file** – `~/.kimi/config.toml` or file specified via `--config-file`

### CLI Parameters

**Configuration file related**

| Parameter | Description |
|---|---|
| `--config <TOML/JSON>` | Pass configuration content directly, overrides the default config file |
| `--config-file <PATH>` | Specify configuration file path, replaces the default `~/.kimi/config.toml` |

`--config` and `--config-file` cannot be used together.

**Model related**

| Parameter | Description |
|---|---|
| `--model, -m <NAME>` | Specify the model name to use |

The model specified by `--model` must be defined in the configuration file's `models`. If not specified, the `default_model` from the configuration file is used.

**Behavior related**

| Parameter | Description |
|---|---|
| `--thinking` | Enable thinking mode |
| `--no-thinking` | Disable thinking mode |
| `--yolo, --yes, -y` | Auto-approve all operations |
| `--plan` | Start in plan mode |

`--thinking` / `--no-thinking` overrides the thinking state saved from the last session. If not specified, the last session's state is used.

`--plan` enables plan mode for new sessions; when resuming an existing session, it forces plan mode on. You can also set `default_plan_mode = true` in the configuration file to start new sessions in plan mode by default.

### Environment Variable Overrides

Environment variables can override provider and model settings without modifying the configuration file. This is particularly useful in the following scenarios:

- Injecting keys in CI/CD environments
- Temporarily testing different API endpoints
- Switching between multiple environments

Environment variables take effect based on the current provider type:

- `kimi` type providers: Use `KIMI_*` environment variables
- `openai_legacy` or `openai_responses` type providers: Use `OPENAI_*` environment variables
- Other provider types: Environment variable overrides not supported

For the complete list of environment variables, see Environment Variables.

## JSON Configuration Migration

If `~/.kimi/config.toml` does not exist but `~/.kimi/config.json` exists, Kimi Code CLI automatically migrates the JSON configuration to TOML format and backs up the original file as `config.json.bak`.

Configuration files specified via `--config-file` are parsed based on file extension. Configuration content passed via `--config` is first attempted as JSON, then falls back to TOML if that fails.
