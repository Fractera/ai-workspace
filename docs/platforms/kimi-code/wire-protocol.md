# Kimi Code — Wire Protocol

Wire mode is Kimi Code CLI's low-level communication protocol for structured bidirectional communication with external programs.

## What is Wire

Wire is the message-passing layer used internally by Kimi Code CLI. When you interact via terminal, the Shell UI receives AI output through Wire and displays it; when you integrate with IDEs via ACP, the ACP server also communicates with the agent core through Wire.

Wire mode (`--wire`) exposes this communication protocol, allowing external programs to interact directly with Kimi Code CLI. This is suitable for building custom UIs or embedding Kimi Code CLI into other applications.

```bash
kimi --wire
```

## Use Cases

Wire mode is mainly used for:

- **Custom UI:** Build web, desktop, or mobile frontends for Kimi Code CLI
- **Application integration:** Embed Kimi Code CLI into other applications
- **Automated testing:** Programmatic testing of agent behavior

If you only need simple non-interactive input/output, Print mode is simpler. Wire mode is for scenarios requiring full control and bidirectional communication.

## Wire Protocol

Wire uses a JSON-RPC 2.0 based protocol for bidirectional communication via stdin/stdout. The current protocol version is 1.7. Each message is a single line of JSON conforming to the JSON-RPC 2.0 specification.

### Protocol Type Definitions

```typescript
/** JSON-RPC 2.0 request message base structure */
interface JSONRPCRequest<Method extends string, Params> {
  jsonrpc: "2.0"
  method: Method
  id: string
  params: Params
}

/** JSON-RPC 2.0 notification message (no id, no response needed) */
interface JSONRPCNotification<Method extends string, Params> {
  jsonrpc: "2.0"
  method: Method
  params: Params
}

/** JSON-RPC 2.0 success response */
interface JSONRPCSuccessResponse<Result> {
  jsonrpc: "2.0"
  id: string
  result: Result
}

/** JSON-RPC 2.0 error response */
interface JSONRPCErrorResponse {
  jsonrpc: "2.0"
  id: string
  error: JSONRPCError
}

interface JSONRPCError {
  code: number
  message: string
  data?: unknown
}
```

### initialize

**Direction:** Client → Agent  
**Type:** Request (requires response)

Optional handshake request for negotiating protocol version, submitting external tool definitions, and retrieving the slash command list.

```typescript
interface InitializeParams {
  protocol_version: string
  client?: ClientInfo
  external_tools?: ExternalTool[]
  capabilities?: ClientCapabilities
  hooks?: WireHookSubscription[]
}

interface ClientCapabilities {
  supports_question?: boolean
  supports_plan_mode?: boolean
}

interface WireHookSubscription {
  id: string
  event: string
  matcher?: string
  timeout?: number
}

interface ClientInfo {
  name: string
  version?: string
}

interface ExternalTool {
  name: string
  description: string
  parameters: JSONSchema
}

interface InitializeResult {
  protocol_version: string
  server: ServerInfo
  slash_commands: SlashCommandInfo[]
  external_tools?: ExternalToolsResult
  capabilities?: ServerCapabilities
  hooks?: HooksInfo
}

interface HooksInfo {
  supported_events: string[]
  configured: Record<string, number>
}

interface ServerCapabilities {
  supports_question?: boolean
}

interface ServerInfo {
  name: string
  version: string
}

interface SlashCommandInfo {
  name: string
  description: string
  aliases: string[]
}

interface ExternalToolsResult {
  accepted: string[]
  rejected: Array<{ name: string; reason: string }>
}
```

Request example:

```json
{"jsonrpc": "2.0", "method": "initialize", "id": "550e8400-e29b-41d4-a716-446655440000", "params": {"protocol_version": "1.7", "client": {"name": "my-ui", "version": "1.0.0"}, "capabilities": {"supports_question": true}, "external_tools": [{"name": "open_in_ide", "description": "Open file in IDE", "parameters": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}}]}}
```

