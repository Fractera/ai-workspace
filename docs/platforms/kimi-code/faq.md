# Kimi Code FAQ

## Installation and Authentication

### Empty model list during /login

If you see the error "No models available for the selected platform" when running the `/login` (or `/setup`) command, it may be due to:

- **Invalid or expired API key:** Check whether the API key you entered is correct and still valid.
- **Network connection issues:** Confirm you can access the API service addresses (such as `api.kimi.com` or `api.moonshot.cn`).

> **Note: Distinguish Platforms**
>
> Kimi Code membership benefits and the Kimi Platform have different Base URLs. Please ensure your Base URL matches your API Key:
>
> | Platform | Base URL | Billing | Key Creation Portal |
> |---|---|---|---|
> | Kimi Code | OpenAI Compatible: `https://api.kimi.com/coding/v1`<br>Anthropic Compatible: `https://api.kimi.com/coding/` | Kimi membership subscription (with quota) | www.kimi.com/code/console |
> | Kimi Platform | `https://api.moonshot.cn/v1` | Pay-as-you-go | platform.kimi.ai |

### Invalid API key

Possible reasons for an invalid API key:

- **Key input error:** Check for extra spaces or missing characters.
- **Key expired or revoked:** Confirm the key status in the platform console.
- **Environment variable override:** Check whether `KIMI_API_KEY` or `OPENAI_API_KEY` environment variables are overriding the key in the config file. You can run `echo $KIMI_API_KEY` to check.

### Membership expired or quota exhausted

If you're using the Kimi Code platform, you can check your current quota and membership status with the `/usage` command. If the quota is exhausted or membership expired, you need to renew or upgrade at Kimi Code.

## Interaction Issues

### cd command doesn't work in shell mode

Executing the `cd` command in shell mode won't change Kimi Code CLI's working directory. This is because each shell command executes in an independent subprocess, and directory changes only take effect within that process.

If you need to change the working directory:

- **Exit and restart:** Run the `kimi` command again in the target directory.
- **Use the `--work-dir` flag:** Specify the working directory at startup, e.g. `kimi --work-dir /path/to/project`.
- **Use absolute paths in commands:** Execute commands directly with absolute paths, e.g. `ls /path/to/dir`.

### Working directory deleted or removed

If the working directory becomes inaccessible during a session (external drive unplugged, directory deleted, or filesystem unmounted), Kimi Code CLI detects this situation and displays a crash report containing the session ID and working directory path, then exits cleanly. You can recover the session with `kimi -r <session-id>` from the correct directory.

### Image paste fails

When using Ctrl-V to paste an image, if you see "Current model does not support image input", it means the current model doesn't support image input.

Solutions:

- **Switch to an image-capable model:** Use a model that supports the `image_in` capability.
- **Check clipboard content:** Make sure the clipboard contains actual image data, not just a file path to an image.

## ACP Issues

### IDE cannot connect to Kimi Code CLI

If your IDE (such as Zed or JetBrains IDE) cannot connect to Kimi Code CLI, check the following:

- **Confirm Kimi Code CLI is installed:** Run `kimi --version` to confirm successful installation.
- **Check configuration path:** Ensure the Kimi Code CLI path in the IDE configuration is correct. You can typically use `kimi acp` as the command.
- **Check uv path:** If installed via uv, ensure `~/.local/bin` is in PATH. You can use an absolute path, e.g. `/Users/yourname/.local/bin/kimi acp`.
- **Check logs:** Examine error messages in `~/.kimi/logs/kimi.log`.

## MCP Issues

### MCP server startup fails

After adding an MCP server, if tools aren't loaded or there are errors, it may be due to:

- **Command doesn't exist:** For stdio type servers, ensure the command (such as `npx`) is in PATH. You can configure with an absolute path.
- **Configuration format error:** Check whether `~/.kimi/mcp.json` is valid JSON. Run `kimi mcp list` to view the current configuration.

Debugging steps:

