export type Platform =
  | 'claude-code'
  | 'codex'
  | 'gemini-cli'
  | 'open-code'
  | 'qwen-code'
  | 'kimi-code';

export type TerminalStatus = 'unavailable' | 'connecting' | 'connected' | 'disconnected';

export const PLATFORMS: { id: Platform; label: string; active: boolean; docsUrl: string; agentPrompt: string }[] = [
  { id: 'claude-code', label: 'Claude Code', active: true,  docsUrl: 'https://code.claude.com/docs/en/quickstart', agentPrompt: '' },
  { id: 'codex',       label: 'Codex',       active: true,  docsUrl: 'https://developers.openai.com/codex/cli', agentPrompt: 'Install Codex CLI: read the documentation in ../docs/platforms/codex/ (start with AGENTS.md), then follow the install instructions exactly as written there. After successful install, verify with `codex --version` and set active: true for codex in app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts' },
  { id: 'gemini-cli',  label: 'Gemini CLI',  active: false, docsUrl: 'https://geminicli.com/docs/get-started/installation/', agentPrompt: 'Install Gemini CLI: read the documentation in ../docs/platforms/gemini-cli/ (start with AGENTS.md), then follow the install instructions exactly as written there. After successful install, verify with `gemini --version` and set active: true for gemini-cli in app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts' },
  { id: 'qwen-code',   label: 'Qwen Code',   active: false, docsUrl: 'https://qwen.ai/qwencode', agentPrompt: 'Install Qwen Code: read the documentation in ../docs/platforms/qwen-code/ (start with AGENTS.md), then follow the install instructions exactly as written there. After successful install, verify with `qwen --version` and set active: true for qwen-code in app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts' },
  { id: 'kimi-code',   label: 'Kimi Code',   active: false, docsUrl: 'https://moonshotai.github.io/kimi-cli/en/guides/getting-started.html', agentPrompt: 'Install Kimi Code: read the documentation in ../docs/platforms/kimi-code/ (start with AGENTS.md), then follow the install instructions exactly as written there. After successful install, verify with `kimi --version` and set active: true for kimi-code in app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts' },
  { id: 'open-code',   label: 'Open Code',   active: false, docsUrl: 'https://opencode.ai/docs/en', agentPrompt: 'Install OpenCode: read the documentation in ../docs/platforms/open-code/ (start with AGENTS.md), then follow the install instructions exactly as written there. After successful install, verify with `opencode --version` and set active: true for open-code in app/@codeWorkspaceSlot/_components/coding-workspace/platforms.ts' },
];

export const COMING_SOON: { id: string; label: string; version: string; tooltip: string }[] = [
  {
    id: 'lightrag',
    label: 'Company Brain',
    version: 'v1.1',
    tooltip: "Company Brain (LightRAG) — Shared memory for all agents and platforms\n\nAvailable in v1.1.x\n\nA unified knowledge graph that persists context across sessions, platforms, and agents. Claude Code, Codex, Gemini and others will share the same memory — no more repeating yourself.",
  },
  {
    id: 'open-claw',
    label: 'Open Claw',
    version: 'v1.2',
    tooltip: "Open Claw — Multi-agent orchestration\n\nAvailable in v1.2.x\n\nOrchestrates all coding agents and Company Brain (LightRAG) memory into a unified workflow. Assign tasks, parallelize agents, chain results — all from a single interface.",
  },
];
