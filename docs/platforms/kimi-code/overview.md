# Kimi Code CLI

Kimi Code CLI is an AI agent that runs in the terminal, helping you complete software development tasks and terminal operations. It can read and edit code, execute shell commands, search and fetch web pages, and autonomously plan and adjust actions during execution.

## Getting Started

See Getting Started for how to install and start using Kimi Code CLI.

## Key Features

### Shell command mode

Kimi Code CLI is not only a coding agent, but also a shell. You can switch the shell command mode by pressing Ctrl-X. In this mode, you can directly run shell commands without leaving Kimi Code CLI.

> **Note**
> Built-in shell commands like `cd` are not supported yet.

### VS Code extension

Kimi Code CLI can be integrated with Visual Studio Code via the Kimi Code VS Code Extension.

### IDE integration via ACP

Kimi Code CLI supports Agent Client Protocol out of the box. You can use it together with any ACP-compatible editor or IDE.

To use Kimi Code CLI with ACP clients, make sure to run Kimi Code CLI in the terminal and send `/login` to complete the login first. Then, you can configure your ACP client to start Kimi Code CLI as an ACP agent server with command `kimi acp`.

For example, to use Kimi Code CLI with Zed or JetBrains, add the following configuration to your `~/.config/zed/settings.json` or `~/.jetbrains/acp.json` file:

```json
{
  "agent_servers": {
    "Kimi Code CLI": {
      "type": "custom",
      "command": "kimi",
      "args": ["acp"],
      "env": {}
    }
  }
}
```

Then you can create Kimi Code CLI threads in IDE's agent panel.

### Zsh integration

You can use Kimi Code CLI together with Zsh, to empower your shell experience with AI agent capabilities.

Install the zsh-kimi-cli plugin via:

```bash
git clone https://github.com/MoonshotAI/zsh-kimi-cli.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/kimi-cli
```

> **Note**
> If you are using a plugin manager other than Oh My Zsh, you may need to refer to the plugin's README for installation instructions.

Then add `kimi-cli` to your Zsh plugin list in `~/.zshrc`:

```
plugins=(... kimi-cli)
```

After restarting Zsh, you can switch to agent mode by pressing Ctrl-X.

### MCP support

Kimi Code CLI supports MCP (Model Context Protocol) tools.

#### kimi mcp sub-command group

You can manage MCP servers with `kimi mcp` sub-command group. For example:

```bash
# Add streamable HTTP server:
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: ctx7sk-your-key"

# Add streamable HTTP server with OAuth authorization:
kimi mcp add --transport http --auth oauth linear https://mcp.linear.app/mcp

# Add stdio server:
kimi mcp add --transport stdio chrome-devtools -- npx chrome-devtools-mcp@latest

# List added MCP servers:
kimi mcp list

# Remove an MCP server:
kimi mcp remove chrome-devtools

# Authorize an MCP server:
kimi mcp auth linear
```

#### Ad-hoc MCP configuration

Kimi Code CLI also supports ad-hoc MCP server configuration via CLI option.

Given an MCP config file in the well-known MCP config format like the following:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Run `kimi` with `--mcp-config-file` option to connect to the specified MCP servers:

```bash
kimi --mcp-config-file /path/to/mcp.json
```

### More

See more features in the Documentation.

## Development

To develop Kimi Code CLI, run:

```bash
git clone https://github.com/MoonshotAI/kimi-cli.git
cd kimi-cli

make prepare  # prepare the development environment
```

Then you can start working on Kimi Code CLI.

Refer to the following commands after you make changes:

```bash
uv run kimi          # run Kimi Code CLI

make format          # format code
make check           # run linting and type checking
make test            # run tests
make test-kimi-cli   # run Kimi Code CLI tests only
make test-kosong     # run kosong tests only
make test-pykaos     # run pykaos tests only
make build-web       # build the web UI and sync it into the package (requires Node.js/npm)
make build           # build python packages
make build-bin       # build standalone binary
make help            # show all make targets
```

> **Note:** `make build` and `make build-bin` automatically run `make build-web` to embed the web UI.
