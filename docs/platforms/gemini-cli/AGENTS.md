# gemini-cli/

Documentation for Gemini CLI (Google), sourced from official docs.

## Files

### overview.md

- Gemini CLI
- 🚀 Why Gemini CLI?
- 📦 Installation
  - Quick Install
  - Release Channels
- 📋 Key Features
  - Code Understanding & Generation
  - Automation & Integration
  - Advanced Capabilities
  - GitHub Integration
- 🔐 Authentication Options
  - Option 1: Sign in with Google (OAuth login using your Google Account)
  - Option 2: Gemini API Key
  - Option 3: Vertex AI
- 🚀 Getting Started
  - Basic Usage
  - Quick Examples
- 📚 Documentation
  - Getting Started
  - Core Features
  - Tools & Extensions
  - Advanced Topics
  - Troubleshooting & Support
- Using MCP Servers
- 🤝 Contributing
- 📖 Resources
- 📄 Legal

### gemini-md.md

- GEMINI.md — Gemini CLI Project Context
- Project Overview
- Building and Running
- Testing and Quality
  - Test Commands
- Development Conventions
- Testing Conventions
- Documentation

### install.md

- Gemini CLI installation, execution, and releases
- Recommended system specifications
- Install Gemini CLI
- Run Gemini CLI
- Releases

### auth.md

- Gemini CLI authentication setup
- Choose your authentication method
  - What is my Google account type?
- (Recommended) Sign in with Google
  - Do I need to set my Google Cloud project?
- Use Gemini API key
- Use Vertex AI
  - A. Vertex AI — application default credentials (ADC) using `gcloud`
  - B. Vertex AI — service account JSON key
  - C. Vertex AI — Google Cloud API key
- Set your Google Cloud project
- Persisting environment variables
- Running in Google Cloud environments
- Running in headless mode
- What's next?

### cli-reference.md

- Gemini CLI cheatsheet
- CLI commands
  - Positional arguments
- Interactive commands
- CLI Options
- Model selection
  - Model aliases
- Extensions management
- MCP server management
- Skills management

### models.md

- Gemini 3 Pro and Gemini 3 Flash on Gemini CLI
- How to get started with Gemini 3 on Gemini CLI
  - Usage limits and fallback
  - Capacity errors
  - Model selection and routing types
- How to enable Gemini 3 with Gemini CLI on Gemini Code Assist
  - Administrator instructions
  - User instructions
- Next steps

### file-management.md

- File management with Gemini CLI
- Prerequisites
- Providing context by reading files
  - Direct file inclusion (`@`)
  - Working with multiple files
  - Including entire directories
- How to find files (Exploration)
  - Scenario: Find a component definition
- How to modify code
  - Creating new files
- Review and confirm changes
- Verify the result
- Advanced: Controlling what Gemini sees
- Next steps

### skills.md

- Get started with Agent Skills
- How to create a skill
  - Create the directory structure
  - Create the definition
  - Add the tool logic
- How to verify discovery
- How to use the skill
- Next steps

### memory.md

- Manage context and memory
- Prerequisites
- Why manage context?
- How to define project-wide rules (GEMINI.md)
  - Scenario: Create a project context file
  - Scenario: Using the hierarchy
- How to teach the agent facts (Memory)
  - Scenario: Saving a memory
  - Scenario: Using memory in conversation
- How to manage and inspect context
  - Scenario: View active context
  - Scenario: Refresh context
- Best practices
- Next steps

### shell-commands.md

- Execute shell commands
- Prerequisites
- How to run commands directly (`!`)
  - Scenario: Entering Shell mode
- How to automate complex tasks
  - Scenario: Run tests and fix failures
- How to manage background processes
  - Scenario: Viewing active shells
- How to handle interactive commands
- Safety features
  - Confirmation prompts
  - Sandboxing
- Next steps

### sessions.md

- Manage sessions and history
- Prerequisites
- How to resume where you left off
  - Scenario: Resume the last session
  - Scenario: Browse past sessions
- How to manage your workspace
  - Scenario: Deleting sessions
- How to rewind time (Undo mistakes)
  - Scenario: Triggering rewind
  - Scenario: Choosing a restore point
  - Scenario: Choosing what to revert
