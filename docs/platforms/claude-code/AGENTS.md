# claude-code/

Documentation for Claude Code (Anthropic), sourced from official docs.

## Files

`overview.md` · `quickstart.md` · `remote-control.md` · `code-review.md` · `github-actions.md` · `slack.md`

## File index with headings

### overview.md

- Claude Code overview
  - Documentation Index
  - Get started
    - Terminal
    - VS Code
    - Desktop app
    - Web
    - JetBrains
  - What you can do
    - Automate the work you keep putting off
    - Build features and fix bugs
    - Create commits and pull requests
    - Connect your tools with MCP
    - Customize with instructions, skills, and hooks
    - Run agent teams and build custom agents
    - Pipe, script, and automate with the CLI
    - Schedule recurring tasks
    - Work from anywhere
  - Use Claude Code everywhere
  - Next steps

### quickstart.md

- Quickstart
  - Before you begin
  - Step 1: Install Claude Code
    - Native Install (Recommended)
    - Homebrew
    - WinGet
    - Other Installation Methods
  - Step 2: Log in to your account
  - Step 3: Start your first session
  - Step 4: Ask your first question
  - Step 5: Make your first code change
  - Step 6: Use Git with Claude Code
  - Step 7: Fix a bug or add a feature
  - Step 8: Test out other common workflows
  - Essential commands
  - Pro tips for beginners
    - Be specific with your requests
    - Use step-by-step instructions
    - Let Claude explore first
    - Save time with shortcuts
  - What's next?
  - Getting help

### remote-control.md

- Continue local sessions from any device with Remote Control
  - Requirements
  - Start a Remote Control session
    - Server mode
    - Interactive session
    - From an existing session
    - VS Code
  - Connect from another device
  - Enable Remote Control for all sessions
  - Connection and security
  - Remote Control vs Claude Code on the web
  - Mobile push notifications
  - Limitations
  - Troubleshooting
    - "Remote Control requires a claude.ai subscription"
    - "Remote Control requires a full-scope login token"
    - "Unable to determine your organization for Remote Control eligibility"
    - "Remote Control is not yet enabled for your account"
    - "Remote Control is disabled by your organization's policy"
    - "Remote credentials fetch failed"
  - Choose the right approach
  - Related resources

### code-review.md

- Code Review
  - How reviews work
    - Severity levels
    - Rate and reply to findings
    - Check run output
    - What Code Review checks
  - Set up Code Review
  - Manually trigger reviews
  - Customize reviews
    - CLAUDE.md
    - REVIEW.md
      - What you can tune
      - Example
      - Keep it focused
  - View usage
  - Pricing
  - Troubleshooting
    - Retrigger a failed or timed-out review
    - Review didn't run and the PR shows a spend-cap message
    - Find issues that aren't showing as inline comments
  - Related resources

### github-actions.md

- Claude Code GitHub Actions
  - Why use Claude Code GitHub Actions?
  - What can Claude do?
    - Claude Code Action
  - Setup
  - Quick setup
  - Manual setup
  - Upgrading from Beta
    - Essential changes
    - Breaking Changes Reference
    - Before and After Example
  - Example use cases
    - Basic workflow
    - Using skills
    - Custom automation with prompts
    - Common use cases
  - Best practices
    - CLAUDE.md configuration
    - Security considerations
    - Optimizing performance
    - CI costs
  - Configuration examples
  - Using with AWS Bedrock & Google Vertex AI
    - Prerequisites
    - Create a custom GitHub App (Recommended for 3P Providers)
    - Configure cloud provider authentication
    - Add Required Secrets
    - Create workflow files
  - Troubleshooting
    - Claude not responding to @claude commands
    - CI not running on Claude's commits
    - Authentication errors
  - Advanced configuration
    - Action parameters
    - Pass CLI arguments
  - Customizing Claude's behavior

### slack.md

- Claude Code in Slack
  - Use cases
  - Prerequisites
  - Setting up Claude Code in Slack
  - How it works
    - Automatic detection
    - Context gathering
    - Session flow
  - User interface elements
    - App Home
    - Message actions
    - Repository selection
  - Access and permissions
    - User-level access
    - Workspace-level access
    - Channel-based access control
  - What's accessible where
  - Best practices
    - Writing effective requests
    - When to use Slack vs. web
  - Troubleshooting
    - Sessions not starting
    - Repository not showing
    - Wrong repository selected
    - Authentication errors
    - Session expiration
  - Current limitations
  - Related resources