```bash
# View configured servers
kimi mcp list

# Test whether the server is working
kimi mcp test <server-name>
```

### OAuth authorization fails

For MCP servers that require OAuth authorization (such as Linear), if authorization fails:

- **Check network connection:** Ensure you can access the authorization server.
- **Re-authorize:** Run `kimi mcp auth <server-name>` to authorize again.
- **Reset authorization:** If authorization info is corrupted, run `kimi mcp reset-auth <server-name>` to clear it and retry.

### Header format error

When adding HTTP type MCP servers, the header format should be `KEY: VALUE` (with a space after the colon). For example:

```bash
# Correct
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: your-key"

# Wrong (missing space or using equals sign)
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY=your-key"
```

## Print/Wire Mode Issues

### Invalid JSONL input format

When using `--input-format stream-json`, the input must be valid JSONL (one JSON object per line). Common issues:

- **JSON format error:** Ensure each line is a complete JSON object without syntax errors.
- **Encoding issues:** Ensure the input uses UTF-8 encoding.
- **Line ending issues:** Windows users should check whether line endings are `\n` rather than `\r\n`.

Correct input format example:

```json
{"role": "user", "content": "Hello"}
```

### No output in print mode

If there's no output in `--print` mode, it may be because:

- **No input provided:** You need to provide input via `--prompt` (or `--command`) or stdin. For example: `kimi --print --prompt "Hello"`.
- **Output is buffered:** Try using `--output-format stream-json` for streaming output.
- **Configuration incomplete:** Ensure the API key and model are configured via `/login`.

## Updates and Upgrades

### macOS slow first run

macOS's Gatekeeper security mechanism checks new programs on first run, causing slow startup. Solutions:

- **Wait for the check to complete:** Be patient on first run; subsequent launches will return to normal.
- **Add to Developer Tools:** Add your terminal application in "System Settings → Privacy & Security → Developer Tools".

### How to upgrade Kimi Code CLI

Use uv to upgrade to the latest version:

```bash
uv tool upgrade kimi-cli --no-cache
```

Adding the `--no-cache` flag ensures you get the latest version.

### Update prompt on startup

When the background check finds a newer version, Kimi Code CLI displays a blocking update prompt before the shell loads, listing the current and latest version information. You can choose an action with the following keys:

- **Enter:** Upgrade to the latest version immediately
- **q:** Skip for now; you will be reminded on next startup
- **s:** Skip this version and suppress future reminders (until a newer version is released)

### How to disable update reminders

If you don't want Kimi Code CLI to check for updates in the background, set the environment variable:

```bash
export KIMI_CLI_NO_AUTO_UPDATE=1
```

You can add this line to your shell configuration file (such as `~/.zshrc` or `~/.bashrc`).

## VS Code Extension FAQ

The following are common issues with the Kimi Code VS Code Extension.

### VS Code prompts that no workspace is open

Please open a folder in VS Code. The Kimi Code VS Code Extension requires a workspace to function properly.

### VS Code prompts that CLI cannot be found

Please manually install Kimi Code CLI and configure `kimi.executablePath` in VS Code settings, or ensure the built-in CLI is present.

### VS Code login fails

Please try skipping login and using API key mode, check your network connection, or retry later through the VS Code extension's action menu.

### VS Code sends messages with no response

Please confirm that Kimi Code CLI is available, the model is configured, and a workspace folder is open in VS Code. Check error logs via "Kimi Code: Show Logs".

### VS Code connection timeout

If there is no response within 30 seconds, it will time out. Please check your network and retry.

### VS Code error before sending a message

Certain errors prevent sending messages in VS Code, such as Kimi Code CLI not found, version too low, not logged in, or session busy. Errors will be shown as toast notifications, and your input will be retained for retry.

## Feedback and Contact

### Documentation didn't solve your problem

If the above didn't resolve your issue, feel free to contact us via email: code@moonshot.ai. Please describe the problem you encountered, the steps you took, and any relevant log information in the email, and we will reply as soon as possible.
