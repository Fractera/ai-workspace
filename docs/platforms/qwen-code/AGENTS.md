# qwen-code/

Documentation for Qwen Code (Alibaba), sourced from official docs.

## Files

### overview.md
- Why Qwen Code?
- Installation
  - Quick Install (Recommended)
  - Manual Installation
- Quick Start
- Authentication
  - API Key (recommended)
  - Local Model Setup (Ollama / vLLM)
- Usage
  - Interactive mode
  - Headless mode
  - IDE integration
  - SDKs
- Commands & Shortcuts
  - Session Commands
  - Keyboard Shortcuts
- Configuration
- Benchmark Results
  - Terminal-Bench Performance
- Ecosystem
- Troubleshooting
- Connect with Us
- Acknowledgments

### commands.md
- 1. Slash Commands (/)
  - 1.1 Session and Project Management
  - 1.2 Interface and Workspace Control
  - 1.3 Language Settings
  - 1.4 Tool and Model Management
  - 1.5 Built-in Skills
  - 1.6 Side Question (/btw)
  - 1.7 Information, Settings, and Help
  - 1.8 Common Shortcuts
  - 1.9 CLI Auth Subcommands
- 2. @ Commands (Introducing Files)
- 3. Exclamation Commands (!) — Shell Command Execution
- 4. Custom Commands
  - Command Naming Rules
  - Markdown File Format Specification (Recommended)
  - TOML File Format (Deprecated)
  - Parameter Processing Mechanism
  - Practical Creation Example
  - Custom Command Best Practices

### workflows.md
- Understand new codebases
  - Get a quick codebase overview
  - Find relevant code
- Fix bugs efficiently
- Refactor code
- Use specialized subagents
- Work with tests
- Create pull requests
- Handle documentation
- Reference files and directories
- Resume previous conversations
  - How it works
- Run parallel Qwen Code sessions with Git worktrees
- Use Qwen Code as a unix-style utility
  - Add Qwen Code to your verification process
  - Pipe in, pipe out
  - Control output format
- Ask Qwen Code about its capabilities

### quick-start.md
- Before you begin
- Step 1: Install Qwen Code
  - Quick Install (Recommended)
  - Manual Installation
- Step 2: Log in to your account
- Step 3: Start your first session
- Chat with Qwen Code
  - Ask your first question
  - Make your first code change
  - Use Git with Qwen Code
  - Fix a bug or add a feature
- Test out other common workflows
- Essential commands
- Pro tips for beginners

### channels.md
- How It Works
- Quick Start
- Configuration
  - Options
  - Sender Policy
  - Session Scope
  - Token Security
- DM Pairing
  - Pairing CLI Commands
  - Pairing Rules
- Group Chats
  - Group Policy
  - Mention Gating
  - How group messages are evaluated
  - Telegram Setup for Groups
  - Finding a Group Chat ID
- Media Support
  - Images
  - Files
  - Platform differences
- Dispatch Modes
- Block Streaming
  - How it works
- Slash Commands
- Running
- Multi-Channel Mode
- Service Management
- Crash Recovery

### channels-telegram.md
- Prerequisites
- Creating a Bot
- Finding Your User ID
- Configuration
- Running
- Group Chats
- Images and Files
- Tips
- Message Formatting
- Troubleshooting
  - Bot doesn't respond
  - Bot doesn't respond in groups
  - "Sorry, something went wrong processing your message"
  - Bot takes a long time to respond

### channels-wechat.md
- Prerequisites
- Setup
  - 1. Log in via QR code
  - 2. Configure the channel
  - 3. Start the channel
- Images and Files
- Configuration Options
- Key Differences from Telegram
- Tips
- Troubleshooting
  - "WeChat account not configured"
  - "Session expired (errcode -14)"
  - Bot doesn't respond
  - Images not working

### channels-dingtalk.md
- Prerequisites
- Creating a Bot
- Stream Mode
- Configuration
- Running
- Group Chats
  - Finding a Group's Conversation ID
- Images and Files
- Key Differences from Telegram
- Tips
- Troubleshooting
  - Bot doesn't connect
  - Bot doesn't respond in groups
  - "No sessionWebhook in message"
  - "Sorry, something went wrong processing your message"

### auth.md
- Option 1: Qwen OAuth (Free)
- Option 2: Alibaba Cloud Coding Plan
  - Interactive setup
  - Alternative: configure via settings.json
