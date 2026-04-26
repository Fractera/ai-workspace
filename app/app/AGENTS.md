# AGENTS.md — Platform Agent Configs

> All platforms point here. Read `AGENT.md` in this same folder before anything else.

## Claude Code
Auth: `claude auth` · Bridge: `:3200` · Resume: `--resume <id>`

## Codex
Auth: `codex login` · Bridge: `:3202` · Mode: `exec --json --sandbox workspace-write`

## Gemini CLI
Auth: `gemini auth` · Bridge: `:3203` · Flags: `--output-format stream-json --yolo`

## Qwen Code
Auth: `qwen auth` · Bridge: `:3204` · Flags: `--output-format stream-json --yolo`

## Kimi Code
Auth: `kimi login` · Bridge: `:3205` · Flags: `--print --output-format stream-json`

## Open Code
Setup: `OPENROUTER_API_KEY` in `.env.local` or via workspace UI · Bridge: `:3206`
Free models: DeepSeek R1, Llama 3.3, Mistral and 300+ via openrouter.ai

## bridges/platforms/ — DO NOT TOUCH
The bridge server running all platforms above lives in `bridges/platforms/`.
Agents must not read or modify it. If Bridge indicator is red → `node bridges/platforms/server.js`
