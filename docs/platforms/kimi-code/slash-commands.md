# Kimi Code — Slash Commands Quick Reference

Type a `/` command in the input box to trigger it. After typing `/`, a completion menu is displayed for filtering and selection. Continue typing for fuzzy matching, then press Enter to select. For example, `/ses` matches `/sessions`, and `/h` matches `/help`.

Some slash commands are also available in shell mode: `/help`, `/version`, `/editor`, `/theme`, `/changelog`, `/feedback`, `/export`, `/import`, and `/task`.

## Command Reference

| Command | Purpose |
|---|---|
| `/help` | Display help information (keyboard shortcuts, slash commands, loaded Skills). Aliases: `/h`, `/?`. Press `q` to exit the pager |
| `/version` | Display the version number |
| `/changelog` | Display recent version changelog. Alias: `/release-notes` |
| `/feedback` | Submit feedback. Automatically falls back to GitHub Issues when the network request fails |
| `/login` | Log in or configure an API platform. Kimi Code automatically performs OAuth authorization; other platforms require entering an API key. After completion, automatically saves to `~/.kimi/config.toml` and reloads. Alias: `/setup`. Only available when using the default config file |
| `/logout` | Log out from the current platform, clear credentials, and remove configuration |
| `/model` | Switch model and Thinking mode. First refreshes the model list from the API platform, then interactively selects and automatically updates the configuration and reloads. Only available when using the default config file |
| `/editor` | Set the external editor. When called without arguments, interactively selects; you can also specify directly, e.g., `/editor vim`. After configuration, Ctrl-O uses this editor |
| `/theme` | Switch terminal color theme. `/theme dark` or `/theme light`. After switching, saves to `config.toml` and reloads |
| `/reload` | Reload the configuration file without exiting |
| `/usage` | Display API usage and quota information, shown with progress bars and remaining percentages. Alias: `/status`. Only applicable to the Kimi Code platform |
| `/debug` | Display context debug information: message count, token count, checkpoint count, and complete message history. Displayed in a pager; press `q` to exit |
| `/mcp` | Display currently connected MCP servers and loaded tools. Output includes server connection status (green = connected) and the list of tools provided by each server |
| `/hooks` | Display currently configured hooks. Output includes the event types and counts of configured hooks; displays a hint when none are configured |
| `/new` | Create a new session and switch immediately. Automatically cleans up when the current session is empty |
| `/sessions` | List all sessions in the current working directory, allowing you to switch. Alias: `/resume`. Use arrow keys to select, Enter to confirm, Ctrl-C to cancel |
| `/title [text]` | View or set the session title (max 200 characters). `/title` displays the current title; `/title <text>` sets a new title. After the first conversation, the title is automatically generated from the user message; once manually set, auto-generation will no longer overwrite it. Alias: `/rename` |
| `/undo` | Roll back to a previous turn and retry. An interactive selector pops up, showing all historical turns' user messages (truncated to 80 characters). After selection, forks a new session containing all history before that turn, and pre-fills the selected turn's user message into the input box for editing and resending. The original session is always preserved |
| `/fork` | Fork a new session from the current session, copying the complete conversation history. The original session remains unchanged |
| `/export [path]` | Export session context as Markdown. Without a path, exports to the current directory with an auto-generated filename (format: `kimi-export-<first 8 chars of session ID>-<timestamp>.md`); with a path, writes directly |
| `/import <file_path\|session_id>` | Import context from a file or another session into the current session. Supports Markdown, text, code, and other text formats; does not support binary files (images, PDFs, archives). Cannot import the current session into itself |
| `/clear` | Clear the current session context. Alias: `/reset` |
| `/compact [instructions]` | Manually compact context to reduce token usage. Context that is too long will also trigger automatic compaction. You can append custom instructions, e.g., `/compact preserve database-related discussions` |
| `/btw <question>` | Ask a quick side question without interrupting the main conversation. Runs in an isolated context: it sees the conversation history but does not modify it, and tool calls are disabled. The response is displayed in a scrollable modal panel. Only available in interactive shell mode |
| `/plan [on\|off\|view\|clear]` | Toggle plan mode. In plan mode, the AI can only use read-only tools to explore the codebase, writes an implementation plan to a plan file, and then submits it for approval. Without arguments, toggles the switch. After enabling, the prompt changes to 📋, and a blue plan badge appears in the status bar |
| `/yolo` | Toggle YOLO mode (auto-approve all actions). After enabling, a yellow YOLO badge appears in the status bar. Enter again to disable. Note: this skips all confirmations; please make sure you understand the potential risks |
| `/web` | Switch to Web UI. Starts the Web server and opens the current session in the browser |
| `/vis` | Switch to the Agent Tracing Visualizer to view Wire event timelines, context, and usage statistics |
| `/skill:<name> [extra_text]` | Load the specified Skill, sending the `SKILL.md` content as a prompt. You can append extra text after the prompt, e.g., `/skill:code-style fix login issue`. Flow Skills can also be invoked via this command, but only the content is loaded, and the flow is not automatically executed |
| `/flow:<name>` | Execute the specified Flow Skill. The Agent starts from the `BEGIN` node and processes each node in sequence according to the flowchart definition until the `END` node |
| `/add-dir [path]` | Add an additional directory to the workspace scope. Without arguments, lists already added directories. After adding, available to all file tools, and persisted with session state |
| `/init` | Analyze the current project and generate an `AGENTS.md` file. Starts a temporary sub-session to analyze the codebase structure |
| `/task` | Open the interactive task browser to view and manage background tasks. Three-column TUI interface: left column task list, middle column details, right column output preview. Auto-refreshes every second. Supports Enter/O to view full output, S to stop, Tab to filter, R to refresh, Q/Esc to exit |
