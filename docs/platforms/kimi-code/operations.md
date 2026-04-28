# Kimi Code — Core Operations

## Input and Control

### Multi-line Input

Sometimes you need to enter multiple lines, such as pasting a code snippet or error log. Press Ctrl-J or Alt-Enter to insert a newline instead of sending the message immediately.

After finishing your input, press Enter to send the complete message.

### Clipboard and Media Paste

Press Ctrl-V to paste text, images, or video files from the clipboard.

In Agent mode, longer pasted text (over 1000 characters or 15 lines) is automatically collapsed into a `[Pasted text #n]` placeholder in the input box to keep the interface clean. The full content is still expanded and sent to the model when submitting. When using an external editor (Ctrl-O), placeholders are automatically expanded to the original text; unmodified portions are re-collapsed after saving.

If the clipboard contains an image, Kimi Code CLI caches the image to disk and displays it as an `[image:…]` placeholder in the input box. After sending the message, the AI can see and analyze the image. If the clipboard contains a video file, its file path is inserted as text into the input box.

> **Tip:** Image input requires the model to support the `image_in` capability. Video input requires the `video_in` capability.

### @ Path Completion

When you type `@` in a message, Kimi Code CLI will auto-complete file and directory paths in the working directory. This allows you to conveniently reference files in your project:

```
Take a look at @src/components/Button.tsx and see if there are any issues
```

After typing `@`, start entering the filename and matching completions will appear. Press Tab or Enter to select a completion. In Git repositories, file discovery uses `git ls-files` first, enabling fast lookups even in large repos with tens of thousands of files; non-Git projects fall back to directory scanning.

### Slash Commands

Slash commands are special instructions starting with `/`, used to execute Kimi Code CLI's built-in features, such as `/help`, `/login`, `/sessions`, etc. After typing `/`, a list of available commands will automatically appear. For the complete list of slash commands, see the "Reference Manual" slash commands chapter.

### Sending Messages While Running (Steer)

While the AI is executing a task, you can type and send follow-up messages directly in the input box without waiting for the current turn to finish. This feature is called "steer" and allows you to adjust the AI's direction while it is running. There are two ways to send:

- **Queue (Enter):** Place in queue, automatically sent after the current turn completes
- **Inject Immediately (Ctrl+S):** Immediately inject into the current turn context

Either way, the sent steer message is appended to the context, and the AI will see and respond to it. During AI execution, approval requests and question panels also support inline keyboard interaction.

> **Tip:** Steer messages do not interrupt the AI's currently executing step but are processed between steps. To interrupt immediately, use Ctrl-C.

### Side Questions

While the AI is working, you can use the `/btw` command to ask a quick side question without interrupting the main conversation flow.

```
/btw What is the return type of this function?
```

Side questions run in an isolated context: they can see the conversation history but do not modify it, and tools are disabled. The response is displayed in a scrollable modal panel — use ↑/↓ to scroll, Escape to close.

### Approvals and Confirmations

When the AI needs to perform operations that may have an impact (such as modifying files or running commands), Kimi Code CLI will request your confirmation.

The confirmation prompt shows operation details, including shell commands and file diff previews. If the content is long and truncated, you can press Ctrl-E to expand and view the full content. You can choose:

- **Allow:** Execute this operation
- **Allow for this session:** Automatically approve similar operations in the current session (this decision is persisted with the session and automatically restored when resuming)
- **Reject:** Do not execute this operation
- **Reject with feedback:** Decline the operation and provide written feedback telling the agent how to adjust

If you trust the AI's operations, or you're running Kimi Code CLI in a safe isolated environment, you can enable "YOLO mode" to automatically approve all requests:

```bash
# Enable at startup
kimi --yolo

# Or toggle during runtime
/yolo
```

You can also set `default_yolo = true` in the config file to enable YOLO mode by default on every startup.

When YOLO mode is enabled, a yellow YOLO badge appears in the status bar at the bottom. Enter `/yolo` again to disable it.

> **Note:** YOLO mode skips all confirmations. Make sure you understand the potential risks. It's recommended to only use this in controlled environments.

### Switching Models

You can use the `/model` command to switch models and Thinking mode.

