# TUI

Using the OpenCode terminal user interface.

OpenCode provides an interactive terminal interface or TUI for working on your projects with an LLM.

Running OpenCode starts the TUI for the current directory.

```bash
opencode
```

Or you can start it for a specific working directory.

```bash
opencode /path/to/project
```

Once you're in the TUI, you can prompt it with a message.

```
Give me a quick summary of the codebase.
```

## File references

You can reference files in your messages using `@`. This does a fuzzy file search in the current working directory.

> **Tip:** You can also use `@` to reference files in your messages.

```
How is auth handled in @packages/functions/src/api/index.ts?
```

The content of the file is added to the conversation automatically.

## Bash commands

Start a message with `!` to run a shell command.

```
!ls -la
```

The output of the command is added to the conversation as a tool result.

## Commands

When using the OpenCode TUI, you can type `/` followed by a command name to quickly execute actions. For example:

```
/help
```

Most commands also have a keybind using `ctrl+x` as the leader key, where `ctrl+x` is the default leader key.

Here are all available slash commands:

### connect

Add a provider to OpenCode. Allows you to select from available providers and add their API keys.

```
/connect
```

### compact

Compact the current session. Alias: `/summarize`

```
/compact
```

Keybind: `ctrl+x c`

### details

Toggle tool execution details.

```
/details
```

Keybind: `ctrl+x d`

### editor

Open external editor for composing messages. Uses the editor set in your `EDITOR` environment variable.

```
/editor
```

Keybind: `ctrl+x e`

### exit

Exit OpenCode. Aliases: `/quit`, `/q`

```
/exit
```

Keybind: `ctrl+x q`

### export

Export current conversation to Markdown and open in your default editor. Uses the editor set in your `EDITOR` environment variable.

```
/export
```

Keybind: `ctrl+x x`

### help

Show the help dialog.

```
/help
```

Keybind: `ctrl+x h`

### init

Guided setup for creating or updating `AGENTS.md`.

```
/init
```

Keybind: `ctrl+x i`

### models

List available models.

```
/models
```

Keybind: `ctrl+x m`

### new

Start a new session. Alias: `/clear`

```
/new
```

Keybind: `ctrl+x n`

### redo

Redo a previously undone message. Only available after using `/undo`.

> **Tip:** Any file changes will also be restored.
>
> Internally, this uses Git to manage the file changes. So your project needs to be a Git repository.

```
/redo
```

Keybind: `ctrl+x r`

### sessions

List and switch between sessions. Aliases: `/resume`, `/continue`

```
/sessions
```

Keybind: `ctrl+x l`

### share

Share current session.

```
/share
```

Keybind: `ctrl+x s`

### themes

List available themes.

```
/themes
```

Keybind: `ctrl+x t`

### thinking

Toggle the visibility of thinking/reasoning blocks in the conversation. When enabled, you can see the model's reasoning process for models that support extended thinking.

> **Note:** This command only controls whether thinking blocks are displayed — it does not enable or disable the model's reasoning capabilities. To toggle actual reasoning capabilities, use `ctrl+t` to cycle through model variants.

```
/thinking
```

### undo

Undo last message in the conversation. Removes the most recent user message, all subsequent responses, and any file changes.

> **Tip:** Any file changes made will also be reverted.
>
> Internally, this uses Git to manage the file changes. So your project needs to be a Git repository.

```
/undo
```

Keybind: `ctrl+x u`

### unshare

Unshare current session.

```
/unshare
```

## Editor setup

Both the `/editor` and `/export` commands use the editor specified in your `EDITOR` environment variable.

**Linux/macOS:**

```bash
# Example for nano or vim
export EDITOR=nano
export EDITOR=vim

# For GUI editors (VS Code, Cursor, VSCodium, Windsurf, Zed, etc.)
# include --wait
export EDITOR="code --wait"
```

To make it permanent, add this to your shell profile: `~/.bashrc`, `~/.zshrc`, etc.

Popular editor options include:

- `code` — Visual Studio Code
- `cursor` — Cursor
- `windsurf` — Windsurf
- `nvim` — Neovim editor
- `vim` — Vim editor
- `nano` — Nano editor
- `notepad` — Windows Notepad
- `subl` — Sublime Text

> **Note:** Some editors like VS Code need to be started with the `--wait` flag.
>
> Some editors need command-line arguments to run in blocking mode. The `--wait` flag makes the editor process block until closed.

## Configure

You can customize TUI behavior through `tui.json` (or `tui.jsonc`).

```json
// tui.json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "opencode",
  "keybinds": {
    "leader": "ctrl+x"
  },
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": true
  },
  "diff_style": "auto",
  "mouse": true
}
```

This is separate from `opencode.json`, which configures server/runtime behavior.

### Options

- `theme` — Sets your UI theme.
- `keybinds` — Customizes keyboard shortcuts.
- `scroll_acceleration.enabled` — Enable macOS-style scroll acceleration for smooth, natural scrolling. When enabled, scroll speed increases with rapid scrolling gestures and stays precise for slower movements. This setting takes precedence over `scroll_speed` and overrides it when enabled.
- `scroll_speed` — Controls how fast the TUI scrolls when using scroll commands (minimum: 0.001, supports decimal values). Defaults to `3`. Note: This is ignored if `scroll_acceleration.enabled` is set to `true`.
- `diff_style` — Controls diff rendering. `"auto"` adapts to terminal width, `"stacked"` always shows a single-column layout.
- `mouse` — Enable or disable mouse capture in the TUI (default: `true`). When disabled, the terminal's native mouse selection/scrolling behavior is preserved.

Use `OPENCODE_TUI_CONFIG` to load a custom TUI config path.

## Customization

You can customize various aspects of the TUI view using the command palette (`ctrl+x h` or `/help`). These settings persist across restarts.
