# Plan Mode

Plan Mode is a read-only environment for architecting robust solutions before
implementation. With Plan Mode, you can:

- **Research:** Explore the project in a read-only state to prevent accidental changes.
- **Design:** Understand problems, evaluate trade-offs, and choose a solution.
- **Plan:** Align on an execution strategy before any code is modified.

Plan Mode is enabled by default. You can manage this setting using the
`/settings` command.

---

## How to enter Plan Mode

Plan Mode integrates seamlessly into your workflow, letting you switch between
planning and execution as needed.

### Launch in Plan Mode

To start Gemini CLI directly in Plan Mode by default:

1. Use the `/settings` command.
2. Set **Default Approval Mode** to `Plan`.

To launch Gemini CLI in Plan Mode once:

```bash
gemini --approval-mode=plan
```

### Enter Plan Mode manually

- **Keyboard shortcut:** Press `Shift+Tab` to cycle through approval modes
  (`Default` -> `Auto-Edit` -> `Plan`). Plan Mode is automatically removed from
  the rotation when Gemini CLI is actively processing or showing confirmation
  dialogs.

- **Command:** Type `/plan [goal]` in the input box. The `[goal]` is optional;
  for example, `/plan implement authentication` will switch to Plan Mode and
  immediately submit the prompt.

- **Natural Language:** Ask Gemini CLI to "start a plan for...". Gemini CLI
  calls the `enter_plan_mode` tool to switch modes. This tool is not available
  when Gemini CLI is in YOLO mode.

---

## How to use Plan Mode

