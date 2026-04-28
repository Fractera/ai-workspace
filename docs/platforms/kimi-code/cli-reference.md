# Kimi Code — kimi Command Reference

`kimi` is the main command for Kimi Code CLI, used to start interactive sessions or execute single queries.

```bash
kimi [OPTIONS] COMMAND [ARGS]
```

## Basic Information

| Option | Short | Description |
|---|---|---|
| `--version` | `-V` | Show version number and exit |
| `--help` | `-h` | Show help message and exit |
| `--verbose` | | Output detailed runtime information |
| `--debug` | | Log debug information (output to `~/.kimi/logs/kimi.log`) |

## Agent Configuration

| Option | Description |
|---|---|
| `--agent NAME` | Use built-in Agent, options: `default`, `okabe` |
| `--agent-file PATH` | Use custom Agent file |

`--agent` and `--agent-file` are mutually exclusive and cannot be used together. See Agent and Subagents for details.

## Configuration Files

| Option | Description |
|---|---|
| `--config STRING` | Load TOML/JSON configuration string |
| `--config-file PATH` | Load configuration file (default `~/.kimi/config.toml`) |

`--config` and `--config-file` are mutually exclusive. Both configuration strings and files support TOML and JSON formats. See Config Files for details.

## Model Selection

| Option | Short | Description |
|---|---|---|
| `--model NAME` | `-m` | Specify LLM model, overrides the default model in the config file |

## Working Directory

| Option | Short | Description |
|---|---|---|
| `--work-dir PATH` | `-w` | Specify working directory (default: current directory) |
| `--add-dir PATH` | | Add an additional directory to the workspace scope, can be specified multiple times |

The working directory determines the root directory for file operations. Relative paths work within the working directory; absolute paths are required to access files outside it.

`--add-dir` expands the workspace scope to include directories outside the working directory, making all file tools able to access files in those directories. Added directories are persisted with the session state. You can also add directories at runtime via the `/add-dir` slash command.

## Session Management

| Option | Short | Description |
|---|---|---|
| `--continue` | `-C` | Continue the previous session in the current working directory |
| `--session [ID]` / `--resume [ID]` | `-S` / `-r` | Resume a session. With ID: resume that session (creates new if not found); Without ID: open interactive session selector (Shell mode only) |

`--continue` and `--session`/`--resume` are mutually exclusive.

## Input and Commands

| Option | Short | Description |
|---|---|---|
| `--prompt TEXT` | `-p` | Pass user prompt, does not enter interactive mode |
| `--command TEXT` | `-c` | Alias for `--prompt` |

When using `--prompt` (or `--command`), Kimi Code CLI exits after processing the query (unless `--print` is specified, results are still displayed in interactive mode).

## Loop Control

| Option | Description |
|---|---|
| `--max-steps-per-turn N` | Maximum steps per turn, overrides `loop_control.max_steps_per_turn` in the config file |
| `--max-retries-per-step N` | Maximum retries per step, overrides `loop_control.max_retries_per_step` in the config file |
| `--max-ralph-iterations N` | Number of iterations for Ralph loop mode; 0 disables; -1 is unlimited |

### Ralph Loop

Ralph is a technique that puts an Agent in a loop: the same prompt is fed again and again so the Agent can keep iterating on one big task.

When `--max-ralph-iterations` is not 0, Kimi Code CLI enters Ralph loop mode and automatically loops through task execution until the Agent outputs `<choice>STOP</choice>` or the iteration limit is reached.

## UI Modes

| Option | Description |
|---|---|
| `--print` | Run in print mode (non-interactive), implicitly enables `--yolo` |
| `--quiet` | Shortcut for `--print --output-format text --final-message-only` |
| `--acp` | Run in ACP server mode (deprecated, use `kimi acp` instead) |
| `--wire` | Run in Wire server mode (experimental) |

The four options are mutually exclusive; only one can be selected. The default is Shell mode. See Print Mode and Wire Mode for details.

## Print Mode Options

The following options are only effective in `--print` mode:

| Option | Description |
|---|---|
| `--input-format FORMAT` | Input format: `text` (default) or `stream-json` |
| `--output-format FORMAT` | Output format: `text` (default) or `stream-json` |
| `--final-message-only` | Only output the final assistant message |

The `stream-json` format uses JSONL (one JSON object per line) for programmatic integration.

