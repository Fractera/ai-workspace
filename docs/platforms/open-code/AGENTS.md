# open-code/

Documentation for Open Code, sourced from official docs.

> **Note:** Project archived. Continued as [Crush](https://github.com/charmbracelet/crush) by the original author and the Charm team.

## Files

### `rules.md`

- Rules
- Initialize
- Example
- Types
  - Project
  - Global
- Claude Code Compatibility
- Precedence
- Custom Instructions
- Referencing External Files
  - Using opencode.json
  - Manual Instructions in AGENTS.md

### `tools.md`

- Tools
- Configure
- Built-in
  - bash
  - edit
  - write
  - read
  - grep
  - glob
  - lsp (experimental)
  - apply_patch
  - skill
  - todowrite
  - webfetch
  - websearch
  - question
- Custom tools
- MCP servers
- Internals
  - Ignore patterns

### `cli.md`

- CLI
- tui
  - Flags
- Commands
  - agent
    - attach
    - create
    - list
  - auth
    - login
    - list
    - logout
  - github
    - install
    - run
  - mcp
    - add
    - list
    - auth
    - logout
    - debug
  - models
  - run
  - serve
  - session
    - list
  - stats
  - export
  - import
  - web
  - acp
  - uninstall
  - upgrade
- Global Flags
- Environment variables
- Experimental

### `tui.md`

- TUI
- File references
- Bash commands
- Commands
  - connect
  - compact
  - details
  - editor
  - exit
  - export
  - help
  - init
  - models
  - new
  - redo
  - sessions
  - share
  - themes
  - thinking
  - undo
  - unshare
- Editor setup
- Configure
  - Options
- Customization

### `go.md`

- Go
- Background
- How it works
- Usage limits
- Usage beyond limits
- Endpoints
- Models
- Privacy
- Goals

### `providers.md`

- Providers
- Credentials
- Config
  - Base URL
- OpenCode Zen
- OpenCode Go
- Directory
  - 302.AI
  - Amazon Bedrock
    - Environment Variables (Quick Start)
    - Configuration File (Recommended)
    - Advanced: VPC Endpoints
    - Authentication Methods
    - Authentication Precedence
  - Anthropic
  - Azure OpenAI
  - Azure Cognitive Services
  - Baseten
  - Cerebras
  - Cloudflare AI Gateway
  - Cloudflare Workers AI
  - Cortecs
  - DeepSeek
  - Deep Infra
  - Firmware
  - Fireworks AI
  - GitLab Duo
    - Using OAuth (Recommended)
    - Using Personal Access Token
    - Self-Hosted GitLab
    - OAuth for Self-Hosted instances
    - Configuration
    - GitLab Duo Agent Platform (DAP) Workflow Models
    - GitLab API Tools (Optional, but highly recommended)
  - GitHub Copilot
  - Google Vertex AI
  - Groq
  - Hugging Face
  - Helicone
    - Optional Configs
    - Custom Headers
    - Session tracking
    - Common Helicone headers
  - llama.cpp
  - IO.NET
  - LM Studio
  - Moonshot AI
  - MiniMax
  - NVIDIA
    - On-Prem / NIM
    - Environment Variable
  - Nebius Token Factory
  - Ollama
  - Ollama Cloud
  - OpenAI
    - Using API keys
  - OpenCode Zen (via `/connect`)
  - OpenRouter
  - LLM Gateway
  - SAP AI Core
  - STACKIT
  - OVHcloud AI Endpoints
  - Scaleway
  - Together AI
  - Venice AI
  - Vercel AI Gateway
  - xAI
  - Z.AI
  - ZenMux
- Custom provider
  - Example
- Troubleshooting

### `config.md`

- Config
- Format
- Locations
  - Precedence order
  - Remote
  - Global
  - Per project
  - Custom path
  - Custom directory
- Managed settings
  - File-based
  - macOS managed preferences
    - Creating a `.mobileconfig`
    - Deploying via MDM
    - Verifying on a device
- Schema
- TUI
- Server
- Shell
- Tools
- Models
  - Provider-Specific Options
    - Amazon Bedrock
- Themes
- Agents
  - Default agent
- Sharing
- Commands
- Keybinds
- Snapshot
- Autoupdate
- Formatters
- Permissions
- Compaction
- Watcher
- MCP servers
- Plugins
- Instructions
- Disabled providers
- Enabled providers
- Experimental
- Variables
  - Env vars
  - Files

### `quick-start.md`

- Get Started with OpenCode
- Prerequisites
- Install
  - Using Node.js
  - Using Homebrew on macOS and Linux
  - Installing on Arch Linux
  - Windows
- Configure
- Initialize
- Usage
  - Ask Questions
  - Add Features
    - Create a Plan
    - Iterate on the Plan
    - Build the Feature
  - Make Changes
  - Undo Changes
  - Share
- Customize

### `overview.md`

- OpenCode
- Overview
- Features
- Installation
  - Using the Install Script
  - Using Homebrew (macOS and Linux)
  - Using AUR (Arch Linux)
  - Using Go
- Configuration
  - Auto Compact Feature
  - Environment Variables
  - Shell Configuration
  - Configuration File Structure
- Supported AI Models
  - OpenAI
  - Anthropic
  - GitHub Copilot
  - Google
  - AWS Bedrock
  - Groq
  - Azure OpenAI
  - Google Cloud VertexAI
- Usage
  - Non-interactive Prompt Mode
  - Output Formats
  - Command-line Flags
- Keyboard Shortcuts
  - Global Shortcuts
  - Chat Page Shortcuts
  - Editor Shortcuts
  - Session Dialog Shortcuts
  - Model Dialog Shortcuts
  - Permission Dialog Shortcuts
  - Logs Page Shortcuts
- AI Assistant Tools
  - File and Code Tools
  - Other Tools
- Architecture
- Custom Commands
  - Creating Custom Commands
  - Command Arguments
  - Organizing Commands
  - Using Custom Commands
  - Built-in Commands
- MCP (Model Context Protocol)
  - MCP Features
  - Configuring MCP Servers
  - MCP Tool Usage
- LSP (Language Server Protocol)
  - LSP Features
  - Configuring LSP
  - LSP Integration with AI
- Using Github Copilot
  - Requirements
- Using a Self-hosted Model Provider
  - Configuring a Self-hosted Provider
  - Configuring a Self-hosted Model
- Development
  - Prerequisites
  - Building from Source
- Acknowledgments
- License
- Contributing
