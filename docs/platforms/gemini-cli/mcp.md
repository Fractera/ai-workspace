# MCP servers with Gemini CLI

This document provides a guide to configuring and using Model Context Protocol
(MCP) servers with Gemini CLI.

---

## What is an MCP server?

An MCP server is an application that exposes tools and resources to the Gemini
CLI through the Model Context Protocol, allowing it to interact with external
systems and data sources. MCP servers act as a bridge between the Gemini model
and your local environment or other services like APIs.

An MCP server enables Gemini CLI to:

- **Discover tools:** List available tools, their descriptions, and parameters through standardized schema definitions.
- **Execute tools:** Call specific tools with defined arguments and receive structured responses.
- **Access resources:** Read data from specific resources that the server exposes (files, API payloads, reports, etc.).

---

## Core integration architecture

Gemini CLI integrates with MCP servers through a sophisticated discovery and
execution system built into the core package (`packages/core/src/tools/`):

### Discovery Layer (`mcp-client.ts`)

The discovery process is orchestrated by `discoverMcpTools()`, which:

1. **Iterates through configured servers** from your `settings.json` `mcpServers` configuration
2. **Establishes connections** using appropriate transport mechanisms (Stdio, SSE, or Streamable HTTP)
3. **Fetches tool definitions** from each server using the MCP protocol
4. **Sanitizes and validates** tool schemas for compatibility with the Gemini API
5. **Registers tools** in the global tool registry with conflict resolution
6. **Fetches and registers resources** if the server exposes any

### Execution layer (`mcp-tool.ts`)

Each discovered MCP tool is wrapped in a `DiscoveredMCPTool` instance that:

- **Handles confirmation logic** based on server trust settings and user preferences
- **Manages tool execution** by calling the MCP server with proper parameters
- **Processes responses** for both the LLM context and user display
- **Maintains connection state** and handles timeouts

### Transport mechanisms

Gemini CLI supports three MCP transport types:

- **Stdio Transport:** Spawns a subprocess and communicates via stdin/stdout
- **SSE Transport:** Connects to Server-Sent Events endpoints
- **Streamable HTTP Transport:** Uses HTTP streaming for communication

---

## Working with MCP resources

Some MCP servers expose contextual "resources" in addition to tools and prompts.
Gemini CLI discovers these automatically and gives you the possibility to
reference them in the chat.

### Discovery and listing

- When discovery runs, the CLI fetches each server's `resources/list` results.
- The `/mcp` command displays a Resources section alongside Tools and Prompts for every connected server.

### Referencing resources in a conversation

Use the `@` syntax to reference resources, the same as for local files:

```
@server://resource/path
```

Resource URIs appear in the completion menu together with filesystem paths. When
you submit the message, the CLI calls `resources/read` and injects the content
in the conversation.

---

## How to set up your MCP server

Gemini CLI uses the `mcpServers` configuration in your `settings.json` file to
locate and connect to MCP servers.

### Configure the MCP server in settings.json

#### Global MCP settings (`mcp`)

The `mcp` object in your `settings.json` lets you define global rules for all
MCP servers.

- **`mcp.serverCommand`** (string): A global command to start an MCP server.
- **`mcp.allowed`** (array of strings): A list of MCP server names to allow. Only servers from this list will be connected to.
- **`mcp.excluded`** (array of strings): A list of MCP server names to exclude.

**Example:**

```json
{
  "mcp": {
    "allowed": ["my-trusted-server"],
    "excluded": ["experimental-server"]
  }
}
```

#### Server-specific configuration (`mcpServers`)

### Configuration structure

```json
{
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "value1"],
      "env": {
        "API_KEY": "$MY_API_TOKEN"
      },
      "cwd": "./server-directory",
      "timeout": 30000,
      "trust": false
    }
  }
}
```

### Configuration properties

#### Required (one of the following)

- **`command`** (string): Path to the executable for Stdio transport
- **`url`** (string): SSE endpoint URL (for example, `"http://localhost:8080/sse"`)
- **`httpUrl`** (string): HTTP streaming endpoint URL

