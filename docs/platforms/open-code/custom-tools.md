# Custom Tools

Create your own tools for the LLM to use.

Custom tools let you define functions that the LLM can call during a session. They are written as TypeScript/JavaScript plugins using the `@opencode-ai/plugin` package.

## Place files

Create tool files in `.opencode/tools/` in your project, or in `~/.config/opencode/tools/` for global tools.

Each file exports a default `tool()` definition.

## Basic example

```ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Add two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return String(args.a + args.b)
  },
})
```

## Using context

The `execute` function receives a `context` object with information about the current session:

```ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get project information",
  args: {},
  async execute(args, context) {
    // Access context information
    const { agent, sessionID, messageID, directory, worktree } = context
    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}, Directory: ${directory}, Worktree: ${worktree}`
  },
})
```

Context fields:

- `agent` — name of the agent currently running
- `sessionID` — current session ID
- `messageID` — current message ID
- `directory` — the working directory OpenCode was started in
- `worktree` — the git worktree root

## Calling external scripts

You can use `context.worktree` to construct paths and shell out to any language:

```ts
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Add two numbers using Python",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

## Schema types

Use `tool.schema` to define argument types. It wraps [Zod](https://zod.dev) schemas:

- `tool.schema.string()` — string argument
- `tool.schema.number()` — number argument
- `tool.schema.boolean()` — boolean argument
- `tool.schema.array(...)` — array of items
- `tool.schema.object({...})` — object with named fields

Chain `.describe("...")` on any schema to add a description the LLM uses when deciding how to call the tool.

## Permissions

Custom tools follow the same permission system as built-in tools. You can control access in `opencode.json` using the tool's file name (without extension) as the key:

```json
// opencode.json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "my-tool": "ask"
  }
}
```

Or per agent:

```json
// opencode.json
{
  "agent": {
    "plan": {
      "permission": {
        "my-tool": "deny"
      }
    }
  }
}
```
