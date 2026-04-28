# kimi-code/

Documentation for Kimi Code (Moonshot AI), sourced from official docs.

## Files

### overview.md
- Kimi Code CLI
- Getting Started
- Key Features
  - Shell command mode
  - VS Code extension
  - IDE integration via ACP
  - Zsh integration
  - MCP support
    - kimi mcp sub-command group
    - Ad-hoc MCP configuration
  - More
- Development

### agents-md.md
- Kimi Code CLI — AGENTS.md
- Quick commands (use uv)
- Project overview
- Tech stack
- Architecture overview
- Major modules and interfaces
- Repo map
- Conventions and quality
- Git commit messages
- Versioning
- Release workflow

### home.md
- Kimi Code — Home Page
- One subscription, code anywhere
  - CLI example session
- Kimi Code Plans
  - Moderato — Advanced Flow
  - Allegretto — Pro Choice (Recommended)
  - Allegro — Premium Mode
  - Vivace — Ultimate Boost

### overview-docs.md
- Kimi Code Overview
- What is Kimi Code
- Core Advantages
- Getting Started
  - Using the Official Client
    - CLI
    - VS Code
- API Access
  - OAuth Automatic Authentication (Official Clients)
  - API Key (Third-Party Tools / Self-Built Apps)
    - Service Endpoint
    - Obtaining an API Key
    - Model ID
    - Configuring in Third-Party Tools
- Platform Comparison
- Quota and Limits

### faq.md
- Kimi Code FAQ
- Installation and Authentication
  - Empty model list during /login
  - Invalid API key
  - Membership expired or quota exhausted
- Interaction Issues
  - cd command doesn't work in shell mode
  - Working directory deleted or removed
  - Image paste fails
- ACP Issues
  - IDE cannot connect to Kimi Code CLI
- MCP Issues
  - MCP server startup fails
  - OAuth authorization fails
  - Header format error
- Print/Wire Mode Issues
  - Invalid JSONL input format
  - No output in print mode
- Updates and Upgrades
  - macOS slow first run
  - How to upgrade Kimi Code CLI
  - Update prompt on startup
  - How to disable update reminders
- VS Code Extension FAQ
  - VS Code prompts that no workspace is open
  - VS Code prompts that CLI cannot be found
  - VS Code login fails
  - VS Code sends messages with no response
  - VS Code connection timeout
  - VS Code error before sending a message
- Feedback and Contact
  - Documentation didn't solve your problem

### quick-start.md
- Kimi Code CLI — Quick Start
- Before You Start
- Installation
- First Run
  - Start and Log In
  - Step 1: Ask a Question
  - Step 2: Make a Code Change
  - Step 3: Execute a Command
- Common Commands Cheat Sheet
- FAQ
  - Why do I get an authentication failure after entering my API Key?
  - kimi command not found after installation
  - Browser doesn't pop up after /login
- Upgrade and Uninstall

### operations.md
- Kimi Code — Core Operations
- Input and Control
  - Multi-line Input
  - Clipboard and Media Paste
  - @ Path Completion
  - Slash Commands
  - Sending Messages While Running (Steer)
  - Side Questions
  - Approvals and Confirmations
  - Switching Models
  - Structured Questions
  - Background Tasks
- Context Management
  - Session Resumption
    - Resume the Most Recent Session
    - Interactive Session Selection
    - Resume a Specific Session
    - Switch Sessions During Operation
    - Resumption Prompt on Exit
    - Startup Replay
    - Session State Persistence
  - Export and Import
    - Export Session
    - Import Context
  - Clear and Compact
    - Clear Context
    - Compact Context
- Work Modes
  - Agent and Shell Mode
  - Plan Mode
    - Entering Plan Mode
    - Reviewing Plans
    - Managing Plan Mode
  - Thinking Mode
  - Print Mode
    - Basic Usage
    - Output Final Message Only
    - JSON Format
    - Message Format
    - Exit Codes
    - Use Cases

### config.md
- Kimi Code — Config Files
- Config File Location
- Configuration Items
- Complete Configuration Example
- providers
- models
- loop_control
- background
- services
  - moonshot_search
  - moonshot_fetch
- mcp
- hooks
- Config Overrides and Priority
  - Priority
  - CLI Parameters
  - Environment Variable Overrides
- JSON Configuration Migration

