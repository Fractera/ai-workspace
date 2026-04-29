# Qwen Code Configuration

> **Tip:** Authentication / API keys: Authentication (Qwen OAuth, Alibaba Cloud Coding Plan, or API Key) and auth-related environment variables (like `OPENAI_API_KEY`) are documented in Authentication.

> **Note on New Configuration Format:** The format of the `settings.json` file has been updated to a new, more organized structure. The old format will be migrated automatically. Qwen Code offers several ways to configure its behavior, including environment variables, command-line arguments, and settings files. This document outlines the different configuration methods and available settings.

## Configuration layers

Configuration is applied in the following order of precedence (lower numbers are overridden by higher numbers):

| Level | Configuration Source | Description |
|-------|---------------------|-------------|
| 1 | Default values | Hardcoded defaults within the application |
| 2 | System defaults file | System-wide default settings that can be overridden by other settings files |
| 3 | User settings file | Global settings for the current user |
| 4 | Project settings file | Project-specific settings |
| 5 | System settings file | System-wide settings that override all other settings files |
| 6 | Environment variables | System-wide or session-specific variables, potentially loaded from `.env` files |
| 7 | Command-line arguments | Values passed when launching the CLI |

## Settings files

Qwen Code uses JSON settings files for persistent configuration. There are four locations for these files:

| File Type | Location | Scope |
|-----------|----------|-------|
| System defaults file | Linux: `/etc/qwen-code/system-defaults.json`<br>Windows: `C:\ProgramData\qwen-code\system-defaults.json`<br>macOS: `/Library/Application Support/QwenCode/system-defaults.json`<br>The path can be overridden using the `QWEN_CODE_SYSTEM_DEFAULTS_PATH` environment variable. | Provides a base layer of system-wide default settings. These settings have the lowest precedence and are intended to be overridden by user, project, or system override settings. |
| User settings file | `~/.qwen/settings.json` (where `~` is your home directory). | Applies to all Qwen Code sessions for the current user. |
| Project settings file | `.qwen/settings.json` within your project's root directory. | Applies only when running Qwen Code from that specific project. Project settings override user settings. |
| System settings file | Linux: `/etc/qwen-code/settings.json`<br>Windows: `C:\ProgramData\qwen-code\settings.json`<br>macOS: `/Library/Application Support/QwenCode/settings.json`<br>The path can be overridden using the `QWEN_CODE_SYSTEM_SETTINGS_PATH` environment variable. | Applies to all Qwen Code sessions on the system, for all users. System settings override user and project settings. May be useful for system administrators at enterprises to have controls over users' Qwen Code setups. |

> **Note on environment variables in settings:** String values within your `settings.json` files can reference environment variables using either `$VAR_NAME` or `${VAR_NAME}` syntax. These variables will be automatically resolved when the settings are loaded. For example, if you have an environment variable `MY_API_TOKEN`, you could use it in `settings.json` like this: `"apiKey": "$MY_API_TOKEN"`.

## The .qwen directory in your project

In addition to a project settings file, a project's `.qwen` directory can contain other project-specific files related to Qwen Code's operation, such as:

- Custom sandbox profiles (e.g. `.qwen/sandbox-macos-custom.sb`, `.qwen/sandbox.Dockerfile`).
- Agent Skills under `.qwen/skills/` (each Skill is a directory containing a `SKILL.md`).

## Configuration migration

Qwen Code automatically migrates legacy configuration settings to the new format. Old settings files are backed up before migration. The following settings have been renamed from negative (`disable*`) to positive (`enable*`) naming:

| Old Setting | New Setting | Notes |
|------------|-------------|-------|
| `disableAutoUpdate` + `disableUpdateNag` | `general.enableAutoUpdate` | Consolidated into a single setting |
| `disableLoadingPhrases` | `ui.accessibility.enableLoadingPhrases` | |
| `disableFuzzySearch` | `context.fileFiltering.enableFuzzySearch` | |
| `disableCacheControl` | `model.generationConfig.enableCacheControl` | |

> **Note:** Boolean value inversion: When migrating, boolean values are inverted (e.g., `disableAutoUpdate: true` becomes `enableAutoUpdate: false`).

### Consolidation policy for disableAutoUpdate and disableUpdateNag

When both legacy settings are present with different values, the migration follows this policy: if either `disableAutoUpdate` or `disableUpdateNag` is `true`, then `enableAutoUpdate` becomes `false`:

| disableAutoUpdate | disableUpdateNag | Migrated enableAutoUpdate |
|------------------|-----------------|--------------------------|
| false | false | true |
| false | true | false |
| true | false | false |
| true | true | false |

## Available settings in settings.json

Settings are organized into categories. All settings should be placed within their corresponding top-level category object in your `settings.json` file.

### general

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `general.preferredEditor` | string | The preferred editor to open files in. | `undefined` |
| `general.vimMode` | boolean | Enable Vim keybindings. | `false` |
| `general.enableAutoUpdate` | boolean | Enable automatic update checks and installations on startup. | `true` |
| `general.gitCoAuthor` | boolean | Automatically add a `Co-authored-by` trailer to git commit messages when commits are made through Qwen Code. | `true` |
| `general.checkpointing.enabled` | boolean | Enable session checkpointing for recovery. | `false` |
| `general.defaultFileEncoding` | string | Default encoding for new files. Use `"utf-8"` (default) for UTF-8 without BOM, or `"utf-8-bom"` for UTF-8 with BOM. Only change this if your project specifically requires BOM. | `"utf-8"` |

