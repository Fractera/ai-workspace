# codex/

Documentation for Codex CLI (OpenAI), sourced from official docs.

## Files

### github.md — Use Codex in GitHub

- Set up code review
- Request a review
- Enable automatic reviews
- Customize what Codex reviews
- Give Codex other tasks

### slack.md — Use Codex in Slack

- Set up the Slack app
- Start a task
  - How Codex chooses an environment and repo
  - Enterprise data controls
  - Data usage, privacy, and security
  - Tips and troubleshooting

### linear.md — Use Codex in Linear

- Set up the Linear integration
- Delegate work to Codex
  - Assign an issue to Codex
  - Mention `@Codex` in comments
  - How Codex chooses an environment and repo
- Automatically assign issues to Codex
- Data usage, privacy, and security
- Tips and troubleshooting
- Connect Linear for local tasks (MCP)
  - Use the CLI (recommended)
  - Configure manually

### cli-reference.md — Command line options

- How to read this reference
- Global flags
- Command overview
- Command details
  - `codex` (interactive)
  - `codex app-server`
  - `codex app`
  - `codex debug app-server send-message-v2`
  - `codex apply`
  - `codex cloud`
  - `codex completion`
  - `codex features`
  - `codex exec`
  - `codex execpolicy`
  - `codex login`
  - `codex logout`
  - `codex mcp`
  - `codex plugin marketplace`
  - `codex mcp-server`
  - `codex resume`
  - `codex fork`
  - `codex sandbox`
- Flag combinations and safety tips
- Related resources

### cli-features.md — Codex CLI features

- Running in interactive mode
- Resuming conversations
- Connect the TUI to a remote app server
- Models and reasoning
- Feature flags
- Subagents
- Image inputs
- Image generation
- Syntax highlighting and themes
- Running local code review
- Web search
- Running with an input prompt
- Shell completions
- Approval modes
- Scripting Codex
- Working with Codex cloud
- Slash commands
- Prompt editor
- Model Context Protocol (MCP)
- Tips and shortcuts

### cli.md — Codex CLI

- CLI setup
- Work with the Codex CLI
  - Run Codex interactively
  - Control model and reasoning
  - Image inputs
  - Image generation
  - Run local code review
  - Use subagents
  - Web search
  - Codex Cloud tasks
  - Scripting Codex
  - Model Context Protocol
  - Approval modes

### quick-start.md — Quickstart

- Setup
  - App (Recommended)
    - 1. Download and install the Codex app
    - 2. Open Codex and sign in
    - 3. Select a project
    - 4. Send your first message
  - IDE Extension (Codex in your IDE)
    - 1. Install the Codex extension
    - 2. Open the Codex panel
    - 3. Sign in and start your first task
    - 4. Use Git checkpoints
  - CLI (Codex in your terminal)
    - 1. Install the Codex CLI
    - 2. Run `codex` and sign in
    - 3. Ask Codex to work in your current directory
    - 4. Use Git checkpoints
  - Cloud (Codex in your browser)
    - 1. Open Codex in your browser
    - 2. Set up an environment
    - 3. Launch a task and monitor progress
    - 4. Review changes and create a pull request