- Option 3: API Key (flexible)
  - Recommended: One-file setup via settings.json
  - Supported protocols
  - Step 1: Configure models and providers in ~/.qwen/settings.json
  - Step 2: Set environment variables
  - Step 3: Switch models with /model
- qwen auth CLI command
  - Interactive mode
  - Subcommands
- Security notes

### qwenignore.md
- How it works
- How to use .qwenignore
- .qwenignore examples

### trusted-folders.md
- Enabling the Feature
- How It Works: The Trust Dialog
- Why Trust Matters: The Impact of an Untrusted Workspace
- Managing Your Trust Settings
- The Trust Check Process (Advanced)

### themes.md
- Available Themes
- Changing Themes
- Theme Persistence
- Custom Color Themes
  - How to Define a Custom Theme
- Loading Themes from a File
- Using Your Custom Theme
- Themes Preview

### config.md
- Configuration layers
- Settings files
- The .qwen directory in your project
- Configuration migration
  - Consolidation policy for disableAutoUpdate and disableUpdateNag
- Available settings in settings.json
  - general
  - output
  - ui
  - ide
  - privacy
  - model
  - fastModel
  - context
  - tools
  - permissions
  - mcp
  - lsp
  - security
  - advanced
  - mcpServers
  - telemetry
- Example settings.json
- Shell History
- Environment Variables & .env Files
  - Environment Variables Table
- Command-Line Arguments
- Context Files (Hierarchical Instructional Context)
- Sandbox
- Usage Statistics

### scheduled-tasks.md
- Schedule a recurring prompt with /loop
- Interval syntax
- Loop over another command
- Manage loops
- Set a one-time reminder
- Manage scheduled tasks
- How scheduled tasks run
- Jitter
- Three-day expiry
- Cron expression reference
- Limitations

### status-line.md
- Prerequisites
- Quick setup
- Manual configuration
- JSON input
- Examples
  - Model and token usage
  - Git branch + directory
  - File change stats
  - Script file for complex commands
- Behavior
- Troubleshooting

### hooks.md
- Overview
- What are Hooks?
- Hook Architecture
- Hook Events
- Input/Output Rules
  - Hook Input Structure
- Individual Hook Event Details
  - PreToolUse
  - PostToolUse
  - PostToolUseFailure
  - UserPromptSubmit
  - SessionStart
  - SessionEnd
  - Stop
  - SubagentStart
  - SubagentStop
  - PreCompact
  - Notification
  - PermissionRequest
- Hook Configuration
- Matcher Patterns
- Hook Execution
  - Parallel vs Sequential Execution
  - Security Model
  - Exit Codes
- Best Practices
  - Example 1: Security Validation Hook
  - Example 2: User Prompt Validation Hook
- Troubleshooting

### channels-plugins.md
- How It Works
- Installing a Custom Channel
- Configuring a Custom Channel
- Starting the Channel
- What You Get for Free
- Building Your Own Channel Plugin

### i18n.md
- Overview
- UI Language
  - Setting the UI Language
  - Auto-detection
- LLM Output Language
  - How It Works
  - Auto-detection
  - Manual Setting
  - File Location
- Configuration
  - Via Settings Dialog
  - Via Environment Variable
- Custom Language Packs
  - Language Pack Format
- Related Commands

### token-caching.md
- How It Benefits You
- Monitoring Your Savings
- Example Stats Display

### sandboxing.md
- Prerequisites
- Overview of sandboxing
- Sandboxing methods
  - 1. macOS Seatbelt (macOS only)
  - 2. Container-based (Docker/Podman)
  - Choosing a method
- Quickstart
- Configuration
  - Enable sandboxing (in order of precedence)
  - Configure the sandbox image (Docker/Podman)
  - macOS Seatbelt profiles
  - Custom Seatbelt profiles (macOS)
  - Custom Sandbox Flags
  - Network proxying (all sandbox methods)
  - Linux UID/GID handling
- Troubleshooting
  - Common issues
- Security notes
- Related documentation

### lsp.md
- Overview
- Quick Start
- Prerequisites
- Configuration
  - .lsp.json File
  - C/C++ (clangd) configuration
  - Java (jdtls) configuration
  - Configuration Options
  - TCP/Socket Transport
- Available LSP Operations
  - Code Navigation
  - Symbol Information
  - Call Hierarchy
  - Diagnostics
  - Code Actions
- Security
  - Trust Controls
  - Per-Server Trust Override
- Troubleshooting
  - Server Not Starting
  - Slow Performance
  - No Results
  - Debugging
- Claude Code Compatibility
  - Configuration Format
- Best Practices
- FAQ