#### Optional

- **`args`** (string[]): Command-line arguments for Stdio transport
- **`headers`** (object): Custom HTTP headers when using `url` or `httpUrl`
- **`env`** (object): Environment variables for the server process. Values can reference environment variables using `$VAR_NAME` or `${VAR_NAME}` syntax (all platforms), or `%VAR_NAME%` (Windows only).
- **`cwd`** (string): Working directory for Stdio transport
- **`timeout`** (number): Request timeout in milliseconds (default: 600,000ms = 10 minutes)
- **`trust`** (boolean): When `true`, bypasses all tool call confirmations for this server (default: `false`)
- **`includeTools`** (string[]): List of tool names to include from this MCP server (allowlist behavior). If not specified, all tools are enabled by default.
- **`excludeTools`** (string[]): List of tool names to exclude. Takes precedence over `includeTools`.
- **`targetAudience`** (string): The OAuth Client ID allowlisted on the IAP-protected application. Used with `authProviderType: 'service_account_impersonation'`.
- **`targetServiceAccount`** (string): The email address of the Google Cloud Service Account to impersonate. Used with `authProviderType: 'service_account_impersonation'`.

### Environment variable expansion

Gemini CLI automatically expands environment variables in the `env` block:

- **POSIX/Bash syntax:** `$VARIABLE_NAME` or `${VARIABLE_NAME}` (all platforms)
- **Windows syntax:** `%VARIABLE_NAME%` (Windows only)

If a variable is not defined, it resolves to an empty string.

**Example:**

```json
"env": {
  "API_KEY": "$MY_EXTERNAL_TOKEN",
  "LOG_LEVEL": "$LOG_LEVEL",
  "TEMP_DIR": "%TEMP%"
}
```

### Security and environment sanitization

#### Automatic redaction

By default, the CLI redacts sensitive environment variables from the base
environment to prevent unintended exposure to third-party MCP servers. This
includes:

- Core project keys: `GEMINI_API_KEY`, `GOOGLE_API_KEY`, etc.
- Variables matching sensitive patterns: `*TOKEN*`, `*SECRET*`, `*PASSWORD*`, `*KEY*`, `*AUTH*`, `*CREDENTIAL*`.
- Certificates and private key patterns.

#### Explicit overrides

If an environment variable must be passed to an MCP server, you must explicitly
state it in the `env` property. Explicitly defined variables are trusted and are
**not** subjected to automatic redaction.

> **NOTE:** Even when explicitly defined, avoid hardcoding secrets. Use
> environment variable expansion (for example, `"MY_KEY": "$MY_KEY"`) to securely
> pull the value from your host environment at runtime.

### OAuth support for remote MCP servers

Gemini CLI supports OAuth 2.0 authentication for remote MCP servers using SSE
or HTTP transports.

#### Automatic OAuth discovery

```json
{
  "mcpServers": {
    "discoveredServer": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

The CLI will automatically detect when a server requires OAuth, discover OAuth
endpoints, perform dynamic client registration if supported, and handle the
OAuth flow.

#### Authentication flow

1. **Initial connection attempt** fails with 401 Unauthorized
2. **OAuth discovery** finds authorization and token endpoints
3. **Browser opens** for user authentication
4. **Authorization code** is exchanged for access tokens
5. **Tokens are stored** securely for future use
6. **Connection retry** succeeds with valid tokens

> **IMPORTANT:** OAuth authentication requires that your local machine can open
> a web browser and receive redirects on `http://localhost:<random-port>/oauth/callback`.
> This feature will not work in headless environments, remote SSH sessions without
> X11 forwarding, or containerized environments without browser support.

#### Managing OAuth authentication

```bash
# List servers requiring authentication
/mcp auth

# Authenticate with a specific server
/mcp auth serverName
```

#### OAuth configuration properties