Success response example:

```json
{"jsonrpc": "2.0", "id": "550e8400-e29b-41d4-a716-446655440000", "result": {"protocol_version": "1.7", "server": {"name": "Kimi Code CLI", "version": "1.14.0"}, "slash_commands": [{"name": "init", "description": "Analyze the codebase ...", "aliases": []}], "capabilities": {"supports_question": true}, "external_tools": {"accepted": ["open_in_ide"], "rejected": []}}}
```

If the server does not support the initialize method, the client will receive a `-32601` method not found error and should automatically fall back to no-handshake mode.

### prompt

**Direction:** Client → Agent  
**Type:** Request (requires response)

Send user input and run an agent turn.

```typescript
interface PromptParams {
  user_input: string | ContentPart[]
}

interface PromptResult {
  status: "finished" | "cancelled" | "max_steps_reached"
  steps?: number
}
```

Request example:

```json
{"jsonrpc": "2.0", "method": "prompt", "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "params": {"user_input": "Hello"}}
```

Success response example:

```json
{"jsonrpc": "2.0", "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "result": {"status": "finished"}}
```

Error codes:

| code | Description |
|---|---|
| -32000 | A turn is already in progress |
| -32001 | LLM not configured |
| -32002 | Specified LLM not supported |
| -32003 | LLM service error |

### replay

**Direction:** Client → Agent  
**Type:** Request (requires response)

Trigger a history replay. The server reads `wire.jsonl` from the session directory and re-sends recorded events in order. Replay is read-only; clients should not respond to replayed request messages.

```typescript
type ReplayParams = Record<string, never>

interface ReplayResult {
  status: "finished" | "cancelled"
  events: number
  requests: number
}
```

### steer

**Direction:** Client → Agent  
**Type:** Request (requires response)

Inject a user message into an active agent turn without starting a new turn. The message is appended to context after the current step finishes.

```typescript
interface SteerParams {
  user_input: string | ContentPart[]
}

interface SteerResult {
  status: "steered"
}
```

Error: If no turn is in progress, returns code `-32000`.

### set_plan_mode

**Direction:** Client → Agent  
**Type:** Request (requires response)

Set plan mode to a specific state. Requires `capabilities.supports_plan_mode: true` during `initialize`.

```typescript
interface SetPlanModeParams {
  enabled: boolean
}

interface SetPlanModeResult {
  status: "ok"
  plan_mode: boolean
}
```

### cancel

**Direction:** Client → Agent  
**Type:** Request (requires response)

Cancel the currently running agent turn or replay.

```typescript
type CancelParams = Record<string, never>
type CancelResult = Record<string, never>
```

### event

**Direction:** Agent → Client  
**Type:** Notification (no response needed)

Events emitted by the agent during a turn.

```typescript
interface EventParams {
  type: string
  payload: object
}
```

Example:

```json
{"jsonrpc": "2.0", "method": "event", "params": {"type": "ContentPart", "payload": {"type": "text", "text": "Hello"}}}
```

### request

**Direction:** Agent → Client  
**Type:** Request (requires response)

Requests from the agent to the client, used for approval confirmation or external tool calls. The client must respond before the agent can continue.

```typescript
interface RequestParams {
  type: "ApprovalRequest" | "ToolCallRequest" | "QuestionRequest"
  payload: ApprovalRequest | ToolCallRequest | QuestionRequest
}
```

## Standard Error Codes

| code | Description |
|---|---|
| -32700 | Invalid JSON format |
| -32600 | Invalid request (e.g., missing required fields) |
| -32601 | Method not found |
| -32602 | Invalid method parameters |
| -32603 | Internal error |

## Wire Message Types

### Event types