- How to fork conversations
- Next steps

### task-planning.md

- Plan tasks with todos
- Prerequisites
- Why use task planning?
- How to ask for a plan
- How to review and iterate
- How to execute the plan
- How to monitor progress (`Ctrl+T`)
- How to handle unexpected changes
- Next steps

### plan-mode.md

- Use Plan Mode with model steering for complex tasks
- Prerequisites
- Why combine Plan Mode and model steering?
- Step 1: Start a complex task
- Step 2: Steer the research phase
- Step 3: Refine the design mid-turn
- Step 4: Approve and implement
- Tips for effective steering
- Next steps

### web-search.md

- Web search and fetch
- Prerequisites
- How to research new technologies
  - Scenario: Find documentation
- How to fetch deep context
  - Scenario: Reading a blog post
  - Scenario: Comparing sources
- How to apply knowledge to code
- How to troubleshoot errors
- Next steps

### mcp-setup.md

- Set up an MCP server
- Prerequisites
- How to prepare your credentials
- How to configure Gemini CLI
- How to verify the connection
- How to use the new tools
  - Scenario: Listing pull requests
  - Scenario: Creating an issue
- Troubleshooting
- Next steps

### headless.md

- Automate tasks with headless mode
- Prerequisites
- Why headless mode?
- How to use headless mode
- How to pipe input to Gemini CLI
- Use Gemini CLI output in scripts
  - Scenario: Bulk documentation generator
- Extract structured JSON data
  - Scenario: Extract and return structured data
- Build your own custom AI tools
  - Scenario: Create a "Smart Commit" alias
- Next steps

### extensions.md

- Gemini CLI extensions
- Choose your path
  - I want to use extensions
  - I want to build extensions
- Manage extensions
- Installation

### extensions-build.md

- Build Gemini CLI extensions
- Prerequisites
- Extension features
- Step 1: Create a new extension
- Step 2: Understand the extension files
  - `gemini-extension.json`
  - `example.js`
  - `package.json`
- Step 3: Add extension settings
- Step 4: Link your extension
- Step 5: Add a custom command
- Step 6: Add a custom `GEMINI.md`
- (Optional) Step 7: Add an Agent Skill
- Step 8: Release your extension
- Next steps

### extensions-release.md

- Release extensions
- List your extension in the gallery
- Release through a Git repository
  - Manage release channels
- Release through GitHub Releases
  - Custom pre-built archives
    - Platform-specific archives
    - Archive structure
    - Example GitHub Actions workflow
- Migrating an Extension Repository

### agent-skills.md

- Agent Skills
- Overview
- Key Benefits
- Skill Discovery Tiers
- Managing Skills
  - In an Interactive Session
  - From the Terminal
- How it Works
  - Skill activation
- Creating your own skills

### auto-memory.md

- Auto Memory
- Overview
- Prerequisites
- How to enable Auto Memory
- How Auto Memory works
- How to review extracted skills
- How to disable Auto Memory
- Data and privacy
- Limitations
- Next steps

### checkpointing.md

- Checkpointing
- How it works
- Enabling the feature
- Using the `/restore` command
  - List available checkpoints
  - Restore a specific checkpoint

### worktrees.md

- Git Worktrees (experimental)
- How to enable Git worktrees
- How to use Git worktrees
- How to exit a Git worktree session
- Resuming work in a Git worktree
- Managing Git worktrees manually

### hooks.md

- Gemini CLI hooks
- What are hooks?
  - Getting started
- Core concepts
  - Hook events
  - Global mechanics
    - Strict JSON requirements (The "Golden Rule")
    - Exit codes
    - Matchers
- Configuration
  - Configuration schema
    - Hook configuration fields
  - Environment variables
- Security and risks
- Managing hooks

### hooks-reference.md

- Hooks reference
- Global hook mechanics
- Configuration schema
  - Hook definition
  - Hook configuration
- Base input schema
- Common output fields
- Tool hooks
  - Matchers and tool names
  - `BeforeTool`
  - `AfterTool`
- Agent hooks
  - `BeforeAgent`
  - `AfterAgent`