- **`enabled`** (boolean): Enable OAuth for this server
- **`clientId`** (string): OAuth client identifier
- **`clientSecret`** (string): OAuth client secret
- **`authorizationUrl`** (string): OAuth authorization endpoint
- **`tokenUrl`** (string): OAuth token endpoint
- **`scopes`** (string[]): Required OAuth scopes
- **`redirectUri`** (string): Custom redirect URI
- **`tokenParamName`** (string): Query parameter name for tokens in SSE URLs
- **`audiences`** (string[]): Audiences the token is valid for

#### Token management

OAuth tokens are automatically stored in `~/.gemini/mcp-oauth-tokens.json`,
refreshed when expired, validated before each connection attempt, and cleaned
up when invalid or expired.

#### Authentication provider type

Use `authProviderType` to specify the authentication provider:

- **`dynamic_discovery`** (default): Automatically discover OAuth configuration.
- **`google_credentials`**: Use Google Application Default Credentials (ADC).
- **`service_account_impersonation`**: Impersonate a Google Cloud Service Account.

**Google credentials example:**

```json
{
  "mcpServers": {
    "googleCloudServer": {
      "httpUrl": "https://my-gcp-service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
      }
    }
  }
}
```

**Service account impersonation example:**

```json
{
  "mcpServers": {
    "myIapProtectedServer": {
      "url": "https://my-iap-service.run.app/sse",
      "authProviderType": "service_account_impersonation",
      "targetAudience": "YOUR_IAP_CLIENT_ID.apps.googleusercontent.com",
      "targetServiceAccount": "your-sa@your-project.iam.gserviceaccount.com"
    }
  }
}
```

### Example configurations

**Python MCP server (stdio):**

```json
{
  "mcpServers": {
    "pythonTools": {
      "command": "python",
      "args": ["-m", "my_mcp_server", "--port", "8080"],
      "cwd": "./mcp-servers/python",
      "env": {
        "DATABASE_URL": "$DB_CONNECTION_STRING",
        "API_KEY": "${EXTERNAL_API_KEY}"
      },
      "timeout": 15000
    }
  }
}
```

**Node.js MCP server (stdio):**

```json
{
  "mcpServers": {
    "nodeServer": {
      "command": "node",
      "args": ["dist/server.js", "--verbose"],
      "cwd": "./mcp-servers/node",
      "trust": true
    }
  }
}
```

**Docker-based MCP server:**

```json
{
  "mcpServers": {
    "dockerizedServer": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "API_KEY", "-v", "${PWD}:/workspace", "my-mcp-server:latest"],
      "env": {
        "API_KEY": "$EXTERNAL_SERVICE_TOKEN"
      }
    }
  }
}
```

**HTTP-based MCP server:**

```json
{
  "mcpServers": {
    "httpServer": {
      "httpUrl": "http://localhost:3000/mcp",
      "timeout": 5000
    }
  }
}
```

**HTTP server with custom headers:**

```json
{
  "mcpServers": {
    "httpServerWithAuth": {
      "httpUrl": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer your-api-token",
        "X-Custom-Header": "custom-value"
      },
      "timeout": 5000
    }
  }
}
```

**MCP server with tool filtering:**

```json
{
  "mcpServers": {
    "filteredServer": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "includeTools": ["safe_tool", "file_reader", "data_processor"],
      "timeout": 30000
    }
  }
}
```

---

## Discovery process deep dive

### 1. Server iteration and connection

For each configured server:

1. Status tracking begins: Server status is set to `CONNECTING`
2. Transport selection based on configuration properties: `httpUrl` → `StreamableHTTPClientTransport`, `url` → `SSEClientTransport`, `command` → `StdioClientTransport`
3. Connection establishment with configured timeout
4. Connection failures are logged and server status set to `DISCONNECTED`

### 2. Tool discovery

1. Tool listing via the MCP server's tool listing endpoint
2. Schema validation
3. Tool filtering based on `includeTools` and `excludeTools`
4. Name sanitization: characters other than letters, numbers, `_`, `-`, `.`, `:` are replaced with underscores; names longer than 63 characters are truncated

### 3. Tool naming and namespaces

- **Automatic FQN:** All MCP tools get a fully qualified name: `mcp_{serverName}_{toolName}`
- **Registry tracking:** Metadata mappings between FQNs and server identities
- **Overwrites:** If two servers share the same alias and tool name, the last registered tool wins

