# Kimi Code Overview

## What is Kimi Code

Kimi Code is an intelligent programming service for developers included in Kimi membership benefits. Built on Kimi's latest flagship models, it provides AI-assisted capabilities—such as code reading, file editing, and command execution—through product forms like CLI and VS Code extension. Subscribers can also obtain an API Key to integrate Kimi Code's model capabilities into third-party development tools and platforms.

## Core Advantages

- **Continuous model upgrades:** Stay current with Kimi's latest flagship models and continuously gain cutting-edge code understanding, reasoning, and generation capabilities
- **Broad compatibility:** Seamlessly works with Kimi Code CLI, VS Code, Claude Code, and various other development tools
- **Ultra-fast response:** Output speed up to 100 Tokens/s
- **High-frequency concurrency:** Supports approximately 300–1,200 requests per 5-hour window, with up to 30 concurrent requests

## Getting Started

Kimi Code allows members to use their benefits in both the official client and third-party platforms, covering different development scenarios.

### Using the Official Client

Choose the client that fits you and install with one click:

#### CLI

For developers who prefer terminal operations. Chat with AI in the terminal, letting it read code, edit files, execute commands, search the web, and autonomously complete development tasks.

```bash
# macOS / Linux
curl -LsSf https://code.kimi.com/install.sh | bash

# Windows (PowerShell)
Invoke-RestMethod https://code.kimi.com/install.ps1 | Invoke-Expression
```

After installation, run `kimi` in the terminal to start.

#### VS Code

For developers who prefer the VS Code editor. Collaborate with AI in the editor sidebar, supporting code completion, file editing, web search, and automated tasks.

Search for "Kimi Code" in the VS Code Extensions marketplace to install, or visit Visual Studio Marketplace.

If the extension doesn't appear after installation, restart VS Code or run "Developer: Reload Window" from the Command Palette (Mac: Cmd+Shift+P, Windows/Linux: Ctrl+Shift+P).

Other editors such as JetBrains and Zed can connect via CLI's ACP protocol. See JetBrains Configuration and Zed Configuration for details.

## API Access

After installing the official client or connecting a third-party tool, you need to complete authentication before you can use Kimi Code quota.

### OAuth Automatic Authentication (Official Clients)

Users of Kimi Code CLI or the VS Code extension can connect automatically via OAuth authorization without manually managing an API Key.

- **Kimi Code:** Use the `/login` command to automatically log in to the Kimi Code platform, which completes the connection
- **Kimi Code for VS Code Extension:** Complete the connection via the login button in the sidebar after installation

### API Key (Third-Party Tools / Self-Built Apps)

Kimi Code benefits support usage in mainstream Coding Agents — such as Claude Code, Roo Code, OpenCode, and more. It can also work with generic Agent frameworks like OpenClaw and Hermes, allowing you to freely call Kimi's AI capabilities in the tools you're already used to.

If you want to integrate Kimi Code into third-party development tools, you need to manually configure an API Key.

#### Service Endpoint

The Kimi Code API is compatible with both OpenAI and Anthropic protocols. Choose the corresponding Base URL as needed:

| Protocol | Base URL |
|---|---|
| OpenAI Compatible | `https://api.kimi.com/coding/v1` |
| Anthropic Compatible | `https://api.kimi.com/coding/` |

#### Obtaining an API Key

Kimi members can create and manage API Keys in the Kimi Code Console (up to 5 keys; each is shown only once upon creation—please keep it safe).

#### Model ID

When calling the Kimi Code API from third-party tools, always use the model ID `kimi-for-coding`. Whether you're on the OpenAI-compatible or Anthropic-compatible protocol, set the `model` field in the request body to this value.

> **Note:** `kimi-for-coding` is a stable model ID; the backend automatically updates the display name it maps to whenever a newer model is released, so you always get the latest model without changing any client configuration.

#### Configuring in Third-Party Tools

After obtaining an API Key, configure the corresponding Base URL and API Key in the environment variables of the respective tool to start using it. For configuration details, see Using in Other Coding Agents.

> **Note:** Please maintain the tool's real identity identifier when using. Tampering with the client identifier (User-Agent) is considered a violation and may result in suspension of membership benefits.

## Platform Comparison

Kimi Code membership benefits are designed specifically for programming scenarios. If you need to call large model capabilities in your own product, or require team collaboration and usage management, please visit the Kimi Platform.

| Comparison Item | Kimi Code Platform | Kimi Platform |
|---|---|---|
| Base URL | OpenAI Compatible: `https://api.kimi.com/coding/v1`<br>Anthropic Compatible: `https://api.kimi.com/coding/` | `https://api.moonshot.cn/v1` |
| Billing | Membership subscription, monthly/annual payment, with rate limiting | Pay-as-you-go, top up and use |
| Best For | Terminal/IDE Agent programming, multi-file engineering tasks | Product integration, enterprise-level calls, multimodal application development |

## Quota and Limits

Kimi Code quota refreshes automatically every 7 days from the subscription date; unused quota does not carry over. In addition to the weekly quota, there is a rolling 5-hour frequency window—even if the total quota is sufficient, too many requests in a short time will trigger rate limiting, which automatically recovers after the window rolls forward.

All logged-in devices and API Keys share the same quota: whether requests originate from CLI, VS Code, or third-party tools, they consume the same account's quota. Devices inactive for more than 30 days are automatically unbound; simply run `/login` again to restore access.

Log in to the Kimi Code Console to check remaining quota and rate limit status, manage API Keys, and view logged-in devices at any time.

Kimi Code shares quota with the Kimi membership plan. If the Kimi membership's monthly total quota reaches its limit, the Kimi Code quota will be frozen until the monthly quota resets or the subscription is upgraded. Monthly quota usage can be viewed in the Subscription section of Kimi homepage settings.