### env-vars.md
- Kimi Code — Environment Variables
- Kimi Environment Variables
  - KIMI_BASE_URL
  - KIMI_API_KEY
  - KIMI_MODEL_NAME
  - KIMI_MODEL_MAX_CONTEXT_SIZE
  - KIMI_MODEL_CAPABILITIES
  - KIMI_MODEL_TEMPERATURE
  - KIMI_MODEL_TOP_P
  - KIMI_MODEL_MAX_TOKENS
- OpenAI-Compatible Environment Variables
  - OPENAI_BASE_URL
  - OPENAI_API_KEY
- Other Environment Variables
  - KIMI_SHARE_DIR
  - KIMI_CLI_NO_AUTO_UPDATE
  - KIMI_CLI_PASTE_CHAR_THRESHOLD
  - KIMI_CLI_PASTE_LINE_THRESHOLD

### providers-models.md
- Kimi Code — Providers and Models
- Platform Selection
- Provider Types
  - kimi
  - openai_legacy
  - openai_responses
  - anthropic
  - gemini
  - vertexai
- Model Capabilities
  - thinking
  - always_thinking
  - image_in
  - video_in
- Search and Fetch Services

### data-locations.md
- Kimi Code — Data Locations
- Directory Structure
- Configuration and Metadata
  - config.toml
  - kimi.json
  - mcp.json
- Credentials
- Session Data
  - context.jsonl
  - wire.jsonl
  - state.json
  - subagents/\<agent_id\>/
- Plan Files
- Input History
- Logs
- Cleaning Data

### config-overrides.md
- Kimi Code — Config Overrides
- Priority
- CLI Parameters
  - Configuration file related
  - Model related
  - Behavior related
- Environment Variable Overrides
- Configuration Priority Example

### mcp.md
- Kimi Code — Model Context Protocol
- What is MCP
- MCP Server Management
  - Add a server
  - List servers
  - Remove a server
  - OAuth authorization
  - Test a server
- MCP Configuration File
  - Temporary configuration loading
- Loading Status
- Security
  - Approval mechanism
  - Prompt injection risks

### hooks.md
- Kimi Code — Hooks (Beta)
- What is a Hook
- Supported Hook Events
- Configuring Hooks
  - Configuration Fields
- Communication Protocol
  - Input (Standard Input)
  - Output (Exit Code)
  - Structured JSON Output
- Hook Script Examples
  - Protect Sensitive Files
  - Auto-format Code
  - Check for Incomplete Tasks
- Viewing Configured Hooks
- Design Principles
  - Fail-Open Policy
  - Parallel Execution
  - Stop Hook Anti-Loop
  - Context Variables
- Comparison with Plugins

### plugins.md
- Kimi Code — Plugins (Beta)
- What are Plugins
- Installing Plugins
  - Install from a local directory
  - Install from a ZIP file
  - Install from a Git repository
  - List installed plugins
  - View plugin details
  - Remove a plugin
- Creating a Plugin
  - Directory structure
  - plugin.json format
  - Field descriptions
  - Tool field descriptions
- Credential Injection
  - inject configuration example
  - Supported injection variables
  - config.json template
- Tool Script Specification
  - Input format
  - Output format
  - Python example
  - TypeScript example
- Bundling a Skill
  - Directory layout
- Complete Example
- Plugin Installation Location

### skills.md
- Kimi Code — Skills
- What are Agent Skills
- Skill Discovery
  - Built-in skills
  - User-level skills
  - Project-level skills
- Built-in Skills
- Creating a Skill
  - Directory structure
  - SKILL.md format
  - Frontmatter fields
  - Best practices
- Example Skills
  - PowerPoint creation
  - Python project standards
  - Git commit conventions
- Using Slash Commands to Load a Skill
- Flow Skills
  - Creating a flow skill
  - Flow diagram format
  - D2 format example
  - Executing a flow skill

### agents-subagents.md
- Kimi Code — Agents and Subagents
- Built-in Agents
  - default
  - okabe
- Custom Agent Files
  - Basic structure
  - Inheritance and overrides
  - Configuration fields
- System Prompt Built-in Parameters
  - System prompt example
- Defining Subagents in Agent Files
- Built-in Subagent Types
- How Subagents Run
- Built-in Tools List
  - Agent
  - AskUserQuestion
  - SetTodoList
  - Shell
  - ReadFile
  - ReadMediaFile
  - Glob
  - Grep
  - WriteFile
  - StrReplaceFile
  - SearchWeb
  - FetchURL
  - Think
  - SendDMail
  - EnterPlanMode
  - ExitPlanMode
  - TaskList
  - TaskOutput
  - TaskStop
- Tool Security Boundaries
  - Workspace scope
  - Approval mechanism