> **WARNING:** Do not use underscores (`_`) in your MCP server names (use `my-server` rather than `my_server`). The policy parser splits FQNs on the first underscore after `mcp_`. Underscores in server names can cause wildcard rules and security policies to fail silently.

### 4. Schema processing

Tool parameter schemas undergo sanitization:

- `$schema` properties are removed
- `additionalProperties` are stripped
- `anyOf` with `default` have their default values removed (Vertex AI compatibility)
- Recursive processing applies to nested schemas

### 5. Connection management

- Servers providing tools maintain persistent connections
- Servers providing no tools have connections closed automatically
- Final server statuses are set to `CONNECTED` or `DISCONNECTED`

---

## Tool execution flow

### 1. Tool invocation

The model generates a `FunctionCall` with a tool name and JSON arguments.

### 2. Confirmation process

- **Trust-based bypass:** If `trust: true`, no confirmation is needed.
- **Dynamic allow-listing:** Server-level or tool-level allow-lists skip confirmation.
- **User choice:** Allow once, always allow this tool, always allow this server, or cancel.

### 3. Execution

1. Arguments are validated against the tool's schema
2. The underlying `CallableTool` invokes the server
3. Results are formatted for both LLM context and user display

### 4. Response handling

- **`llmContent`:** Raw response parts for the language model's context
- **`returnDisplay`:** Formatted output for user display

---

## How to interact with your MCP server

### Using the `/mcp` command

```bash
/mcp
```

Displays server list, connection status, configuration summary, available tools, and discovery state.

---

## Status monitoring and troubleshooting

### Overriding extension configurations

You can override extension-provided MCP server settings in your local `settings.json`:

- **Exclusions (`excludeTools`):** Arrays are unioned — if either source blocks a tool, it stays disabled.
- **Inclusions (`includeTools`):** Arrays are intersected — only tools in **both** lists are enabled.
- **`excludeTools` takes precedence** over `includeTools` always.
- **Environment variables:** `env` objects are merged; your local values take precedence.
- **Scalar properties:** Replaced by your local values if provided.

**Example override:**

```json
{
  "mcpServers": {
    "google-workspace": {
      "excludeTools": ["gmail.send"]
    }
  }
}
```

### Server status

- **`DISCONNECTED`:** Server is not connected or has errors
- **`CONNECTING`:** Connection attempt in progress
- **`CONNECTED`:** Server is connected and ready

### Discovery state

- **`NOT_STARTED`:** Discovery hasn't begun
- **`IN_PROGRESS`:** Currently discovering servers
- **`COMPLETED`:** Discovery finished

### Common issues

**Server won't connect:**
1. Check `command`, `args`, and `cwd` configuration
2. Run the server command directly in terminal
3. Verify all required packages are installed
4. Check permissions for the CLI to execute the command

**No tools discovered:**
1. Verify the server registers tools on startup
2. Confirm MCP tool listing protocol is implemented correctly
3. Check server stderr for errors

**Tools not executing:**
1. Validate parameter types match the schema
2. Increase `timeout` if operations are slow
3. Check for unhandled exceptions in the server

**Sandbox compatibility:**
1. Use Docker containers that include all dependencies
2. Ensure executables are accessible in the sandbox
3. Configure network access in the sandbox as needed

### Debugging tips

1. Run CLI with `--debug` for verbose output (or press F12 for the debug console in interactive mode)
2. MCP server stderr is captured and logged
3. Test the MCP server independently before integrating
4. Start with simple tools before adding complex functionality
5. Use `/mcp` frequently to monitor server status

---

## Important notes

### Security considerations

- **Trust settings:** `trust: true` bypasses all confirmation dialogs — use only for servers you completely control.
- **Access tokens:** Be security-aware when configuring environment variables containing API keys or tokens.
- **Sandbox compatibility:** Ensure MCP servers are available within the sandbox environment.
- **Private data:** Broadly scoped personal access tokens can lead to information leakage between repositories.

