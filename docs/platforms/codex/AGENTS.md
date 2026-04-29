# codex/

Documentation for Codex CLI (OpenAI), sourced from official docs.

## Files

### config-sample.md — Sample Configuration

- Core Model Selection
- Reasoning & Verbosity
- Instruction Overrides
- Notifications
- Approval & Sandbox
- Authentication & Login
- Project Documentation Controls
- History & File Opener
- UI, Notifications, and Misc
- Web Search
- Agents
- Skills
- Sandbox settings
- Shell Environment Policy
- History
- TUI options
- Feature Flags
- Model Providers
- Profiles
- Windows

### config-advanced.md — Advanced Configuration

- Profiles
- One-off overrides from the CLI
- Config and state locations
- Project config files (`.codex/config.toml`)
- Hooks (experimental)
- Agent roles (`[agents]` in `config.toml`)
- Project root detection
- Custom model providers
- OSS mode (local providers)
- Azure provider and per-provider tuning
- ChatGPT customers using data residency
- Model reasoning, verbosity, and limits
- Approval policies and sandbox modes
- Shell environment policy
- MCP servers
- Observability and telemetry
- Metrics
- Feedback controls
- Hide or surface reasoning events
- Notifications
- History persistence
- Clickable citations
- Project instructions discovery
- TUI options

### config-basics.md — Config basics

- Codex configuration file
- Configuration precedence
- Common configuration options
  - Default model
  - Approval prompts
  - Sandbox level
  - Windows sandbox mode
  - Web search mode
  - Reasoning effort
  - Communication style
  - Command environment
  - Log directory
- Feature flags
  - Supported features
  - Enabling features

### security-faq.md — FAQ

- Getting started
  - What is Codex Security?
  - Why does it matter?
  - What business problem does Codex Security solve?
  - How does Codex Security work?
  - Does it replace SAST?
- Features
  - What is the analysis pipeline?
  - What languages are supported?
  - What outputs do I get after the scan completes?
  - How is customer code isolated?
  - Does Codex Security auto-apply patches?
  - Does the project need to be built for scanning?
  - How does Codex Security reduce false positives and avoid broken patches?
  - How long do initial scans take, and what happens after that?
  - What is a threat model?
  - How is a threat model generated?
  - Does it replace manual security review?
  - Can I edit the threat model?
  - Do I need to configure a scan before using threat modeling?
  - What does the proposed patch contain?
  - Does the patch directly modify my PR branch?
- Validation
  - What is auto-validation?
  - What happens if validation fails?

### security-threat-model.md — Improving the threat model

- What a threat model is
- Improving and revisiting the threat model
  - Where to edit
- Related docs

### security-setup.md — Codex Security setup

- 1. Access and environment
- 2. New security scan
- 3. Initial scans can take a while
- 4. Review scans and improve the threat model
- 5. Review findings and patch
- Related docs

### security.md — Codex Security

- How it works
- Access and prerequisites
- Related docs

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

### speed.md — Speed

- Fast mode
- Codex-Spark

### rules.md — Rules

- Create a rules file
- Understand rule fields
- Shell wrappers and compound commands
  - When Codex can safely split the script
  - When Codex does not split the script
- Test a rule file
- Understand the rules language

### hooks.md — Hooks

- Where Codex looks for hooks
- Config shape
- Managed hooks from `requirements.toml`
- Matcher patterns
- Common input fields
- Common output fields
- Hooks
  - SessionStart
  - PreToolUse
  - PermissionRequest
  - PostToolUse
  - UserPromptSubmit
  - Stop
- Schemas

### agents-md.md — Custom instructions with AGENTS.md

- How Codex discovers guidance
- Create global guidance
- Layer project instructions
- Customize fallback filenames
- Verify your setup
- Troubleshoot discovery issues
- Next steps

### mcp.md — Model Context Protocol

- Supported MCP features
- Connect Codex to an MCP server
  - Configure with the CLI
    - Add an MCP server
    - Other CLI commands
    - Terminal UI (TUI)
  - Configure with config.toml
    - STDIO servers
    - Streamable HTTP servers
    - Other configuration options
    - config.toml examples
- Examples of useful MCP servers

### plugins.md — Plugins

- Overview
- Use and install plugins
  - Plugin Directory in the Codex app
  - Plugin directory in the CLI
  - Install and use a plugin
  - How permissions and data sharing work
  - Remove or turn off a plugin
- Build your own plugin

### build-plugins.md — Build plugins

- Create a plugin with `$plugin-creator`
  - Build your own curated plugin list
  - Add a marketplace from the CLI
  - Create a plugin manually
  - Install a local plugin manually
  - Marketplace metadata
  - How Codex uses marketplaces
- Package and distribute plugins
  - Plugin structure
  - Manifest fields
  - Path rules
  - Publish official public plugins

### agent-skills.md — Agent Skills

- How Codex uses skills
- Create a skill
- Where to save skills
- Distribute skills with plugins
- Install curated skills for local use
- Enable or disable skills
- Optional metadata
- Best practices

### subagents.md — Subagents

- Availability
- Typical workflow
- Managing subagents
- Approvals and sandbox controls
- Custom agents
  - Global settings
  - Custom agent file schema
  - Display nicknames
  - Example custom agents
    - Example 1: PR review
    - Example 2: Frontend integration debugging
- Process CSV batches with subagents (experimental)

### remote-connections.md — Remote connections

- Codex app
- Authentication and network exposure
- See also

### authentication.md — Authentication

- OpenAI authentication
  - Sign in with ChatGPT
  - Sign in with an API key
- Secure your Codex cloud account
- Login caching
- Credential storage
- Enforce a login method or workspace
- Login diagnostics
- Custom CA bundles
- Login on headless devices
  - Preferred: Device code authentication (beta)
  - Fallback: Authenticate locally and copy your auth cache
  - Fallback: Forward the localhost callback over SSH
- Alternative model providers