This command first refreshes the list of available models from the API platform. When called without arguments, it displays an interactive selection interface: first select the model, then choose whether to enable Thinking mode (if the model supports it).

After selection, Kimi Code CLI automatically updates the config file and reloads.

> **Tip:** This command is only available when using the default config file. If a config is specified via `--config` or `--config-file`, this command cannot be used.

### Structured Questions

During execution, the AI may need you to make choices to determine the next direction. In such cases, the AI will use the `AskUserQuestion` tool to present structured questions and options.

The question panel displays the question description and available options. You can select using the keyboard:

- Use arrow keys (up / down) to navigate options
- Press Enter to confirm selection
- Press Space to toggle selection in multi-select mode
- Select "Other" to enter custom text
- Press Esc to skip the question

Each question supports 2–4 predefined options, and the AI will set appropriate options and descriptions based on the current task context. If there are multiple questions to answer, the panel displays them as tabs — use Left/Right arrow keys or Tab to switch between questions. Answered questions are marked as completed, and switching back to an answered question restores the previous selection.

> **Tip:** The AI only uses this tool when your choice genuinely affects subsequent actions. For decisions that can be inferred from context, the AI will decide on its own and continue execution.

### Background Tasks

When the AI needs to run long-running commands (such as building a project, running a test suite, or starting a development server), it can launch them as background tasks. Background tasks run in a separate process, allowing the AI to continue handling other requests without waiting for the command to finish.

Background task workflow:

1. The AI uses the Shell tool with `run_in_background=true` to launch the command
2. The tool immediately returns a task ID, and the AI continues with other work
3. When the task completes, if the AI is idle (waiting for user input), the system automatically triggers a new agent turn to process the results — no manual input needed

You can use the `/task` slash command to open the interactive task browser, where you can view the status and output of all background tasks in real time (including tasks that are still running).

> **Tip:** By default, up to 4 background tasks can run simultaneously. This can be adjusted in the `[background]` section of the config file. All background tasks are terminated when the CLI exits by default.

## Context Management

### Session Resumption

Kimi Code CLI automatically saves your conversation history, making it easy to continue previous work at any time.

A new session is created each time you start Kimi Code CLI. During operation, you can also enter the `/new` command at any time to create and switch to a new session without exiting the program.

If you want to continue a previous conversation, there are several ways:

#### Resume the Most Recent Session

Use the `--continue` parameter to resume the most recent session in the current working directory:

```bash
kimi --continue
```

#### Interactive Session Selection

Use `--session` (or `--resume`, `-S`, `-r`) without arguments to open the interactive session selector, and use arrow keys to select the session to resume:

```bash
kimi --session
```

> **Tip:** The interactive selector is only available in Shell mode.

#### Resume a Specific Session

Use `--session` (or `--resume`) with a session ID to resume the specified session:

```bash
kimi -r abc123
```

If the specified session ID does not exist, a new session will be created automatically.

#### Switch Sessions During Operation

Enter `/sessions` (or `/resume`) to view all sessions in the current working directory, and use arrow keys to select the session to switch to:

```
/sessions
```

The list shows each session's title and last update time, helping you find the conversation you want to continue. Press Ctrl-A to toggle between "current directory only" and "all directories", making it easy to find sessions across projects. Use `/title <text>` to set a custom title for a session, making it easier to find later.

#### Resumption Prompt on Exit

When a session exits (including normal exit, Ctrl-C interrupt, `/undo`, `/fork`, `/sessions` switch, etc.), Kimi Code CLI automatically prints a resumption command prompt:

```
To resume this session: kimi -r <session-id>
```

You can copy this command directly and run it in the terminal next time to quickly resume that session. Empty sessions do not show this prompt.

#### Startup Replay

When you continue an existing session, Kimi Code CLI replays the previous conversation history to help you quickly get up to speed. During replay, previous messages and AI responses are displayed.

#### Session State Persistence

In addition to conversation history, Kimi Code CLI automatically saves and restores session runtime state. When you resume a session, the following states are automatically restored:

- **Approval decisions:** YOLO mode toggle state, operation types approved via "Allow for this session"
- **Plan mode:** Plan mode toggle state
- **Subagent instances:** Subagent instance states and context histories created via the Agent tool during the session
- **Additional directories:** Workspace directories added via `--add-dir` or `/add-dir`

