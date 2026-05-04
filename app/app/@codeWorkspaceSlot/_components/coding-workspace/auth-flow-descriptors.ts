export type AuthFlowDescriptor = {
  platformId: 'claude-code' | 'codex' | 'codex-device' | 'gemini-cli' | 'qwen-code' | 'kimi-code' | 'open-code'
  platformLabel: string
  // terminal-paste: user pastes code from browser → sent to PTY stdin
  // url-relay:      user pastes localhost callback URL → server relays to localhost:1455
  // device-code:    user opens static URL and enters one-time code on the site; Codex polls automatically
  flow: 'terminal-paste' | 'url-relay' | 'device-code'
  detectUrl: RegExp
  detectCode?: RegExp  // device-code only: extracts the one-time code from PTY buffer
  detectSuccess?: RegExp
  modalTitle: string
  modalDescription: string
}

export const AUTH_FLOW_DESCRIPTORS: AuthFlowDescriptor[] = [
  {
    platformId: 'claude-code',
    platformLabel: 'Claude Code',
    flow: 'terminal-paste',
    detectUrl: /https:\/\/claude\.com\/cai\/oauth\/authoriz\S+/,
    modalTitle: 'Claude Code — Authorization',
    modalDescription: 'Open the link in your browser and sign in to your Claude account',
  },
  {
    platformId: 'codex',
    platformLabel: 'Codex',
    flow: 'url-relay',
    detectUrl: /https:\/\/auth\.openai\.com\/oauth\/authorize\S+/,
    modalTitle: 'Codex — Browser Authorization',
    modalDescription: 'Open the link and sign in. The browser will fail with a localhost error — copy the full URL from the address bar and paste it below',
  },
  {
    platformId: 'codex-device',
    platformLabel: 'Codex',
    flow: 'device-code',
    detectUrl: /https:\/\/auth\.openai\.com\/codex\/device/,
    detectCode: /[A-Z][A-Z0-9]{1,7}-[A-Z0-9]{2,8}/,
    modalTitle: 'Codex — Device Authorization',
    modalDescription: 'Copy the code below → Open the link → Paste the code on the OpenAI page → Click Continue',
  },
  {
    platformId: 'gemini-cli',
    platformLabel: 'Gemini CLI',
    flow: 'terminal-paste',
    detectUrl: /https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth\S+/,
    modalTitle: 'Gemini CLI — Authorization',
    modalDescription: 'Open the link in your browser and sign in to your Google account',
  },
  {
    platformId: 'qwen-code',
    platformLabel: 'Qwen Code',
    flow: 'terminal-paste',
    detectUrl: /https:\/\/modelstudio\.console\.alibabacloud\.com\S*/,
    modalTitle: 'Qwen Code — API Key',
    modalDescription: 'Visit the site, register, and click the API Key button to generate your key (format: sk-...). Paste it in the field below and press Send.',
  },
]