- Model hooks
  - `BeforeModel`
  - `BeforeToolSelection`
  - `AfterModel`
- Lifecycle & system hooks
  - `SessionStart`
  - `SessionEnd`
  - `Notification`
  - `PreCompress`
- Stable Model API

### headless-reference.md

- Headless mode reference
- Technical reference
  - Output formats
    - JSON output
    - Streaming JSON output
- Exit codes
- Next steps

### mcp.md

- MCP servers with Gemini CLI
- What is an MCP server?
- Core integration architecture
  - Discovery Layer (`mcp-client.ts`)
  - Execution layer (`mcp-tool.ts`)
  - Transport mechanisms
- Working with MCP resources
  - Discovery and listing
  - Referencing resources in a conversation
- How to set up your MCP server
  - Configure the MCP server in settings.json
    - Global MCP settings (`mcp`)
    - Server-specific configuration (`mcpServers`)
  - Configuration structure
  - Configuration properties
  - Environment variable expansion
  - Security and environment sanitization
  - OAuth support for remote MCP servers
  - Example configurations
- Discovery process deep dive
- Tool execution flow
- How to interact with your MCP server
- Status monitoring and troubleshooting
  - Overriding extension configurations
  - Server status
  - Discovery state
  - Common issues
  - Debugging tips
- Important notes
- Returning rich content from tools
  - Supported content block types
  - Example: Returning text and an image
- MCP prompts as slash commands
  - Defining prompts on the server
  - Invoking prompts
- Managing MCP servers with `gemini mcp`
  - Adding a server (`gemini mcp add`)
  - Listing servers (`gemini mcp list`)
  - Removing a server (`gemini mcp remove`)
  - Enabling/disabling a server
- Troubleshooting and Diagnostics
- Instructions

### mcp-resources.md

- MCP resource tools
- 1. `list_mcp_resources` (ListMcpResources)
- 2. `read_mcp_resource` (ReadMcpResource)

### model-routing.md

- Model routing
- How it works
- Local Model Routing (Experimental)
- Model selection precedence

### model-selection.md

- Gemini CLI model selection (`/model` command)
- How to use the `/model` command
- Best practices for model selection

### model-steering.md

- Model steering (experimental)
- Enabling model steering
- Using model steering
  - Common use cases
- How it works
- Next steps

### plan-mode-reference.md

- Plan Mode
- How to enter Plan Mode
  - Launch in Plan Mode
  - Enter Plan Mode manually
- How to use Plan Mode
  - Collaborative plan editing
- How to exit Plan Mode
- Tool Restrictions
- Customization and best practices
  - Custom planning with skills
  - Custom policies
    - Global vs. mode-specific rules
    - Example: Automatically approve read-only MCP tools
    - Example: Allow git commands in Plan Mode
    - Example: Enable custom subagents in Plan Mode
  - Custom plan directory and policies
  - Using hooks with Plan Mode
    - Example: Archive approved plans to GCS (`AfterTool`)
- Commands
- Planning workflows
  - Built-in planning workflow
  - Custom planning workflows
    - Conductor
    - Build your own
- Automatic Model Routing
- Cleanup
- Non-interactive execution

### notifications.md

- Notifications (experimental)
- Requirements
  - Terminal support
- Enable notifications
- Types of notifications
- Next steps

### subagents.md

- Subagents
- What are subagents?
- How to use subagents
  - Automatic delegation
  - Forcing a subagent (@ syntax)
- Built-in subagents
  - Codebase Investigator
  - CLI Help Agent
  - Generalist Agent
  - Browser Agent (experimental)
    - Prerequisites
    - Enabling the browser agent
    - Session modes
    - First-run consent
    - Configuration reference
    - Automation overlay and input blocking
    - Security
    - Visual agent
    - Sandbox support
      - macOS seatbelt (`sandbox-exec`)
      - Container sandboxes (Docker / Podman)
- Creating custom subagents
  - Agent definition files
  - File format
  - Configuration schema
  - Tool wildcards
  - Isolation and recursion protection
- Subagent tool isolation
  - Configuring isolated tools and servers
  - Subagent-specific policies