### Performance and resource management

- Persistent connections are maintained for servers that successfully register tools
- Connections to servers providing no tools are automatically closed
- MCP servers run as separate processes and consume system resources

---

## Returning rich content from tools

MCP tools can return rich, multi-part content including text, images, audio, and
other binary data in a single tool response.

### Supported content block types

- `text`
- `image`
- `audio`
- `resource` (embedded content)
- `resource_link`

### Example: Returning text and an image

```json
{
  "content": [
    {
      "type": "text",
      "text": "Here is the logo you requested."
    },
    {
      "type": "image",
      "data": "BASE64_ENCODED_IMAGE_DATA_HERE",
      "mimeType": "image/png"
    },
    {
      "type": "text",
      "text": "The logo was created in 2025."
    }
  ]
}
```

When received, the CLI extracts text into a `functionResponse` part, presents image data as a separate `inlineData` part, and shows a user-friendly summary in the CLI.

---

## MCP prompts as slash commands

MCP servers can expose predefined prompts that can be executed as slash commands.

### Defining prompts on the server

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'prompt-server',
  version: '1.0.0',
});

server.registerPrompt(
  'poem-writer',
  {
    title: 'Poem Writer',
    description: 'Write a nice haiku',
    argsSchema: { title: z.string(), mood: z.string().optional() },
  },
  ({ title, mood }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Write a haiku${mood ? ` with the mood ${mood}` : ''} called ${title}.`,
        },
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Invoking prompts

```bash
/poem-writer --title="Gemini CLI" --mood="reverent"
```

or with positional arguments:

```bash
/poem-writer "Gemini CLI" reverent
```

---

## Managing MCP servers with `gemini mcp`

### Adding a server (`gemini mcp add`)

```bash
gemini mcp add [options] <name> <commandOrUrl> [args...]
```

**Options:**

- `-s, --scope`: Configuration scope (`user` or `project`). Default: `"project"`
- `-t, --transport`: Transport type (`stdio`, `sse`, `http`). Default: `"stdio"`
- `-e, --env`: Set environment variables (for example, `-e KEY=value`)
- `-H, --header`: Set HTTP headers (for example, `-H "Authorization: Bearer abc123"`)
- `--timeout`: Connection timeout in milliseconds
- `--trust`: Trust the server (bypass confirmation prompts)
- `--description`: Set server description
- `--include-tools`: Comma-separated list of tools to include
- `--exclude-tools`: Comma-separated list of tools to exclude

**Examples:**

```bash
# stdio server
gemini mcp add -e API_KEY=123 my-stdio-server /path/to/server arg1 arg2

# HTTP server
gemini mcp add --transport http http-server https://api.example.com/mcp/

# SSE server with auth header
gemini mcp add --transport sse --header "Authorization: Bearer abc123" secure-sse https://api.example.com/sse/
```

### Listing servers (`gemini mcp list`)

```bash
gemini mcp list
```

> **NOTE:** `stdio` MCP servers are only shown as "Connected" if the current folder is trusted. Use `gemini trust` to trust the current folder.

### Removing a server (`gemini mcp remove`)

```bash
gemini mcp remove <name> [-s, --scope]
```

### Enabling/disabling a server

```bash
gemini mcp enable <name> [--session]
gemini mcp disable <name> [--session]
```

`--session`: Apply change only for the current session (not persisted).

Disabled servers appear in `/mcp` status as "Disabled". State is stored in `~/.gemini/mcp-server-enablement.json`.

The same commands are available as slash commands: `/mcp enable <name>` and `/mcp disable <name>`.

---

## Troubleshooting and Diagnostics

MCP connection errors are "silent by default" during startup to minimize noise.
If issues are detected, a hint will appear: _"MCP issues detected. Run /mcp list for status."_

Detailed diagnostics are automatically enabled when:
1. You run an interactive command like `/mcp list`
2. The model attempts to execute a tool from that server
3. You invoke an MCP prompt from that server

---

## Instructions

Gemini CLI supports MCP server instructions, which will be appended to the system instructions.