```typescript
type Event =
  | TurnBegin
  | TurnEnd
  | StepBegin
  | StepInterrupted
  | CompactionBegin
  | CompactionEnd
  | StatusUpdate
  | ContentPart
  | ToolCall
  | ToolCallPart
  | ToolResult
  | ApprovalResponse
  | SubagentEvent
  | SteerInput
  | PlanDisplay
  | HookTriggered
  | HookResolved
```

### Request types

```typescript
type Request = ApprovalRequest | ToolCallRequest | QuestionRequest | HookRequest
```

### TurnBegin

```typescript
interface TurnBegin {
  user_input: string | ContentPart[]
}
```

### TurnEnd

Turn ended. Sent after all other events in the turn. May be omitted if interrupted.

### StepBegin

```typescript
interface StepBegin {
  n: number  // Step number, starting from 1
}
```

### StepInterrupted / CompactionBegin / CompactionEnd

No additional fields.

### StatusUpdate

```typescript
interface StatusUpdate {
  context_usage?: number | null
  context_tokens?: number | null
  max_context_tokens?: number | null
  token_usage?: TokenUsage | null
  message_id?: string | null
  plan_mode?: boolean | null
}

interface TokenUsage {
  input_other: number
  output: number
  input_cache_read: number
  input_cache_creation: number
}
```

### ContentPart

```typescript
type ContentPart =
  | TextPart
  | ThinkPart
  | ImageURLPart
  | AudioURLPart
  | VideoURLPart

interface TextPart { type: "text"; text: string }
interface ThinkPart { type: "think"; think: string; encrypted?: string | null }
interface ImageURLPart { type: "image_url"; image_url: { url: string; id?: string | null } }
interface AudioURLPart { type: "audio_url"; audio_url: { url: string; id?: string | null } }
interface VideoURLPart { type: "video_url"; video_url: { url: string; id?: string | null } }
```

### ToolCall

```typescript
interface ToolCall {
  type: "function"
  id: string
  function: { name: string; arguments?: string | null }
  extras?: object | null
}
```

### ToolCallPart

```typescript
interface ToolCallPart {
  arguments_part?: string | null
}
```

### ToolResult

```typescript
interface ToolResult {
  tool_call_id: string
  return_value: ToolReturnValue
}

interface ToolReturnValue {
  is_error: boolean
  output: string | ContentPart[]
  message: string
  display: DisplayBlock[]
  extras?: object | null
}
```

### ApprovalResponse

```typescript
interface ApprovalResponse {
  request_id: string
  response: "approve" | "approve_for_session" | "reject"
  feedback?: string
}
```

### SubagentEvent

```typescript
interface SubagentEvent {
  parent_tool_call_id?: string | null
  agent_id?: string | null
  subagent_type?: string | null
  event: { type: string; payload: object }
}
```

### SteerInput

```typescript
interface SteerInput {
  user_input: string | ContentPart[]
}
```

### PlanDisplay

```typescript
interface PlanDisplay {
  content: string      // Full markdown content of the plan
  file_path: string    // Path to the plan file
}
```

### HookTriggered / HookResolved

```typescript
interface HookTriggered {
  event: string
  target: string
  hook_count: number
}

interface HookResolved {
  event: string
  target: string
  action: "allow" | "block"
  reason: string
  duration_ms: number
}
```

### ApprovalRequest

```typescript
interface ApprovalRequest {
  id: string
  tool_call_id: string
  sender: string
  action: string
  description: string
  display?: DisplayBlock[]
  source_kind?: "foreground_turn" | "background_agent" | null
  source_id?: string | null
  agent_id?: string | null
  subagent_type?: string | null
  source_description?: string | null
}
```

Response:

```typescript
interface ApprovalResponse {
  request_id: string
  response: "approve" | "approve_for_session" | "reject"
  feedback?: string
}
```

| response | Description |
|---|---|
| `approve` | Approve this operation |
| `approve_for_session` | Approve similar operations for this session |
| `reject` | Reject; optionally include feedback |

### ToolCallRequest

```typescript
interface ToolCallRequest {
  id: string
  name: string
  arguments?: string | null
}
```