## MCP Configuration

| Option | Description |
|---|---|
| `--mcp-config-file PATH` | Load MCP configuration file, can be specified multiple times |
| `--mcp-config JSON` | Load MCP configuration JSON string, can be specified multiple times |

The default loads `~/.kimi/mcp.json` (if it exists). See Model Context Protocol for details.

## Approval Control

| Option | Short | Description |
|---|---|---|
| `--yolo` | `-y` | Auto-approve all operations |
| `--yes` | | Alias for `--yolo` |
| `--auto-approve` | | Alias for `--yolo` |

> **Note:** In YOLO mode, all file modifications and Shell commands are automatically executed. Please use with caution.

## Plan Mode

| Option | Description |
|---|---|
| `--plan` | Start in plan mode |

When started with `--plan`, the AI can only use read-only tools to explore the codebase and write an implementation plan. When resuming an existing session, `--plan` forces plan mode on; resuming without `--plan` preserves the session's existing state.

You can also set `default_plan_mode = true` in the configuration file to start new sessions in plan mode by default. See Config Files.

## Thinking Mode

| Option | Description |
|---|---|
| `--thinking` | Enable thinking mode |
| `--no-thinking` | Disable thinking mode |

Thinking mode requires model support. If not specified, the last session's setting is used.

## Skills Configuration

| Option | Description |
|---|---|
| `--skills-dir PATH` | Append additional skills directories (repeatable) |

When not specified, Kimi Code CLI automatically discovers user-level and project-level skills directories in priority order. See Agent Skills for details.

## Subcommands

| Subcommand | Description |
|---|---|
| `kimi login` | Log in to your Kimi account |
| `kimi logout` | Log out from your Kimi account |
| `kimi info` | Display version and protocol information |
| `kimi acp` | Start multi-session ACP server |
| `kimi mcp` | Manage MCP server configuration |
| `kimi term` | Launch the Toad terminal UI |
| `kimi export` | Export a session as a ZIP file |
| `kimi vis` | Launch Agent Tracing Visualizer (Technical Preview) |
| `kimi web` | Start the Web UI server |

### kimi login

Log in to your Kimi account. After execution, a browser is automatically opened; complete account authorization and available models will be automatically configured.

```bash
kimi login
```

### kimi logout

Log out from your Kimi account. This clears stored OAuth credentials and removes related configuration from the config file.

```bash
kimi logout
```

### kimi export

Export session data as a ZIP file. The ZIP contains all files in the session directory (`context.jsonl`, `wire.jsonl`, `state.json`, etc.).

```bash
kimi export [<session_id>] [-o <output_path>] [--yes]
```

| Parameter / Option | Description |
|---|---|
| `<session_id>` | Session ID to export. If omitted, the CLI previews and confirms the previous session for the current working directory before exporting |
| `--output, -o` | Output ZIP file path (defaults to `session-<id>.zip` in the current directory) |
| `--yes, -y` | Skip the confirmation prompt for the default session and export directly |

### kimi vis

> **Note:** Technical Preview feature, may be unstable.

Launch Agent Tracing Visualizer to view and analyze session trace data through a browser.

```bash
kimi vis [OPTIONS]
```

| Option | Short | Description |
|---|---|---|
| `--port INTEGER` | `-p` | Port number to bind to (default: 5495) |
| `--open` / `--no-open` | | Automatically open browser (default: enabled) |
| `--reload` | | Enable auto-reload (development mode) |

### kimi web

Start the Web UI server to access Kimi Code CLI through a browser.

```bash
kimi web [OPTIONS]
```

If the default port is in use, the server automatically tries the next available port (default range 5494–5503) and prints a notice in the terminal.

| Option | Short | Description |
|---|---|---|
| `--host TEXT` | `-h` | Host address to bind to (default: `127.0.0.1`) |
| `--port INTEGER` | `-p` | Port number to bind to (default: 5494) |
| `--reload` | | Enable auto-reload (development mode) |
| `--open` / `--no-open` | | Automatically open browser (default: enabled) |

Examples:

```bash
# Default startup, automatically opens browser
kimi web

# Specify port
kimi web --port 8080

# Do not automatically open browser
kimi web --no-open

# Bind to all network interfaces (allow LAN access)
kimi web --host 0.0.0.0
```