This means you don't need to reconfigure these settings every time you resume a session. For example, if you approved automatic execution of certain shell commands in the previous session, those approvals remain valid after resuming.

### Export and Import

Kimi Code CLI supports exporting session context to files, or importing context from external files and other sessions.

#### Export Session

Enter `/export` to export the current session's complete conversation history as a Markdown file:

```
/export
```

The exported file contains session metadata, conversation overview, and complete turn-by-turn conversation records. You can also specify an output path:

```
/export ~/exports/my-session.md
```

#### Import Context

Enter `/import` to import context from a file or another session. Imported content is attached to the current session as reference information:

```
/import ./previous-session-export.md
/import abc12345
```

Common text format files are supported (Markdown, code, config files, etc.). You can also pass a session ID to import the complete conversation history from that session.

> **Tip:** Export files may contain sensitive information (such as code snippets, file paths, etc.). Please check before sharing.

### Clear and Compact

As the conversation progresses, context becomes longer and longer. Kimi Code CLI automatically compresses context when needed to ensure the conversation can continue.

You can also use slash commands to manually manage context:

#### Clear Context

Enter `/clear` to clear all context in the current session and start the conversation anew:

```
/clear
```

After clearing, the AI will forget all previous conversation content. Usually you don't need to use this command; for new tasks, starting a new session is a better choice.

#### Compact Context

Enter `/compact` to have the AI summarize the current conversation and replace the original context with the summary:

```
/compact
```

You can also attach custom guidance after the command to tell the AI what content to prioritize during compaction:

```
/compact Keep discussions related to the database
```

Compaction preserves key information while reducing token consumption. This is useful when the conversation is long but you want to retain some context.

> **Tip:** The bottom status bar shows current context usage and token count (e.g., `context: 42.0% (4.2k/10.0k)`), helping you know when to clear or compact.

> **Tip:** `/clear` and `/reset` clear conversation context but do not reset session state (such as approval decisions, dynamic subagents, and additional directories). To completely start over, creating a new session is recommended.

## Work Modes

### Agent and Shell Mode

Kimi Code CLI has two input modes:

- **Agent mode:** The default mode, where input is sent to the AI for processing
- **Shell mode:** Execute shell commands directly without leaving Kimi Code CLI

Press Ctrl-X to switch between the two modes. The current mode is displayed in the bottom status bar.

In shell mode, you can execute commands just like in a regular terminal:

```bash
$ ls -la
$ git status
$ npm run build
```

Shell mode also supports some slash commands, including `/help`, `/exit`, `/version`, `/editor`, `/changelog`, `/feedback`, `/export`, `/import`, and `/task`.

> **Note:** In shell mode, each command executes independently. Commands that change the environment like `cd` or `export` won't affect subsequent commands.

### Plan Mode

Plan mode is a read-only planning mode that lets the AI design an implementation plan before writing code, preventing wasted effort in the wrong direction.

In plan mode, the AI can only use read-only tools (Glob, Grep, ReadFile) to explore the codebase — it cannot modify any files or execute commands. The AI writes its plan to a dedicated plan file, then submits it to you for approval. You can approve, reject, or provide revision feedback.

#### Entering Plan Mode

There are four ways to enter plan mode:

1. **Startup parameter:** Use `kimi --plan` to start a new session directly in plan mode
2. **Keyboard shortcut:** Press Shift-Tab to toggle plan mode
3. **Slash command:** Enter `/plan` or `/plan on`
4. **AI-initiated:** When facing complex tasks, the AI may request to enter plan mode via the `EnterPlanMode` tool — you can accept or decline

You can also set `default_plan_mode = true` in the config file to start every new session in plan mode by default.

When plan mode is active, the prompt changes to 📋 and a blue plan badge appears in the status bar.

#### Reviewing Plans

When the AI finishes its plan, it submits it for approval via `ExitPlanMode`. The approval panel shows the full plan content, and you can:

