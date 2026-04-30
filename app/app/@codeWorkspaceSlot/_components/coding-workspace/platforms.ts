export type Platform =
  | 'claude-code'
  | 'codex'
  | 'gemini-cli'
  | 'open-code'
  | 'qwen-code'
  | 'kimi-code';

export type TerminalStatus = 'unavailable' | 'connecting' | 'connected' | 'disconnected';

export const PLATFORMS: { id: Platform; label: string; active: boolean; agentPrompt: string }[] = [
  { id: 'claude-code', label: 'Claude Code', active: true,  agentPrompt: '' },
  { id: 'codex',       label: 'Codex',       active: false, agentPrompt: '' },
  { id: 'gemini-cli',  label: 'Gemini CLI',  active: false, agentPrompt: '' },
  { id: 'qwen-code',   label: 'Qwen Code',   active: false, agentPrompt: '' },
  { id: 'kimi-code',   label: 'Kimi Code',   active: false, agentPrompt: '' },
  { id: 'open-code',   label: 'Open Code',   active: false, agentPrompt: '' },
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
