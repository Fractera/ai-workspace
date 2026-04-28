# Kimi Code — Config Overrides

Kimi Code CLI configuration can be set through multiple methods, with different sources overriding each other by priority.

## Priority

Configuration priority from highest to lowest:

1. **Environment variables** – Highest priority, for temporary overrides or CI/CD environments
2. **CLI parameters** – Parameters specified at startup
3. **Configuration file** – `~/.kimi/config.toml` or file specified via `--config-file`

## CLI Parameters

### Configuration file related

| Parameter | Description |
|---|---|
| `--config <TOML/JSON>` | Pass configuration content directly, overrides the default config file |
| `--config-file <PATH>` | Specify configuration file path, replaces the default `~/.kimi/config.toml` |

`--config` and `--config-file` cannot be used together.

### Model related

| Parameter | Description |
|---|---|
| `--model, -m <NAME>` | Specify the model name to use |

The model specified by `--model` must be defined in the configuration file's `models`. If not specified, the `default_model` from the configuration file is used.

### Behavior related

| Parameter | Description |
|---|---|
| `--thinking` | Enable thinking mode |
| `--no-thinking` | Disable thinking mode |
| `--yolo, --yes, -y` | Auto-approve all operations |
| `--plan` | Start in plan mode |

`--thinking` / `--no-thinking` overrides the thinking state saved from the last session. If not specified, the last session's state is used.

`--plan` enables plan mode for new sessions; when resuming an existing session, it forces plan mode on. You can also set `default_plan_mode = true` in the configuration file to start new sessions in plan mode by default.

## Environment Variable Overrides

Environment variables can override provider and model settings without modifying the configuration file. This is particularly useful in the following scenarios:

- Injecting keys in CI/CD environments
- Temporarily testing different API endpoints
- Switching between multiple environments

Environment variables take effect based on the current provider type:

- `kimi` type providers: Use `KIMI_*` environment variables
- `openai_legacy` or `openai_responses` type providers: Use `OPENAI_*` environment variables
- Other provider types: Environment variable overrides not supported

For the complete list of environment variables, see Environment Variables.

Example:

```bash
KIMI_API_KEY="sk-xxx" KIMI_MODEL_NAME="kimi-for-coding" kimi
```

## Configuration Priority Example

Assume the configuration file `~/.kimi/config.toml` contains the following:

```toml
default_model = "kimi-for-coding"

[providers.kimi-for-coding]
type = "kimi"
base_url = "https://api.kimi.com/coding/v1"
api_key = "sk-config"

[models.kimi-for-coding]
provider = "kimi-for-coding"
model = "kimi-for-coding"
max_context_size = 262144
```

Here are the configuration sources in different scenarios:

| Scenario | base_url | api_key | model |
|---|---|---|---|
| `kimi` | Config file | Config file | Config file |
| `KIMI_API_KEY=sk-env kimi` | Config file | Environment variable | Config file |
| `kimi --model other` | Config file | Config file | CLI parameter |
| `KIMI_MODEL_NAME=kimi-for-coding kimi` | Config file | Config file | Environment variable |
