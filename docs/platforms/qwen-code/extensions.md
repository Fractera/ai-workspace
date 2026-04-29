# Qwen Code Extensions

Qwen Code extensions package prompts, MCP servers, subagents, skills and custom commands into a familiar and user-friendly format. With extensions, you can expand the capabilities of Qwen Code and share those capabilities with others. They are designed to be easily installable and shareable.

Extensions and plugins from Gemini CLI Extensions Gallery and Claude Code Marketplace can be directly installed into Qwen Code. This cross-platform compatibility gives you access to a rich ecosystem of extensions and plugins, dramatically expanding Qwen Code's capabilities without requiring extension authors to maintain separate versions.

## Extension management

Qwen Code offers a suite of extension management tools using both `qwen extensions` CLI commands and `/extensions` slash commands within the interactive CLI.

### Runtime Extension Management (Slash Commands)

These commands support hot-reloading — changes take effect immediately without restarting the application.

| Command | Description |
|---------|-------------|
| `/extensions` or `/extensions manage` | Manage all installed extensions |
| `/extensions install <source>` | Install an extension from a git URL, local path, npm package, or marketplace |
| `/extensions explore [source]` | Open extensions source page (Gemini or ClaudeCode) in your browser |

### CLI Extension Management

Changes made via CLI commands will be reflected in active CLI sessions on restart.

## Installing an extension

### From Claude Code Marketplace

```bash
qwen extensions install <marketplace-name>
# or
qwen extensions install <marketplace-github-url>
```

To install a specific plugin:

```bash
qwen extensions install <marketplace-name>:<plugin-name>
# or
qwen extensions install <marketplace-github-url>:<plugin-name>
```

Example — install the `prompts.chat` plugin from `f/awesome-chatgpt-prompts`:

```bash
qwen extensions install f/awesome-chatgpt-prompts:prompts.chat
# or
qwen extensions install https://github.com/f/awesome-chatgpt-prompts:prompts.chat
```

Claude plugins are automatically converted to Qwen Code format during installation:

- `claude-plugin.json` is converted to `qwen-extension.json`
- Agent configurations are converted to Qwen subagent format
- Skill configurations are converted to Qwen skill format
- Tool mappings are automatically handled

Browse available extensions:

```bash
# Open Gemini CLI Extensions marketplace
/extensions explore Gemini

# Open Claude Code marketplace
/extensions explore ClaudeCode
```

### From Gemini CLI Extensions

```bash
qwen extensions install <gemini-cli-extension-github-url>
# or
qwen extensions install <owner>/<repo>
```

Gemini extensions are automatically converted to Qwen Code format during installation:

- `gemini-extension.json` is converted to `qwen-extension.json`
- TOML command files are automatically migrated to Markdown format
- MCP servers, context files, and settings are preserved

### From npm Registry

```bash
# Install the latest version
qwen extensions install @scope/my-extension

# Install a specific version
qwen extensions install @scope/my-extension@1.2.0

# Install from a custom registry
qwen extensions install @scope/my-extension --registry https://your-registry.com
```

Only scoped packages (`@scope/package-name`) are supported. Registry resolution priority:

1. `--registry` CLI flag (explicit override)
2. Scoped registry from `.npmrc` (e.g. `@scope:registry=https://...`)
3. Default registry from `.npmrc`
4. Fallback: `https://registry.npmjs.org/`

Authentication is handled automatically via the `NPM_TOKEN` environment variable or registry-specific `_authToken` entries in your `.npmrc` file.

> **Note:** npm extensions must include a `qwen-extension.json` file at the package root.

### From Git Repository

```bash
qwen extensions install https://github.com/github/github-mcp-server
```

### From Local Path

```bash
qwen extensions install /path/to/your/extension
```

> **Note:** A copy of the installed extension is created. Run `qwen extensions update` to pull in changes.

## Uninstalling an extension

```bash
qwen extensions uninstall extension-name
```

## Disabling an extension

```bash
# Disable everywhere (user level)
qwen extensions disable extension-name

# Disable only in current workspace
qwen extensions disable extension-name --scope=workspace
```

## Enabling an extension

```bash
# Enable at user level
qwen extensions enable extension-name

# Enable only in specific workspace
qwen extensions enable extension-name --scope=workspace
```

