# Kimi Code CLI — Core Operations

Source: https://moonshotai.github.io/kimi-cli/en/guides/core-operations

---

## Input and Control

### Multi-line Input

- `Ctrl-J` or `Alt-Enter` — insert newline without sending
- `Enter` — send the complete message

### Clipboard and Media Paste

- `Ctrl-V` — paste text, images, or video files
- Text >1000 chars or 15 lines → auto-collapsed to `[Pasted text #n]` placeholder (full content sent to model)
- Image → cached to disk, displayed as `[image:…]` placeholder
- Video → file path inserted as text
- `Ctrl-O` — open external editor (placeholders auto-expanded)

Requirements: image input needs `image_in` capability; video needs `video_in` capability.

### @ Path Completion

Type `@` to auto-complete file and directory paths:
```
Take a look at @src/components/Button.tsx and see if there are any issues
```
- `Tab` or `Enter` — select completion
- Git repos: uses `git ls-files` first (fast even for large repos)
- Non-git: falls back to directory scanning

### Sending Messages While Running (Steer)

While AI is executing, you can send follow-up messages:

| Action | Key | Behavior |
|---|---|---|
| Queue | `Enter` | Sent after current turn completes |
| Inject immediately | `Ctrl+S` | Injected into current turn context |

Steer messages don't interrupt the current step — processed between steps. Use `Ctrl-C` to interrupt immediately.

### Side Questions

```bash
/btw What is the return type of this function?
```

Runs in isolated context — sees conversation history but doesn't modify it, tools disabled. Response shown in scrollable modal panel (`↑/↓` to scroll, `Escape` to close).

---

## Approvals and Confirmations

When AI needs to modify files or run commands, it requests confirmation:

| Option | Description |
|---|---|
| Allow | Execute this operation |
| Allow for this session | Auto-approve similar operations in current session (persisted) |
| Reject | Do not execute |
| Reject with feedback | Decline + provide written feedback |

`Ctrl-E` — expand truncated content to view full diff/command.

### YOLO Mode (Auto-approve All)

```bash
kimi --yolo        # enable at startup
/yolo              # toggle during runtime
```

Or set in config: `default_yolo = true`

Yellow YOLO badge appears in status bar when active. Enter `/yolo` again to disable.

> Warning: YOLO mode skips all confirmations. Use only in controlled environments.

---

## Model Switching

```bash
/model    # interactive selection — choose model and Thinking mode
```

Note: Only available when using default config file. Not available with `--config` or `--config-file`.

---

## Work Modes

### Agent and Shell Mode

| Mode | Description |
|---|---|
| Agent mode | Default — input sent to AI |
| Shell mode | Execute shell commands directly |

`Ctrl-X` — switch between modes. Current mode shown in status bar.

```bash
$ ls -la
$ git status
$ npm run build
```

Note: Shell mode commands execute independently — `cd` and `export` don't affect subsequent commands.

### Plan Mode

Read-only planning mode — AI designs implementation plan before writing code.

AI can only use read-only tools (Glob, Grep, ReadFile) — cannot modify files or execute commands.

**Enter plan mode:**
```bash
kimi --plan          # startup parameter
Shift-Tab            # keyboard shortcut
/plan                # slash command toggle
/plan on             # enable
/plan off            # disable
/plan view           # view current plan
/plan clear          # clear plan file
```

Or set in config: `default_plan_mode = true`

Blue plan badge + 📋 prompt appears when active.

**Reviewing plans:**
- Approve and execute (select option if multiple paths)
- Reject (stay in plan mode, provide feedback)
- Reject and Exit
- Revise (AI updates and resubmits)
- `Ctrl-E` — fullscreen pager for full plan content

### Thinking Mode

AI thinks more deeply before responding — for complex problems.

```bash
kimi --thinking    # enable at startup
/model             # switch model and toggle Thinking mode
```

### Print Mode (Non-interactive / Automation)

```bash
# Basic
kimi --print -p "List all Python files in the current directory"
echo "Explain what this code does" | kimi --print

# Final message only
kimi --print -p "Give me a Git commit message" --final-message-only

# Quiet (shorthand for --print --output-format text --final-message-only)
kimi --quiet -p "Give me a Git commit message"
```

Print mode: non-interactive, auto-exits, implicitly enables `--yolo`, outputs to stdout.

**JSON format:**
```bash
# JSON output (JSONL)
kimi --print -p "Hello" --output-format=stream-json

# JSON input
echo '{"role":"user","content":"Hello"}' | kimi --print --input-format=stream-json --output-format=stream-json
```

**Message format:**
```json
{"role": "user", "content": "Your question"}
{"role": "assistant", "content": "Reply content"}
{"role": "tool", "tool_call_id": "tc_1", "content": "Tool execution result"}
```

**Exit codes:**

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Failure (not retryable) — config errors, auth failures, quota exhausted |
| 75 | Failure (retryable) — 429 rate limits, 5xx errors, connection timeouts |

**Fractera bridge uses:**
```bash
kimi --print --output-format stream-json --yolo
```

---

## Context Management

### Session Resumption

```bash
kimi --continue             # resume most recent session in current directory
kimi --session              # interactive session selector
kimi -r abc123              # resume specific session by ID
/sessions                   # view all sessions, switch interactively
/title <text>               # set custom title for current session
```

`Ctrl-A` in session list — toggle between current directory only and all directories.

On exit, Kimi prints: `To resume this session: kimi -r <session-id>`

**Session state persisted across resume:**
- Approval decisions (YOLO state, "Allow for this session" decisions)
- Plan mode state
- Subagent instances
- Additional directories (`--add-dir`)

### Export and Import

```bash
/export                         # export session as Markdown
/export ~/exports/my-session.md # export to specific path
/import ./previous-session.md   # import from file
/import abc12345                # import from session ID
```

### Clear and Compact

```bash
/clear      # clear all context, start fresh (does NOT reset session state)
/compact    # AI summarizes conversation, replaces context with summary
/compact Keep discussions related to the database   # with custom guidance
/new        # create new session without exiting
```

Status bar shows: `context: 42.0% (4.2k/10.0k)` — current context usage.

Note: `/clear` and `/reset` clear conversation context but NOT session state (approvals, subagents, additional directories). For full reset, create a new session.

---

## Fractera Integration Notes

- Print mode (`--print --output-format stream-json --yolo`) is the Fractera bridge mode
- Exit code 75 = retryable — Fractera bridge should retry on this code
- Session IDs can be passed via `--resume` for resuming sessions from Fractera UI
- `@` path completion works in the context of the working directory set when launching kimi