### output

| Setting | Type | Description | Default | Possible Values |
|---------|------|-------------|---------|----------------|
| `output.format` | string | The format of the CLI output. | `"text"` | `"text"`, `"json"` |

### ui

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `ui.theme` | string | The color theme for the UI. See Themes for available options. | `undefined` |
| `ui.customThemes` | object | Custom theme definitions. | `{}` |
| `ui.statusLine` | object | Custom status line configuration. A shell command whose output is shown in the footer's left section. See Status Line. | `undefined` |
| `ui.hideWindowTitle` | boolean | Hide the window title bar. | `false` |
| `ui.hideTips` | boolean | Hide helpful tips in the UI. | `false` |
| `ui.hideBanner` | boolean | Hide the application banner. | `false` |
| `ui.hideFooter` | boolean | Hide the footer from the UI. | `false` |
| `ui.showMemoryUsage` | boolean | Display memory usage information in the UI. | `false` |
| `ui.showLineNumbers` | boolean | Show line numbers in code blocks in the CLI output. | `true` |
| `ui.showCitations` | boolean | Show citations for generated text in the chat. | `true` |
| `ui.compactMode` | boolean | Hide tool output and thinking for a cleaner view. Toggle with `Ctrl+O` during a session. When enabled, a compact indicator appears in the footer. The setting persists across sessions. | `false` |
| `enableWelcomeBack` | boolean | Show welcome back dialog when returning to a project with conversation history. When enabled, Qwen Code will automatically detect if you're returning to a project with a previously generated project summary (`.qwen/PROJECT_SUMMARY.md`) and show a dialog allowing you to continue your previous conversation or start fresh. This feature integrates with the `/summary` command and quit confirmation dialog. | `true` |
| `ui.accessibility.enableLoadingPhrases` | boolean | Enable loading phrases (disable for accessibility). | `true` |
| `ui.accessibility.screenReader` | boolean | Enables screen reader mode, which adjusts the TUI for better compatibility with screen readers. | `false` |
| `ui.customWittyPhrases` | array of strings | A list of custom phrases to display during loading states. When provided, the CLI will cycle through these phrases instead of the default ones. | `[]` |
| `ui.enableFollowupSuggestions` | boolean | Enable followup suggestions that predict what you want to type next after the model responds. Suggestions appear as ghost text and can be accepted with Tab, Enter, or Right Arrow. | `true` |
| `ui.enableCacheSharing` | boolean | Use cache-aware forked queries for suggestion generation. Reduces cost on providers that support prefix caching (experimental). | `true` |
| `ui.enableSpeculation` | boolean | Speculatively execute accepted suggestions before submission. Results appear instantly when you accept (experimental). | `false` |

### ide

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `ide.enabled` | boolean | Enable IDE integration mode. | `false` |
| `ide.hasSeenNudge` | boolean | Whether the user has seen the IDE integration nudge. | `false` |

### privacy

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `privacy.usageStatisticsEnabled` | boolean | Enable collection of usage statistics. | `true` |