Response: `ToolResult` (see above).

### QuestionRequest

Requires `capabilities.supports_question: true` during `initialize`.

```typescript
interface QuestionRequest {
  id: string
  tool_call_id: string
  questions: QuestionItem[]
}

interface QuestionItem {
  question: string
  header?: string
  options: QuestionOption[]
  multi_select?: boolean
}

interface QuestionOption {
  label: string
  description?: string
}
```

Response:

```typescript
interface QuestionResponse {
  request_id: string
  answers: Record<string, string>  // key: question text, value: selected label(s)
}
```

### HookRequest

Requires hook subscriptions declared during `initialize`.

```typescript
interface HookRequest {
  id: string
  subscription_id: string
  event: string
  target: string
  input_data: object
}
```

Response:

```typescript
interface HookResponse {
  request_id: string
  action: "allow" | "block"
  reason: string
}
```

## DisplayBlock

```typescript
type DisplayBlock =
  | UnknownDisplayBlock
  | BriefDisplayBlock
  | DiffDisplayBlock
  | TodoDisplayBlock
  | ShellDisplayBlock

interface UnknownDisplayBlock { type: string; data: object }
interface BriefDisplayBlock { type: "brief"; text: string }
interface DiffDisplayBlock { type: "diff"; path: string; old_text: string; new_text: string }
interface TodoDisplayBlock { type: "todo"; items: TodoDisplayItem[] }
interface TodoDisplayItem { title: string; status: "pending" | "in_progress" | "done" }
interface ShellDisplayBlock { type: "shell"; language: string; command: string }
```

## Kimi Agent (Rust) Wire Server

> **Note:** Kimi Agent is currently experimental. APIs and behavior may change in subsequent versions.

Kimi Agent (Rust) is a Rust implementation of the Kimi Code CLI core, designed specifically for Wire mode. The Rust implementation is at MoonshotAI/kimi-agent-rs.

### Features

- **Fully Wire protocol compatible:** Uses the same Wire protocol as `kimi --wire`, existing clients need no modifications
- **Smaller footprint:** Single statically-linked binary, no Python runtime needed
- **Faster startup:** Native compilation, faster launch speed
- **Same configuration:** Uses the same config file (`~/.kimi/config.toml`) and session directory

### Limitations

- Wire mode only: No Shell/Print/ACP UI
- Kimi provider only: Does not support OpenAI, Anthropic, or other providers
- No Kimi account login: No login/logout subcommands and `/login`, `/logout` slash commands; API key must be configured manually
- No `--prompt`/`--command` support
- Local execution only: No SSH Kaos support
- Different MCP OAuth storage location: Kimi Agent stores in `~/.kimi/credentials/mcp_auth.json`, Python version stores in `~/.fastmcp/oauth-mcp-client-cache/`

### Installation

```bash
# macOS (Apple Silicon)
curl -L https://github.com/MoonshotAI/kimi-agent-rs/releases/latest/download/kimi-agent-aarch64-apple-darwin.tar.gz | tar xz
sudo mv kimi-agent /usr/local/bin/

# Linux (x86_64)
curl -L https://github.com/MoonshotAI/kimi-agent-rs/releases/latest/download/kimi-agent-x86_64-unknown-linux-gnu.tar.gz | tar xz
sudo mv kimi-agent /usr/local/bin/
```

### Usage

```bash
# Runs Wire mode by default
kimi-agent

# Specify working directory
kimi-agent --work-dir /path/to/project

# Resume previous session
kimi-agent --continue

# Use specific session
kimi-agent --session <session-id>

# Use specific model
kimi-agent --model kimi-for-coding

# YOLO mode (skip approvals)
kimi-agent --yolo
```

Subcommands:

```bash
kimi-agent info            # Show version and environment info
kimi-agent mcp list        # Manage MCP servers
kimi-agent mcp add <name> <command> [args...]
kimi-agent mcp remove <name>
```