### mcp.md
- What you can do with MCP
- Quick start
  - Add your first server
- Where configuration is stored (scopes)
- Configure servers
  - Choose a transport
  - Configure via settings.json vs qwen mcp add
  - Stdio server (local process)
  - HTTP server (remote streamable HTTP)
  - SSE server (remote Server-Sent Events)
- Safety and control
  - Trust (skip confirmations)
  - Tool filtering (allow/deny tools per server)
  - Global allow/deny lists
- Troubleshooting
- Reference
  - settings.json structure
  - Manage MCP servers with qwen mcp

### approval-mode.md
- Permission Modes Comparison
- Quick Reference Guide
- 1. Use Plan Mode for safe code analysis
  - When to use Plan Mode
  - How to use Plan Mode
- 2. Use Default Mode for Controlled Interaction
  - When to use Default Mode
  - How to use Default Mode
- 3. Auto Edits Mode
  - When to use Auto-Accept Edits Mode
  - How to switch to this mode
  - Workflow Example
- 4. YOLO Mode — Full Automation
  - When to use YOLO Mode
  - How to enable YOLO Mode
- Mode Switching & Configuration
  - Keyboard Shortcut Switching
  - Persistent Configuration
  - Mode Usage Recommendations

### headless-mode.md
- Overview
- Basic Usage
  - Direct Prompts
  - Stdin Input
  - Combining with File Input
  - Resume Previous Sessions (Headless)
- Customize the Main Session Prompt
  - Override the Built-in System Prompt
  - Append Extra Instructions
- Output Formats
  - Text Output (Default)
  - JSON Output
  - Stream-JSON Output
- Input Format
- File Redirection
- Configuration Options
- Examples
  - Code review
  - Generate commit messages
  - API documentation
  - Batch code analysis
  - PR code review
  - Log analysis
  - Release notes generation
  - Model and tool usage tracking

### skills.md
- What are Agent Skills?
  - How Skills are invoked
  - Benefits
- Create a Skill
  - Personal Skills
  - Project Skills
- Write SKILL.md
  - Field requirements
- Add supporting files
- View available Skills
  - Extension Skills
- Test a Skill
- Debug a Skill
  - Make the description specific
  - Verify file path
  - Check YAML syntax
  - View errors
- Share Skills with your team
- Update a Skill
- Remove a Skill
- Best practices
  - Keep Skills focused
  - Write clear descriptions
  - Test with your team

### agent-arena.md
- When to use Agent Arena
- Start an arena session
  - What happens when you start
- Interact with agents
  - Display modes
  - Navigate between agents
  - Interact with individual agents
- Compare results and select a winner
  - What happens when you select a winner
- Configuration
- Best practices
  - Choose models that complement each other
  - Keep tasks self-contained
  - Limit the number of agents
  - Use Arena for high-impact decisions
- Troubleshooting
  - Agents failing to start
  - Worktree creation fails
  - Agent takes too long
  - Applying winner fails
- Limitations
- Comparison with other multi-agent modes
- Next steps

### subagents.md
- What are Subagents?
- Key Benefits
- How Subagents Work
- Getting Started
  - Quick Start
  - Example Usage
- Management
  - CLI Commands
  - Storage Locations
  - Extension Subagents
- File Format
  - Basic Structure
  - Model Selection
  - Example Usage
- Using Subagents Effectively
  - Automatic Delegation
  - Explicit Invocation
- Examples
  - Development Workflow Agents
  - Technology-Specific Agents
- Best Practices
  - Design Principles
  - Configuration Best Practices
  - Security Considerations
- Limits

### followup-suggestions.md
- How It Works
- Accepting Suggestions
- When Suggestions Appear
- Fast Model
- Configuration
- Monitoring
- Suggestion Quality

### code-review.md
- Quick Start
- How It Works
- Review Agents
- Deterministic Analysis
- Severity Levels
- Autofix
- Worktree Isolation
- Cross-repo PR Review
- PR Inline Comments
- Follow-up Actions
- Project Review Rules
- Incremental Review
- Cross-model Review
- Review Reports
- Cross-file Impact Analysis
- Token Efficiency
- What's NOT Flagged
- Design Philosophy

### agents-md.md
- Common Commands
  - Building
  - Development
- Unit Testing
- Integration Testing
- Linting & Formatting
- Code Conventions
- Development Guidelines
  - General workflow
  - Feature development
  - Bugfix
- GitHub Operations
- Testing, Debugging, and Bug Fixes
- Submitting PRs
- Project Directories