### model

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `model.name` | string | The Qwen model to use for conversations. | `undefined` |
| `model.maxSessionTurns` | number | Maximum number of user/model/tool turns to keep in a session. `-1` means unlimited. | `-1` |
| `model.generationConfig` | object | Advanced overrides passed to the underlying content generator. Supports request controls such as `timeout`, `maxRetries`, `enableCacheControl`, `contextWindowSize` (override model's context window size), `modalities` (override auto-detected input modalities), `customHeaders` (custom HTTP headers for API requests), and `extra_body` (additional body parameters for OpenAI-compatible API requests only), along with fine-tuning knobs under `samplingParams` (for example `temperature`, `top_p`, `max_tokens`). Leave unset to rely on provider defaults. | `undefined` |
| `model.chatCompression.contextPercentageThreshold` | number | Sets the threshold for chat history compression as a percentage of the model's total token limit. This is a value between 0 and 1 that applies to both automatic compression and the manual `/compress` command. For example, a value of `0.6` will trigger compression when the chat history exceeds 60% of the token limit. Use `0` to disable compression entirely. | `0.7` |
| `model.skipNextSpeakerCheck` | boolean | Skip the next speaker check. | `false` |
| `model.skipLoopDetection` | boolean | Disables loop detection checks. Loop detection prevents infinite loops in AI responses but can generate false positives that interrupt legitimate workflows. Enable this option if you experience frequent false positive loop detection interruptions. | `false` |
| `model.skipStartupContext` | boolean | Skips sending the startup workspace context (environment summary and acknowledgement) at the beginning of each session. Enable this if you prefer to provide context manually or want to save tokens on startup. | `false` |
| `model.enableOpenAILogging` | boolean | Enables logging of OpenAI API calls for debugging and analysis. When enabled, API requests and responses are logged to JSON files. | `false` |
| `model.openAILoggingDir` | string | Custom directory path for OpenAI API logs. If not specified, defaults to `logs/openai` in the current working directory. Supports absolute paths, relative paths (resolved from current working directory), and `~` expansion (home directory). | `undefined` |

**Example `model.generationConfig`:**

```json
{
  "model": {
    "generationConfig": {
      "timeout": 60000,
      "contextWindowSize": 128000,
      "modalities": {
        "image": true
      },
      "enableCacheControl": true,
      "customHeaders": {
        "X-Client-Request-ID": "req-123"
      },
      "extra_body": {
        "enable_thinking": true
      },
      "samplingParams": {
        "temperature": 0.2,
        "top_p": 0.8,
        "max_tokens": 1024
      }
    }
  }
}
```

**`max_tokens` (adaptive output tokens):**

When `samplingParams.max_tokens` is not set, Qwen Code uses an adaptive output token strategy to optimize GPU resource usage:

- Requests start with a default limit of 8K output tokens
- If the response is truncated (the model hits the limit), Qwen Code automatically retries with 64K tokens
- The partial output is discarded and replaced with the full response from the retry

This is transparent to users — you may briefly see a retry indicator if escalation occurs. Since 99% of responses are under 5K tokens, the retry happens rarely (<1% of requests).

To override this behavior, either set `samplingParams.max_tokens` in your settings or use the `QWEN_CODE_MAX_OUTPUT_TOKENS` environment variable.

**`contextWindowSize`:**

Overrides the default context window size for the selected model. Qwen Code determines the context window using built-in defaults based on model name matching, with a constant fallback value. Use this setting when a provider's effective context limit differs from Qwen Code's default. This value defines the model's assumed maximum context capacity, not a per-request token limit.

**`modalities`:**

Overrides the auto-detected input modalities for the selected model. Qwen Code automatically detects supported modalities (`image`, `pdf`, `audio`, `video`) based on model name pattern matching. Use this setting when the auto-detection is incorrect — for example, to enable `pdf` for a model that supports it but isn't recognized. Format: `{ "image": true, "pdf": true, "audio": true, "video": true }`. Omit a key or set it to `false` for unsupported types.

**`customHeaders`:**

Allows you to add custom HTTP headers to all API requests. This is useful for request tracing, monitoring, API gateway routing, or when different models require different headers. If `customHeaders` is defined in `modelProviders[].generationConfig.customHeaders`, it will be used directly; otherwise, headers from `model.generationConfig.customHeaders` will be used. No merging occurs between the two levels.

**`extra_body`:**

The `extra_body` field allows you to add custom parameters to the request body sent to the API. This is useful for provider-specific options that are not covered by the standard configuration fields. Note: This field is only supported for OpenAI-compatible providers (`openai`, `qwen-oauth`). It is ignored for Anthropic and Gemini providers. If `extra_body` is defined in `modelProviders[].generationConfig.extra_body`, it will be used directly; otherwise, values from `model.generationConfig.extra_body` will be used.

**`model.openAILoggingDir` examples:**

- `"~/qwen-logs"` — Logs to `~/qwen-logs` directory
- `"./custom-logs"` — Logs to `./custom-logs` relative to current directory
- `"/tmp/openai-logs"` — Logs to absolute path `/tmp/openai-logs`

### fastModel

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `fastModel` | string | Model used for generating prompt suggestions and speculative execution. Leave empty to use the main model. A smaller/faster model (e.g., `qwen3-coder-flash`) reduces latency and cost. Can also be set via `/model --fast`. | `""` |

### context

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `context.fileName` | string or array of strings | The name of the context file(s). | `undefined` |
| `context.importFormat` | string | The format to use when importing memory. | `undefined` |
| `context.includeDirectories` | array | Additional directories to include in the workspace context. Specifies an array of additional absolute or relative paths to include in the workspace context. Missing directories will be skipped with a warning by default. Paths can use `~` to refer to the user's home directory. This setting can be combined with the `--include-directories` command-line flag. | `[]` |
| `context.loadFromIncludeDirectories` | boolean | Controls the behavior of the `/memory refresh` command. If set to `true`, `QWEN.md` files should be loaded from all directories that are added. If set to `false`, `QWEN.md` should only be loaded from the current directory. | `false` |
| `context.fileFiltering.respectGitIgnore` | boolean | Respect `.gitignore` files when searching. | `true` |
| `context.fileFiltering.respectQwenIgnore` | boolean | Respect `.qwenignore` files when searching. | `true` |
| `context.fileFiltering.enableRecursiveFileSearch` | boolean | Whether to enable searching recursively for filenames under the current tree when completing `@` prefixes in the prompt. | `true` |
| `context.fileFiltering.enableFuzzySearch` | boolean | When `true`, enables fuzzy search capabilities when searching for files. Set to `false` to improve performance on projects with a large number of files. | `true` |
| `context.gapThresholdMinutes` | number | Minutes of inactivity after which retained thinking blocks are cleared to free context tokens. Aligns with typical provider prompt-cache TTL. Set higher if your provider has a longer cache TTL. | `5` |

**Troubleshooting File Search Performance**

If you are experiencing performance issues with file searching (e.g., with `@` completions), especially in projects with a very large number of files, here are a few things you can try in order of recommendation:

1. **Use `.qwenignore`**: Create a `.qwenignore` file in your project root to exclude directories that contain a large number of files that you don't need to reference (e.g., build artifacts, logs, `node_modules`). Reducing the total number of files crawled is the most effective way to improve performance.
2. **Disable Fuzzy Search**: If ignoring files is not enough, you can disable fuzzy search by setting `enableFuzzySearch` to `false` in your `settings.json` file. This will use a simpler, non-fuzzy matching algorithm, which can be faster.
3. **Disable Recursive File Search**: As a last resort, you can disable recursive file search entirely by setting `enableRecursiveFileSearch` to `false`. This will be the fastest option as it avoids a recursive crawl of your project. However, it means you will need to type the full path to files when using `@` completions.

### tools

| Setting | Type | Description | Default | Notes |
|---------|------|-------------|---------|-------|
| `tools.sandbox` | boolean or string | Sandbox execution environment (can be a boolean or a path string). | `undefined` | |
| `tools.shell.enableInteractiveShell` | boolean | Use node-pty for an interactive shell experience. Fallback to child_process still applies. | `false` | |
| `tools.core` | array of strings | **Deprecated.** Will be removed in next version. Use `permissions.allow` + `permissions.deny` instead. Restricts built-in tools to an allowlist. All tools not in the list are disabled. | `undefined` | |
| `tools.exclude` | array of strings | **Deprecated.** Use `permissions.deny` instead. Tool names to exclude from discovery. Automatically migrated to the permissions format on first load. | `undefined` | |
| `tools.allowed` | array of strings | **Deprecated.** Use `permissions.allow` instead. Tool names that bypass the confirmation dialog. Automatically migrated to the permissions format on first load. | `undefined` | |
| `tools.approvalMode` | string | Sets the default approval mode for tool usage. | `default` | Possible values: `plan`, `default`, `auto-edit`, `yolo` |
| `tools.discoveryCommand` | string | Command to run for tool discovery. | `undefined` | |
| `tools.callCommand` | string | Defines a custom shell command for calling a specific tool that was discovered using `tools.discoveryCommand`. The shell command must take the function name as first argument, read function arguments as JSON on stdin, and return function output as JSON on stdout. | `undefined` | |
| `tools.useRipgrep` | boolean | Use ripgrep for file content search instead of the fallback implementation. Provides faster search performance. | `true` | |
| `tools.useBuiltinRipgrep` | boolean | Use the bundled ripgrep binary. When set to `false`, the system-level `rg` command will be used instead. This setting is only effective when `tools.useRipgrep` is `true`. | `true` | |
| `tools.truncateToolOutputThreshold` | number | Truncate tool output if it is larger than this many characters. Applies to Shell, Grep, Glob, ReadFile and ReadManyFiles tools. | `25000` | Requires restart |
| `tools.truncateToolOutputLines` | number | Maximum lines or entries kept when truncating tool output. Applies to Shell, Grep, Glob, ReadFile and ReadManyFiles tools. | `1000` | Requires restart |

> **Note:** Migrating from `tools.core` / `tools.exclude` / `tools.allowed`: These legacy settings are deprecated and automatically migrated to the new permissions format on first load. Prefer configuring `permissions.allow` / `permissions.deny` directly. Use `/permissions` to manage rules interactively.

### permissions

The permissions system provides fine-grained control over which tools can run, which require confirmation, and which are blocked.

**Decision priority (highest first):** `deny` > `ask` > `allow` > (default/interactive mode)

The first matching rule wins. Rules use the format `"ToolName"` or `"ToolName(specifier)"`.

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `permissions.allow` | array of strings | Rules for auto-approved tool calls (no confirmation needed). Merged across all scopes (user + project + system). | `undefined` |
| `permissions.ask` | array of strings | Rules for tool calls that always require user confirmation. Takes priority over `allow`. | `undefined` |
| `permissions.deny` | array of strings | Rules for blocked tool calls. Highest priority — overrides both `allow` and `ask`. | `undefined` |

**Tool name aliases** (any of these work in rules):

| Alias | Canonical tool | Notes |
|-------|---------------|-------|
| `Bash`, `Shell` | `run_shell_command` | |
| `Read`, `ReadFile` | `read_file` | Meta-category — see below |
| `Edit`, `EditFile` | `edit` | Meta-category — see below |
| `Write`, `WriteFile` | `write_file` | |
| `Grep`, `SearchFiles` | `grep_search` | |
| `Glob`, `FindFiles` | `glob` | |
| `ListFiles` | `list_directory` | |
| `WebFetch` | `web_fetch` | |
| `Agent` | `task` | |
| `Skill` | `skill` | |

**Meta-categories:**

| Rule name | Tools covered |
|-----------|--------------|
| `Read` | `read_file`, `grep_search`, `glob`, `list_directory` |
| `Edit` | `edit`, `write_file` |

> **Important:** `Read(/path/**)` matches all four read tools (file read, grep, glob, and directory listing). To restrict only file reading, use `ReadFile(/path/**)` or `read_file(/path/**)`.

**Rule syntax examples:**

| Rule | Meaning |
|------|---------|
| `"Bash"` | All shell commands |
| `"Bash(git *)"` | Shell commands starting with `git` (word boundary: NOT `gitk`) |
| `"Bash(git push *)"` | Shell commands like `git push origin main` |
| `"Bash(npm run *)"` | Any `npm run` script |
| `"Read"` | All file read operations (read, grep, glob, list) |
| `"Read(./secrets/**)"` | Read any file under `./secrets/` recursively |
| `"Edit(/src/**/*.ts)"` | Edit TypeScript files under project root `/src/` |
| `"WebFetch(api.example.com)"` | Fetch from `api.example.com` and all its subdomains |
| `"mcp__puppeteer"` | All tools from the puppeteer MCP server |

**Path pattern prefixes:**

| Prefix | Meaning | Example |
|--------|---------|---------|
| `//` | Absolute path from filesystem root | `//etc/passwd` |
| `~/` | Relative to home directory | `~/Documents/*.pdf` |
| `/` | Relative to project root | `/src/**/*.ts` |
| `./` | Relative to current working directory | `./secrets/**` |
| (none) | Same as `./` | `secrets/**` |

**Shell command bypass prevention:**

Permission rules for `Read`, `Edit`, and `WebFetch` are also enforced when the agent runs equivalent shell commands. For example, if `Read(./.env)` is in `deny`, the agent cannot bypass it via `cat .env` in a shell command. Supported shell commands include `cat`, `grep`, `curl`, `wget`, `cp`, `mv`, `rm`, `chmod`, and many more. Unknown/safe commands (e.g. `git`) are unaffected by file/network rules.

**Migrating from legacy settings:**

| Legacy setting | Equivalent permissions rule | Notes |
|---------------|----------------------------|-------|
| `tools.allowed` | `permissions.allow` | Auto-migrated on first load |
| `tools.exclude` | `permissions.deny` | Auto-migrated on first load |
| `tools.core` | `permissions.allow` (allowlist) | Auto-migrated; unlisted tools are disabled at registry level |

**Example configuration:**

```json
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm run *)", "Read(//Users/alice/code/**)"],
    "ask": ["Bash(git push *)", "Edit"],
    "deny": ["Bash(rm -rf *)", "Read(.env)", "WebFetch(malicious.com)"]
  }
}
```

> **Tip:** Use `/permissions` in the interactive CLI to view, add, and remove rules without editing `settings.json` directly.

### mcp

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `mcp.serverCommand` | string | Command to start an MCP server. | `undefined` |
| `mcp.allowed` | array of strings | An allowlist of MCP servers to allow. Allows you to specify a list of MCP server names that should be made available to the model. Note that this will be ignored if `--allowed-mcp-server-names` is set. | `undefined` |
| `mcp.excluded` | array of strings | A denylist of MCP servers to exclude. A server listed in both `mcp.excluded` and `mcp.allowed` is excluded. Note that this will be ignored if `--allowed-mcp-server-names` is set. | `undefined` |

> **Security Note for MCP servers:** These settings use simple string matching on MCP server names, which can be modified. If you're a system administrator looking to prevent users from bypassing this, consider configuring the `mcpServers` at the system settings level such that the user will not be able to configure any MCP servers of their own.

### lsp

> **Experimental Feature:** LSP support is currently experimental and disabled by default. Enable it using the `--experimental-lsp` command line flag.

Language Server Protocol (LSP) provides code intelligence features like go-to-definition, find references, and diagnostics.

LSP server configuration is done through `.lsp.json` files in your project root directory, not through `settings.json`. See the LSP documentation for configuration details and examples.

### security

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `security.folderTrust.enabled` | boolean | Setting to track whether Folder trust is enabled. | `false` |
| `security.auth.selectedType` | string | The currently selected authentication type. | `undefined` |
| `security.auth.enforcedType` | string | The required auth type (useful for enterprises). | `undefined` |
| `security.auth.useExternal` | boolean | Whether to use an external authentication flow. | `undefined` |

### advanced

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `advanced.autoConfigureMemory` | boolean | Automatically configure Node.js memory limits. | `false` |
| `advanced.dnsResolutionOrder` | string | The DNS resolution order. | `undefined` |
| `advanced.excludedEnvVars` | array of strings | Environment variables to exclude from project context. Specifies environment variables that should be excluded from being loaded from project `.env` files. This prevents project-specific environment variables (like `DEBUG=true`) from interfering with the CLI behavior. Variables from `.qwen/.env` files are never excluded. | `["DEBUG","DEBUG_MODE"]` |
| `advanced.bugCommand` | object | Configuration for the bug report command. Overrides the default URL for the `/bug` command. Properties: `urlTemplate` (string): A URL that can contain `{title}` and `{info}` placeholders. Example: `"bugCommand": { "urlTemplate": "https://bug.example.com/new?title={title}&info={info}" }` | `undefined` |
| `advanced.tavilyApiKey` | string | API key for Tavily web search service. Used to enable the `web_search` tool functionality. | `undefined` |

> **Note about `advanced.tavilyApiKey`:** This is a legacy configuration format. For Qwen OAuth users, DashScope provider is automatically available without any configuration. For other authentication types, configure Tavily or Google providers using the new `webSearch` configuration format.

### mcpServers

Configures connections to one or more Model-Context Protocol (MCP) servers for discovering and using custom tools. Qwen Code attempts to connect to each configured MCP server to discover available tools. If multiple MCP servers expose a tool with the same name, the tool names will be prefixed with the server alias you defined in the configuration (e.g., `serverAlias__actualToolName`) to avoid conflicts.

At least one of `command`, `url`, or `httpUrl` must be provided. If multiple are specified, the order of precedence is `httpUrl`, then `url`, then `command`.

| Property | Type | Description | Optional |
|----------|------|-------------|----------|
| `mcpServers.<SERVER_NAME>.command` | string | The command to execute to start the MCP server via standard I/O. | Yes |
| `mcpServers.<SERVER_NAME>.args` | array of strings | Arguments to pass to the command. | Yes |
| `mcpServers.<SERVER_NAME>.env` | object | Environment variables to set for the server process. | Yes |
| `mcpServers.<SERVER_NAME>.cwd` | string | The working directory in which to start the server. | Yes |
| `mcpServers.<SERVER_NAME>.url` | string | The URL of an MCP server that uses Server-Sent Events (SSE) for communication. | Yes |
| `mcpServers.<SERVER_NAME>.httpUrl` | string | The URL of an MCP server that uses streamable HTTP for communication. | Yes |
| `mcpServers.<SERVER_NAME>.headers` | object | A map of HTTP headers to send with requests to `url` or `httpUrl`. | Yes |
| `mcpServers.<SERVER_NAME>.timeout` | number | Timeout in milliseconds for requests to this MCP server. | Yes |
| `mcpServers.<SERVER_NAME>.trust` | boolean | Trust this server and bypass all tool call confirmations. | Yes |
| `mcpServers.<SERVER_NAME>.description` | string | A brief description of the server, which may be used for display purposes. | Yes |
| `mcpServers.<SERVER_NAME>.includeTools` | array of strings | List of tool names to include from this MCP server (allowlist behavior). If not specified, all tools from the server are enabled by default. | Yes |
| `mcpServers.<SERVER_NAME>.excludeTools` | array of strings | List of tool names to exclude from this MCP server. `excludeTools` takes precedence over `includeTools`. | Yes |

### telemetry

Configures logging and metrics collection for Qwen Code. For more information, see telemetry.

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `telemetry.enabled` | boolean | Whether or not telemetry is enabled. | |
| `telemetry.target` | string | The destination for collected telemetry. Supported values are `local` and `gcp`. | |
| `telemetry.otlpEndpoint` | string | The endpoint for the OTLP Exporter. | |
| `telemetry.otlpProtocol` | string | The protocol for the OTLP Exporter (`grpc` or `http`). | |
| `telemetry.logPrompts` | boolean | Whether or not to include the content of user prompts in the logs. | |
| `telemetry.outfile` | string | The file to write telemetry to when target is `local`. | |
| `telemetry.useCollector` | boolean | Whether to use an external OTLP collector. | |

## Example settings.json

```json
{
  "general": {
    "vimMode": true,
    "preferredEditor": "code"
  },
  "ui": {
    "theme": "GitHub",
    "hideTips": false,
    "customWittyPhrases": [
      "You forget a thousand things every day. Make sure this is one of 'em",
      "Connecting to AGI"
    ]
  },
  "tools": {
    "approvalMode": "yolo",
    "sandbox": "docker",
    "discoveryCommand": "bin/get_tools",
    "callCommand": "bin/call_tool",
    "exclude": ["write_file"]
  },
  "mcpServers": {
    "mainServer": {
      "command": "bin/mcp_server.py"
    },
    "anotherServer": {
      "command": "node",
      "args": ["mcp_server.js", "--verbose"]
    }
  },
  "telemetry": {
    "enabled": true,
    "target": "local",
    "otlpEndpoint": "http://localhost:4317",
    "logPrompts": true
  },
  "privacy": {
    "usageStatisticsEnabled": true
  },
  "model": {
    "name": "qwen3-coder-plus",
    "maxSessionTurns": 10,
    "enableOpenAILogging": false,
    "openAILoggingDir": "~/qwen-logs"
  },
  "context": {
    "fileName": ["CONTEXT.md", "QWEN.md"],
    "includeDirectories": ["path/to/dir1", "~/path/to/dir2", "../path/to/dir3"],
    "loadFromIncludeDirectories": true,
    "fileFiltering": {
      "respectGitIgnore": false
    }
  },
  "advanced": {
    "excludedEnvVars": ["DEBUG", "DEBUG_MODE", "NODE_ENV"]
  }
}
```

## Shell History

The CLI keeps a history of shell commands you run. To avoid conflicts between different projects, this history is stored in a project-specific directory within your user's home folder.

- **Location**: `~/.qwen/tmp/<project_hash>/shell_history`
- `<project_hash>` is a unique identifier generated from your project's root path.
- The history is stored in a file named `shell_history`.

## Environment Variables & .env Files

Environment variables are a common way to configure applications, especially for sensitive information (like tokens) or for settings that might change between environments.

Qwen Code can automatically load environment variables from `.env` files. For authentication-related variables (like `OPENAI_*`) and the recommended `.qwen/.env` approach, see Authentication.

> **Tip:** Some environment variables (like `DEBUG` and `DEBUG_MODE`) are automatically excluded from project `.env` files by default to prevent interference with the CLI behavior. Variables from `.qwen/.env` files are never excluded. You can customize this behavior using the `advanced.excludedEnvVars` setting in your `settings.json` file.

### Environment Variables Table

| Variable | Description | Notes |
|----------|-------------|-------|
| `QWEN_TELEMETRY_ENABLED` | Set to `true` or `1` to enable telemetry. Any other value is treated as disabling it. | Overrides the `telemetry.enabled` setting. |
| `QWEN_TELEMETRY_TARGET` | Sets the telemetry target (`local` or `gcp`). | Overrides the `telemetry.target` setting. |
| `QWEN_TELEMETRY_OTLP_ENDPOINT` | Sets the OTLP endpoint for telemetry. | Overrides the `telemetry.otlpEndpoint` setting. |
| `QWEN_TELEMETRY_OTLP_PROTOCOL` | Sets the OTLP protocol (`grpc` or `http`). | Overrides the `telemetry.otlpProtocol` setting. |
| `QWEN_TELEMETRY_LOG_PROMPTS` | Set to `true` or `1` to enable or disable logging of user prompts. | Overrides the `telemetry.logPrompts` setting. |
| `QWEN_TELEMETRY_OUTFILE` | Sets the file path to write telemetry to when the target is `local`. | Overrides the `telemetry.outfile` setting. |
| `QWEN_TELEMETRY_USE_COLLECTOR` | Set to `true` or `1` to enable or disable using an external OTLP collector. | Overrides the `telemetry.useCollector` setting. |
| `QWEN_SANDBOX` | Alternative to the `sandbox` setting in `settings.json`. | Accepts `true`, `false`, `docker`, `podman`, or a custom command string. |
| `SEATBELT_PROFILE` | (macOS specific) Switches the Seatbelt (`sandbox-exec`) profile on macOS. | `permissive-open` (default): restricts writes to the project folder. `strict`: uses a strict profile. `<profile_name>`: uses a custom profile defined in `.qwen/sandbox-macos-<profile_name>.sb`. |
| `DEBUG` or `DEBUG_MODE` | Set to `true` or `1` to enable verbose debug logging. | Automatically excluded from project `.env` files by default. Use `.qwen/.env` files if needed for Qwen Code specifically. |
| `NO_COLOR` | Set to any value to disable all color output in the CLI. | |
| `CLI_TITLE` | Set to a string to customize the title of the CLI. | |
| `CODE_ASSIST_ENDPOINT` | Specifies the endpoint for the code assist server. | Useful for development and testing. |
| `QWEN_CODE_MAX_OUTPUT_TOKENS` | Overrides the default maximum output tokens per response. When not set, Qwen Code uses an adaptive strategy: starts with 8K tokens and automatically retries with 64K if the response is truncated. | Takes precedence over the capped default (8K) but is overridden by `samplingParams.max_tokens` in settings. Disables automatic escalation when set. Example: `export QWEN_CODE_MAX_OUTPUT_TOKENS=16000` |
| `TAVILY_API_KEY` | Your API key for the Tavily web search service. | Used to enable the `web_search` tool functionality. Example: `export TAVILY_API_KEY="tvly-your-api-key-here"` |

## Command-Line Arguments

Arguments passed directly when running the CLI can override other configurations for that specific session.

| Argument | Alias | Description | Possible Values | Notes |
|----------|-------|-------------|----------------|-------|
| `--model` | `-m` | Specifies the Qwen model to use for this session. | Model name | Example: `npm start -- --model qwen3-coder-plus` |
| `--prompt` | `-p` | Used to pass a prompt directly to the command. This invokes Qwen Code in a non-interactive mode. | Your prompt text | |
| `--prompt-interactive` | `-i` | Starts an interactive session with the provided prompt as the initial input. | Your prompt text | Cannot be used when piping input from stdin. |
| `--system-prompt` | | Overrides the built-in main session system prompt for this run. | Your prompt text | Loaded context files such as `QWEN.md` are still appended after this override. |
| `--append-system-prompt` | | Appends extra instructions to the main session system prompt for this run. | Your prompt text | Applied after the built-in prompt and loaded context files. |
| `--output-format` | `-o` | Specifies the format of the CLI output for non-interactive mode. | `text`, `json`, `stream-json` | |
| `--input-format` | | Specifies the format consumed from standard input. | `text`, `stream-json` | `stream-json` requires `--output-format stream-json` to be set. |
| `--include-partial-messages` | | Include partial assistant messages when using `stream-json` output format. | | Requires `--output-format stream-json`. |
| `--sandbox` | `-s` | Enables sandbox mode for this session. | | |
| `--sandbox-image` | | Sets the sandbox image URI. | | |
| `--debug` | `-d` | Enables debug mode for this session, providing more verbose output. | | |
| `--all-files` | `-a` | If set, recursively includes all files within the current directory as context for the prompt. | | |
| `--help` | `-h` | Displays help information about command-line arguments. | | |
| `--show-memory-usage` | | Displays the current memory usage. | | |
| `--yolo` | | Enables YOLO mode, which automatically approves all tool calls. | | |
| `--approval-mode` | | Sets the approval mode for tool calls. | `plan`, `default`, `auto-edit`, `yolo` | Cannot be used together with `--yolo`. |
| `--allowed-tools` | | A comma-separated list of tool names that will bypass the confirmation dialog. | Tool names | Example: `qwen --allowed-tools "Shell(git status)"` |
| `--telemetry` | | Enables telemetry. | | |
| `--telemetry-target` | | Sets the telemetry target. | | |
| `--telemetry-otlp-endpoint` | | Sets the OTLP endpoint for telemetry. | | |
| `--telemetry-otlp-protocol` | | Sets the OTLP protocol for telemetry (`grpc` or `http`). | | Defaults to `grpc`. |
| `--telemetry-log-prompts` | | Enables logging of prompts for telemetry. | | |
| `--checkpointing` | | Enables checkpointing. | | |
| `--acp` | | Enables ACP mode (Agent Client Protocol). Useful for IDE/editor integrations like Zed. | | Stable. Replaces the deprecated `--experimental-acp` flag. |
| `--experimental-lsp` | | Enables experimental LSP feature for code intelligence. | | Experimental. Requires language servers to be installed. |
| `--extensions` | `-e` | Specifies a list of extensions to use for the session. | Extension names | Use `qwen -e none` to disable all extensions. |
| `--list-extensions` | `-l` | Lists all available extensions and exits. | | |
| `--proxy` | | Sets the proxy for the CLI. | Proxy URL | Example: `--proxy http://localhost:7890` |
| `--include-directories` | | Includes additional directories in the workspace. Can be specified multiple times or as comma-separated values. Max 5 directories. | Directory paths | |
| `--screen-reader` | | Enables screen reader mode. | | |
| `--version` | | Displays the version of the CLI. | | |
| `--openai-logging` | | Enables logging of OpenAI API calls for debugging and analysis. | | Overrides the `enableOpenAILogging` setting in `settings.json`. |
| `--openai-logging-dir` | | Sets a custom directory path for OpenAI API logs. | Directory path | Supports absolute paths, relative paths, and `~` expansion. |
| `--tavily-api-key` | | Sets the Tavily API key for web search functionality for this session. | API key | |

## Context Files (Hierarchical Instructional Context)

Context files (defaulting to `QWEN.md` but configurable via the `context.fileName` setting) allow you to give project-specific instructions, coding style guides, or any relevant background information to the AI, making its responses more tailored and accurate to your needs. The CLI footer displays the count of loaded context files.

**Purpose:** These Markdown files contain instructions, guidelines, or context that you want the Qwen model to be aware of during your interactions.

**Example Context File Content (`QWEN.md`)**

```markdown
# Project: My Awesome TypeScript Library
## General Instructions:
- When generating new TypeScript code, please follow the existing coding style.
- Ensure all new functions and classes have JSDoc comments.
- Prefer functional programming paradigms where appropriate.
- All code should be compatible with TypeScript 5.0 and Node.js 20+.
## Coding Style:
- Use 2 spaces for indentation.
- Interface names should be prefixed with `I` (e.g., `IUserService`).
- Private class members should be prefixed with an underscore (`_`).
- Always use strict equality (`===` and `!==`).
## Specific Component: `src/api/client.ts`
- This file handles all outbound API requests.
- When adding new API call functions, ensure they include robust error handling and logging.
- Use the existing `fetchWithRetry` utility for all GET requests.
## Regarding Dependencies:
- Avoid introducing new external dependencies unless absolutely necessary.
- If a new dependency is required, please state the reason.
```

**Hierarchical Loading and Precedence:**

The CLI implements a hierarchical memory system by loading context files from several locations. Content from files lower in this list (more specific) typically overrides or supplements content from files higher up (more general). The exact concatenation order and final context can be inspected using the `/memory show` command.

1. **Global Context File**: `~/.qwen/<configured-context-filename>` — Provides default instructions for all your projects.
2. **Project Root & Ancestors Context Files**: The CLI searches for the configured context file in the current working directory and then in each parent directory up to either the project root (identified by a `.git` folder) or your home directory.

**Importing Content:** You can modularize your context files by importing other Markdown files using the `@path/to/file.md` syntax.

**Commands for Memory Management:**

- Use `/memory refresh` to force a re-scan and reload of all context files from all configured locations.
- Use `/memory show` to display the combined instructional context currently loaded.

## Sandbox

Qwen Code can execute potentially unsafe operations (like shell commands and file modifications) within a sandboxed environment to protect your system.

Sandbox is disabled by default, but you can enable it in a few ways:

- Using `--sandbox` or `-s` flag.
- Setting `QWEN_SANDBOX` environment variable.
- Sandbox is enabled when using `--yolo` or `--approval-mode=yolo` by default.

By default, it uses a pre-built `qwen-code-sandbox` Docker image.

For project-specific sandboxing needs, you can create a custom Dockerfile at `.qwen/sandbox.Dockerfile` in your project's root directory:

```dockerfile
FROM qwen-code-sandbox
# Add your custom dependencies or configurations here
# For example:
# RUN apt-get update && apt-get install -y some-package
# COPY ./my-config /app/my-config
```

When `.qwen/sandbox.Dockerfile` exists, you can use `BUILD_SANDBOX` environment variable when running Qwen Code to automatically build the custom sandbox image:

```bash
BUILD_SANDBOX=1 qwen -s
```

## Usage Statistics

To help improve Qwen Code, anonymized usage statistics are collected. This data helps understand how the CLI is used, identify common issues, and prioritize new features.

**What is collected:**

- **Tool Calls**: Names of tools called, whether they succeed or fail, and execution time. Arguments and return data are not collected.
- **API Requests**: Model used, request duration, and success status. Prompt and response content are not collected.
- **Session Information**: Configuration details such as enabled tools and approval mode.

**What is NOT collected:**

- Personally Identifiable Information (PII): No names, email addresses, or API keys.
- Prompt and Response Content.
- File Content.

**How to opt out:**

```json
{
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```

> **Note:** When usage statistics are enabled, events are sent to an Alibaba Cloud RUM collection endpoint.