- **Approve and execute:** If the plan contains multiple alternative implementation paths, the AI lists 2–3 labeled options (e.g., "Option A", "Option B (Recommended)") for you to choose from — selecting one exits plan mode and tells the AI which path to follow. If the plan has a single path, an Approve button is shown instead.
- **Reject:** Decline the plan, stay in plan mode, and provide feedback via conversation
- **Reject and Exit:** Decline the plan and exit plan mode in one step
- **Revise:** Enter revision notes — the AI will update the plan and resubmit

Press Ctrl-E to view the full plan content in a fullscreen pager.

#### Managing Plan Mode

Use the `/plan` command to manage plan mode:

- `/plan`: Toggle plan mode
- `/plan on`: Enable plan mode
- `/plan off`: Disable plan mode
- `/plan view`: View the current plan content
- `/plan clear`: Clear the current plan file

### Thinking Mode

Thinking mode allows the AI to think more deeply before responding, suitable for handling complex problems.

You can use the `/model` command to switch models and Thinking mode. After selecting a model, if the model supports Thinking mode, the system will ask whether to enable it. You can also enable it at startup with the `--thinking` parameter:

```bash
kimi --thinking
```

> **Tip:** Thinking mode requires support from the current model.

### Print Mode

Print mode allows Kimi Code CLI to run non-interactively, suitable for scripting and automation scenarios.

#### Basic Usage

Enable print mode with the `--print` parameter:

```bash
# Pass instruction via -p (or -c)
kimi --print -p "List all Python files in the current directory"

# Pass instruction via stdin
echo "Explain what this code does" | kimi --print
```

Print mode characteristics:

- **Non-interactive:** Automatically exits after executing the instruction
- **Auto-approval:** Implicitly enables `--yolo` mode, all operations are automatically approved, interactive questions (`AskUserQuestion`) and plan mode switches are also handled automatically
- **Text output:** AI responses are output to stdout

#### Output Final Message Only

Use the `--final-message-only` option to output only the final assistant message, skipping intermediate tool call processes:

```bash
kimi --print -p "Give me a Git commit message based on the current changes" --final-message-only
```

`--quiet` is a shorthand for `--print --output-format text --final-message-only`, suitable for scenarios where only the final result is needed:

```bash
kimi --quiet -p "Give me a Git commit message based on the current changes"
```

#### JSON Format

Print mode supports JSON format input and output for programmatic processing. Both input and output use the Message format.

**JSON output**

Use `--output-format=stream-json` to output in JSONL (one JSON per line) format:

```bash
kimi --print -p "Hello" --output-format=stream-json
```

Output example:

```json
{"role":"assistant","content":"Hello! How can I help you?"}
```

If the AI calls tools, assistant messages and tool messages are output sequentially.

**JSON input**

Use `--input-format=stream-json` to receive JSONL format input:

```bash
echo '{"role":"user","content":"Hello"}' | kimi --print --input-format=stream-json --output-format=stream-json
```

In this mode, Kimi Code CLI continuously reads stdin, processing and outputting a response for each user message received until stdin is closed.

#### Message Format

Both input and output use a unified Message format.

**User message**

```json
{"role": "user", "content": "Your question or instruction"}
```

You can also use array-form content:

```json
{"role": "user", "content": [{"type": "text", "text": "Your question"}]}
```

**Assistant message**

```json
{"role": "assistant", "content": "Reply content"}
```

Assistant messages with tool calls contain a `tool_calls` field.

**Tool message**

```json
{"role": "tool", "tool_call_id": "tc_1", "content": "Tool execution result"}
```

#### Exit Codes

Print mode uses exit codes to indicate execution results, making it easy for scripts and CI systems to determine whether retry is needed:

| Exit Code | Meaning | Description |
|---|---|---|
| 0 | Success | Task completed normally |
| 1 | Failure (not retryable) | Configuration errors, authentication failures, quota exhausted, and other permanent errors |
| 75 | Failure (retryable) | 429 rate limits, 5xx server errors, connection timeouts, and other transient errors |

#### Use Cases

**CI/CD integration**

```bash
kimi --print -p "Check if there are obvious security issues in the src/ directory and output a JSON report"
```

**Batch processing**

```bash
for file in src/*.py; do
  kimi --print -p "Add type annotations to $file"
done
```

**Integration with other tools**

```bash
my-tool | kimi --print --input-format=stream-json --output-format=stream-json | process-output
```