## Updating an extension

```bash
# Update a specific extension
qwen extensions update extension-name

# Update all extensions
qwen extensions update --all
```

For npm extensions installed without a version pin, updates check the latest `dist-tag`. Extensions pinned to an exact version are always considered up-to-date.

## How it works

On startup, Qwen Code looks for extensions in `<home>/.qwen/extensions`.

Extensions exist as a directory containing a `qwen-extension.json` file:

```
<home>/.qwen/extensions/my-extension/qwen-extension.json
```

### qwen-extension.json

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "mcpServers": {
    "my-server": {
      "command": "node my-server.js"
    }
  },
  "channels": {
    "my-platform": {
      "entry": "dist/index.js",
      "displayName": "My Platform Channel"
    }
  },
  "contextFileName": "QWEN.md",
  "commands": "commands",
  "skills": "skills",
  "agents": "agents",
  "settings": [
    {
      "name": "API Key",
      "description": "Your API key for the service",
      "envVar": "MY_API_KEY",
      "sensitive": true
    }
  ]
}
```

Fields:

- `name` — Unique identifier. Lowercase, numbers, dashes. Must match the extension directory name.
- `version` — Extension version.
- `mcpServers` — Map of MCP servers to configure. If both an extension and `settings.json` configure an MCP server with the same name, `settings.json` takes precedence. The `trust` option is not supported.
- `channels` — Map of custom channel adapters. `entry` is the path to a compiled JS entry point that exports a `ChannelPlugin` object.
- `contextFileName` — The context file to load from the extension directory. If omitted but `QWEN.md` is present, it is loaded automatically.
- `commands` — Directory containing custom commands (default: `commands`).
- `skills` — Directory containing custom skills (default: `skills`).
- `agents` — Directory containing custom subagents (default: `agents`).
- `settings` — Array of required settings. Each has `name`, `description`, `envVar`, and `sensitive` (boolean).

## Managing Extension Settings

```bash
# Set a setting value
qwen extensions settings set <extension-name> <setting-name> [--scope user|workspace]

# List all settings for an extension
qwen extensions settings list <extension-name>

# View current values
qwen extensions settings show <extension-name> <setting-name>

# Remove a setting value
qwen extensions settings unset <extension-name> <setting-name> [--scope user|workspace]
```

Settings levels:

- **User level** (default): applies across all projects (`~/.qwen/.env`)
- **Workspace level**: applies only to the current project (`.qwen/.env`)

Workspace settings take precedence over user settings. Sensitive settings are never displayed in plain text.

## Custom commands

Extensions can provide custom commands by placing Markdown files in a `commands/` subdirectory.

> **Note:** The command format has been updated from TOML to Markdown. TOML files are deprecated but still supported.

Example structure:

```
.qwen/extensions/gcp/
├── qwen-extension.json
└── commands/
    ├── deploy.md
    └── gcs/
        └── sync.md
```

Provides commands:

- `/deploy` — Shows as `[gcp] Custom command from deploy.md` in help
- `/gcs:sync` — Shows as `[gcp] Custom command from sync.md` in help

## Custom skills

```
.qwen/extensions/my-extension/
├── qwen-extension.json
└── skills/
    └── pdf-processor/
        └── SKILL.md
```

The skill becomes available via the `/skills` command when the extension is active.

## Custom subagents

```
.qwen/extensions/my-extension/
├── qwen-extension.json
└── agents/
    └── testing-expert.yaml
```

Extension subagents appear in the subagent manager dialog under "Extension Agents" section.

## Conflict resolution

Extension commands have the lowest precedence. When a conflict occurs with user or project commands:

- **No conflict**: Extension command uses its natural name (e.g., `/deploy`)
- **With conflict**: Extension command is renamed with the extension prefix (e.g., `/gcp.deploy`)

## Variables

Variable substitution is supported in `qwen-extension.json`:

| Variable | Description |
|----------|-------------|
| `${extensionPath}` | The fully-qualified path of the extension in the user's filesystem |
| `${workspacePath}` | The fully-qualified path of the current workspace |
| `${/}` or `${pathSeparator}` | The path separator (differs per OS) |