1. **Provide a goal:** Start by describing what you want to achieve. Gemini CLI
   will then enter Plan Mode (if it's not already) to research the task.
2. **Discuss and agree on strategy:** As Gemini CLI analyzes your codebase, it
   will discuss its findings and proposed strategy with you. It may ask you
   questions or present different implementation options using `ask_user`.
   **Gemini CLI will stop and wait for your confirmation** before drafting the
   formal plan.
3. **Review the plan:** Once you've agreed on the strategy, Gemini CLI creates
   a detailed implementation plan as a Markdown file in your plans directory.
   - **View:** Open and read the file to understand the proposed changes.
   - **Edit:** Press `Ctrl+X` to open the plan directly in your configured external editor.
4. **Approve or iterate:** Gemini CLI will present the finalized plan for your formal approval.
   - **Approve:** If satisfied, approve to start the implementation immediately: **Yes, automatically accept edits** or **Yes, manually accept edits**.
   - **Iterate:** Provide feedback in the input box or edit the plan file directly. Gemini CLI will refine and update the plan.
   - **Cancel:** You can cancel your plan with `Esc`.

### Collaborative plan editing

1. **Open the plan:** Press `Ctrl+X` when Gemini CLI presents a plan for review.
2. **Edit or comment:** The plan opens in your configured external editor. You can:
   - **Modify steps:** Directly reorder, delete, or rewrite implementation steps.
   - **Leave comments:** Add inline questions or feedback.
3. **Save and close:** Save your changes and close the editor.
4. **Review and refine:** Gemini CLI automatically detects the changes, reviews your comments, and adjusts the implementation strategy.

---

## How to exit Plan Mode

- **Approve a plan:** Approving a finalized plan automatically exits Plan Mode and starts implementation.
- **Keyboard shortcut:** Press `Shift+Tab` to cycle to the desired mode.
- **Natural language:** Ask Gemini CLI to "exit plan mode" or "stop planning."

---

## Tool Restrictions

Plan Mode enforces strict safety policies to prevent accidental changes.

These are the only allowed tools:

- **FileSystem (Read):** `read_file`, `list_directory`, `glob`
- **Search:** `grep_search`, `google_web_search`, `web_fetch` (requires explicit confirmation), `get_internal_docs`
- **Research Subagents:** `codebase_investigator`, `cli_help`
- **Interaction:** `ask_user`
- **MCP tools (Read):** Read-only MCP tools and core MCP resource tools (`list_mcp_resources`, `read_mcp_resource`)
- **Planning (Write):** `write_file` and `replace` only allowed for `.md` files in the plans directory or your custom plans directory.
- **Memory:** `save_memory`
- **Skills:** `activate_skill` (loads specialized instructions in a read-only manner)

---

## Customization and best practices

### Custom planning with skills

You can use Agent Skills to customize how Gemini CLI approaches planning. When a
skill is activated during Plan Mode, its specialized instructions guide the
research, design, and planning phases.

For example:
- A **"Database Migration"** skill ensures the plan includes data safety checks and rollback strategies.
- A **"Security Audit"** skill prompts Gemini CLI to look for specific vulnerabilities.
- A **"Frontend Design"** skill guides Gemini CLI to use specific UI components and accessibility standards.

### Custom policies

Plan Mode's default tool restrictions are managed by the policy engine and
defined in the built-in `plan.toml` file. You can customize these rules by
creating your own policies in `~/.gemini/policies/`.

#### Global vs. mode-specific rules

Persistent tool approvals are context-aware. Approvals granted in Default or
Auto-Edit modes do not apply to Plan Mode. Approvals granted while in Plan Mode
apply to all modes.

To allow a tool in other modes but not Plan Mode, explicitly specify the target
modes:

```toml
[[rule]]
toolName = "run_shell_command"
commandPrefix = "npm test"
decision = "allow"
priority = 100
modes = ["default", "autoEdit"]
```

#### Example: Automatically approve read-only MCP tools

`~/.gemini/policies/mcp-read-only.toml`:

```toml
[[rule]]
toolName = "*"
mcpName = "*"
toolAnnotations = { readOnlyHint = true }
decision = "allow"
priority = 100
modes = ["plan"]
```

#### Example: Allow git commands in Plan Mode

`~/.gemini/policies/git-research.toml`:

```toml
[[rule]]
toolName = "run_shell_command"
commandPrefix = ["git status", "git diff"]
decision = "allow"
priority = 100
modes = ["plan"]
```

#### Example: Enable custom subagents in Plan Mode

`~/.gemini/policies/research-subagents.toml`:

```toml
[[rule]]
toolName = "my_custom_subagent"
decision = "allow"
priority = 100
modes = ["plan"]
```

### Custom plan directory and policies

By default, planning artifacts are stored in
`~/.gemini/tmp/<project>/<session-id>/plans/`.

To store plans in a custom location within your project:

```json
{
  "general": {
    "plan": {
      "directory": ".gemini/plans"
    }
  }
}
```

User-configured paths are restricted to the project root to prevent escaping
the workspace boundary.

To allow writing to a custom plans directory, create a policy:

`~/.gemini/policies/plan-custom-directory.toml`:

```toml
[[rule]]
toolName = ["write_file", "replace"]
decision = "allow"
priority = 100
modes = ["plan"]
argsPattern = "\"file_path\":\"[^\"]+[\\\\/]+\\.gemini[\\\\/]+plans[\\\\/]+[\\w-]+\\.md\""
```

### Using hooks with Plan Mode

You can use hooks to automate parts of the planning workflow. Hooks such as
`BeforeTool` or `AfterTool` can intercept `enter_plan_mode` and `exit_plan_mode`
tool calls.

> **WARNING:** Hooks triggered by tool executions do **not** run when you
> manually toggle Plan Mode using `/plan` or `Shift+Tab`. If you need hooks to
> execute on mode changes, ensure the transition is initiated by the agent.

#### Example: Archive approved plans to GCS (`AfterTool`)

**`.gemini/hooks/archive-plan.sh`:**

```bash
#!/usr/bin/env bash
plan_filename=$(jq -r '.tool_input.plan_filename // empty')
plan_path="$GEMINI_PLANS_DIR/$plan_filename"

if [ -f "$plan_path" ]; then
  filename="$(date +%s)_$(basename "$plan_path")"
  gsutil cp "$plan_path" "gs://my-audit-bucket/gemini-plans/$filename" > /dev/null 2>&1 &
fi

echo '{"decision": "allow"}'
```

Register in `settings.json`:

```json
{
  "hooks": {
    "AfterTool": [
      {
        "matcher": "exit_plan_mode",
        "hooks": [
          {
            "name": "archive-plan",
            "type": "command",
            "command": "~/.gemini/hooks/archive-plan.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Commands

- **`/plan copy`**: Copy the currently approved plan to your clipboard.

---

## Planning workflows

### Built-in planning workflow

The built-in planner uses an adaptive workflow to analyze your project, consult
you on trade-offs via `ask_user`, and draft a plan for your approval.

### Custom planning workflows

#### Conductor

Conductor is designed for spec-driven development. It organizes work into
"tracks" and stores persistent artifacts in your project's `conductor/`
directory. It automates mode transitions, streamlines decisions with `ask_user`,
and hands off to implementation via `exit_plan_mode`.

#### Build your own

Since Plan Mode is built on modular building blocks, you can develop your own
custom planning workflow as an extension. Use core tools (`enter_plan_mode`,
`ask_user`, `exit_plan_mode`), set your own storage locations, and define custom
policy rules.

---

## Automatic Model Routing

When using an auto model, Gemini CLI automatically optimizes model routing based
on the current phase:

1. **Planning Phase:** Routes requests to a high-reasoning **Pro** model.
2. **Implementation Phase:** After plan approval, automatically switches to a high-speed **Flash** model.

If the high-reasoning model is unavailable, Gemini CLI silently falls back to a
faster model.

To disable automatic switching:

```json
{
  "general": {
    "plan": {
      "modelRouting": false
    }
  }
}
```

---

## Cleanup

By default, sessions (and their plans) are retained for **30 days**.

- **Configuration:** Use `/settings` (search for **Enable Session Cleanup** or **Keep chat history**) or `settings.json`.
- **Command Line:** `gemini --delete-session <index|id>`
- **Session Browser:** Press `/resume`, navigate to a session, and press `x`.

If you use a custom plans directory, those files are not automatically deleted
and must be managed manually.

---

## Non-interactive execution

When running in non-interactive environments (headless scripts or CI/CD
pipelines):

- The policy engine automatically approves `enter_plan_mode` and `exit_plan_mode` without prompting.
- When exiting Plan Mode to execute the plan, Gemini CLI automatically switches to YOLO mode.

**Example:**

```bash
gemini --approval-mode plan -p "Analyze telemetry and suggest improvements"
```
