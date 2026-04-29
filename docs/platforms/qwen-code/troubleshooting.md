# Troubleshooting

This guide provides solutions to common issues and debugging tips, including topics on:

- Authentication or login errors
- Frequently asked questions (FAQs)
- Debugging tips
- Existing GitHub Issues similar to yours or creating new Issues

## Authentication or login errors

**Error: `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`, `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, or `unable to get local issuer certificate`**

- **Cause**: You may be on a corporate network with a firewall that intercepts and inspects SSL/TLS traffic. This often requires a custom root CA certificate to be trusted by Node.js.
- **Solution**: Set the `NODE_EXTRA_CA_CERTS` environment variable to the absolute path of your corporate root CA certificate file.
- **Example**: `export NODE_EXTRA_CA_CERTS=/path/to/your/corporate-ca.crt`

**Error: `Device authorization flow failed: fetch failed`**

- **Cause**: Node.js could not reach Qwen OAuth endpoints (often a proxy or SSL/TLS trust issue). When available, Qwen Code will also print the underlying error cause (for example: `UNABLE_TO_VERIFY_LEAF_SIGNATURE`).
- **Solution**:
  1. Confirm you can access `https://chat.qwen.ai` from the same machine/network.
  2. If you are behind a proxy, set it via `qwen --proxy <url>` (or the `proxy` setting in `settings.json`).
  3. If your network uses a corporate TLS inspection CA, set `NODE_EXTRA_CA_CERTS` as described above.

**Issue: Unable to display UI after authentication failure**

- **Cause**: If authentication fails after selecting an authentication type, the `security.auth.selectedType` setting may be persisted in `settings.json`. On restart, the CLI may get stuck trying to authenticate with the failed auth type.
- **Solution**: Clear the `security.auth.selectedType` configuration item:
  1. Open `~/.qwen/settings.json` (or `./.qwen/settings.json` for project-specific settings)
  2. Remove the `security.auth.selectedType` field
  3. Restart the CLI to allow it to prompt for authentication again

## Frequently asked questions (FAQs)

**Q: How do I update Qwen Code to the latest version?**

If you installed it globally via npm:
```bash
npm install -g @qwen-code/qwen-code@latest
```
If you compiled it from source, pull the latest changes from the repository and rebuild:
```bash
npm run build
```

**Q: Where are the Qwen Code configuration or settings files stored?**

The Qwen Code configuration is stored in two `settings.json` files:

- In your home directory: `~/.qwen/settings.json`.
- In your project's root directory: `./.qwen/settings.json`.

Refer to Qwen Code Configuration for more details.

**Q: Why don't I see cached token counts in my stats output?**

Cached token information is only displayed when cached tokens are being used. This feature is available for API key users but not for OAuth users, because the Qwen Code Assist API does not support cached content creation. You can still view your total token usage using the `/stats` command.

## Common error messages and solutions

**Error: `EADDRINUSE` (Address already in use) when starting an MCP server**

- **Cause**: Another process is already using the port that the MCP server is trying to bind to.
- **Solution**: Either stop the other process that is using the port or configure the MCP server to use a different port.

**Error: `Command not found` (when attempting to run Qwen Code with `qwen`)**

- **Cause**: The CLI is not correctly installed or it is not in your system's PATH.
- **Solution**:
  - If installed globally: ensure your npm global binary directory is in your PATH. Update with `npm install -g @qwen-code/qwen-code@latest`.
  - If running from source: ensure you use the correct command (e.g. `node packages/cli/dist/index.js ...`) and rebuild with `npm run build`.

**Error: `MODULE_NOT_FOUND` or import errors**

- **Cause**: Dependencies are not installed correctly, or the project hasn't been built.
- **Solution**:
  1. Run `npm install` to ensure all dependencies are present.
  2. Run `npm run build` to compile the project.
  3. Verify that the build completed successfully with `npm run start`.

**Error: "Operation not permitted", "Permission denied", or similar**

- **Cause**: When sandboxing is enabled, Qwen Code may attempt operations restricted by your sandbox configuration.
- **Solution**: Refer to the Sandboxing documentation for more information, including how to customize your sandbox configuration.

**Qwen Code is not running in interactive mode in "CI" environments**

- **Cause**: The `is-in-ci` package checks for the presence of `CI`, `CONTINUOUS_INTEGRATION`, or any environment variable with a `CI_` prefix. When any of these are found, it assumes a non-interactive CI environment.
- **Solution**: If the `CI_` prefixed variable is not needed, temporarily unset it:
  ```bash
  env -u CI_TOKEN qwen
  ```

**DEBUG mode not working from project `.env` file**

- **Cause**: The `DEBUG` and `DEBUG_MODE` variables are automatically excluded from project `.env` files to prevent interference with the CLI behavior.
- **Solution**: Use a `.qwen/.env` file instead, or configure `advanced.excludedEnvVars` in `settings.json`.

**IDE Companion not connecting**

- Ensure VS Code has a single workspace folder open.
- Restart the integrated terminal after installing the extension so it inherits `QWEN_CODE_IDE_WORKSPACE_PATH` and `QWEN_CODE_IDE_SERVER_PORT`.
- If running in a container, verify `host.docker.internal` resolves.
- Reinstall the companion with `/ide install` and use "Qwen Code: Run" in the Command Palette to verify it launches.

## Exit Codes

| Exit Code | Error Type | Description |
|-----------|-----------|-------------|
| `41` | `FatalAuthenticationError` | An error occurred during the authentication process. |
| `42` | `FatalInputError` | Invalid or missing input was provided to the CLI. (non-interactive mode only) |
| `44` | `FatalSandboxError` | An error occurred with the sandboxing environment (e.g. Docker, Podman, or Seatbelt). |
| `52` | `FatalConfigError` | A configuration file (`settings.json`) is invalid or contains errors. |
| `53` | `FatalTurnLimitedError` | The maximum number of conversational turns for the session was reached. (non-interactive mode only) |

## Debugging Tips

**CLI debugging:**

- Use the `--verbose` flag (if available) with CLI commands for more detailed output.
- Check the CLI logs, often found in a user-specific configuration or cache directory.

**Core debugging:**

- Check the server console output for error messages or stack traces.
- Use Node.js debugging tools (e.g. `node --inspect`) if you need to step through server-side code.

**Tool issues:**

- If a specific tool is failing, try to isolate the issue by running the simplest possible version of the command or operation the tool performs.
- For `run_shell_command`, check that the command works directly in your shell first.
- For file system tools, verify that paths are correct and check the permissions.

**Pre-flight checks:**

- Always run `npm run preflight` before committing code. This can catch many common issues related to formatting, linting, and type errors.

## Existing GitHub Issues or creating new Issues

If you encounter an issue not covered here, consider searching the Qwen Code Issue tracker on GitHub. If you can't find an issue similar to yours, consider creating a new GitHub Issue with a detailed description. Pull requests are also welcome!