- Managing subagents
  - Interactive management (/agents)
  - Persistent configuration (settings.json)
    - `agents.overrides`
    - `modelConfigs.overrides`
    - Safety policies (TOML)
  - Optimizing your subagent
- Remote subagents (Agent2Agent)
- Extension subagents
- Disabling subagents

### remote-agents.md

- Remote Subagents
- Proxy support
- Defining remote subagents
  - Configuration schema
  - Single-subagent example
  - Multi-subagent example
  - Inline Agent Card JSON
- Authentication
  - Supported auth types
  - Dynamic values
  - API key (`apiKey`)
  - HTTP authentication (`http`)
    - Bearer token
    - Basic authentication
    - Raw scheme
  - Google Application Default Credentials (`google-credentials`)
    - How token selection works
    - Setup
    - Allowed hosts
    - Examples
  - OAuth 2.0 (`oauth`)
  - Auth validation
  - Auth retry behavior
  - Agent card fetching and auth
- Managing Subagents
- Disabling remote agents

### rewind.md

- Rewind
- Usage
- Interface
- Key considerations

### sandboxing.md

- Sandboxing in Gemini CLI
- Prerequisites
- Overview of sandboxing
- Quickstart
  - Using the command flag
  - Using an environment variable
  - Configuring via settings.json
- Configuration
- Sandboxing methods
  - 1. macOS Seatbelt (macOS only)
  - 2. Container-based (Docker/Podman)
  - 3. Windows Native Sandbox (Windows only)
  - 4. gVisor / runsc (Linux only)
  - 5. LXC/LXD (Linux only, experimental)
- Tool sandboxing
  - How to turn off tool sandboxing
- Sandbox expansion
  - How sandbox expansion works
  - Including files outside the workspace
- Running inside a Docker container
- Advanced settings
  - Custom sandbox flags
  - Linux UID/GID handling
- Troubleshooting
  - Common issues
  - Debug mode
  - Inspect sandbox
- Security notes
- Related documentation

### settings.md

- Gemini CLI settings (`/settings` command)
- Settings reference
  - General
  - Output
  - UI
  - IDE
  - Billing
  - Model
  - Agents
  - Context
  - Tools
  - Security
  - Advanced
  - Experimental
  - Skills
  - HooksConfig

### gemini-md-context.md

- Provide context with GEMINI.md files
- Understand the context hierarchy
  - Example `GEMINI.md` file
- Manage context with the `/memory` command
- Modularize context with imports
- Customize the context file name
- Next steps

### custom-commands.md

- Custom commands
- File locations and precedence
- Naming and namespacing
- TOML file format (v1)
  - Required fields
  - Optional fields
- Handling arguments
  - 1. Context-aware injection with `{{args}}`
    - A. Raw injection (outside shell commands)
    - B. Using arguments in shell commands (inside `!{...}` blocks)
  - 2. Default argument handling
  - 3. Executing shell commands with `!{...}`
  - 4. Injecting file content with `@{...}`
- Example: A "Pure Function" refactoring command

### model-config.md

- Advanced Model Configuration
- 1. System Overview
- 2. Configuration Primitives
  - Aliases (`customAliases`)
  - Overrides (`overrides`)
- 3. Resolution Strategy
  - Step 1: Alias Resolution
  - Step 2: Override Application
- 4. Configuration Reference
  - `ModelConfig` Object
  - `GenerateContentConfig` (Common Parameters)
- 5. Practical Examples
  - Defining a Deterministic Baseline
  - Agent-Specific Parameter Injection
  - Experimental Model Evaluation

### observability.md

- Observability with OpenTelemetry
- OpenTelemetry integration
- Configuration
- Google Cloud telemetry
  - Prerequisites
  - Direct export
  - View Google Cloud telemetry
    - Monitoring dashboards
- Local telemetry
- Client identification
  - Automatic identification
  - Custom identification
- Logs, metrics, and traces
  - Logs
    - Sessions
    - Approval mode
    - Tools
    - Files
    - API
    - Model routing
    - Chat and streaming
    - Resilience
    - Extensions
    - Agent runs
    - IDE
    - UI
    - Miscellaneous
  - Metrics
    - Custom metrics
    - GenAI semantic convention
  - Traces
