# Authentication

## OpenAI authentication

Codex supports two ways to sign in when using OpenAI models:

- Sign in with ChatGPT for subscription access
- Sign in with an API key for usage-based access

Codex cloud requires signing in with ChatGPT. The Codex CLI and IDE extension support both sign-in methods.

Your sign-in method also determines which admin controls and data-handling policies apply.

- With sign in with ChatGPT, Codex usage follows your ChatGPT workspace permissions, RBAC, and ChatGPT Enterprise retention and residency settings
- With an API key, usage follows your API organization's retention and data-sharing settings instead

For the CLI, Sign in with ChatGPT is the default authentication path when no valid session is available.

### Sign in with ChatGPT

When you sign in with ChatGPT from the Codex app, CLI, or IDE Extension, Codex opens a browser window for you to complete the login flow. After you sign in, the browser returns an access token to the CLI or IDE extension.

### Sign in with an API key

You can also sign in to the Codex app, CLI, or IDE Extension with an API key. Get your API key from the [OpenAI dashboard](https://platform.openai.com/api-keys).

OpenAI bills API key usage through your OpenAI Platform account at standard API rates. See the [API pricing page](https://openai.com/api/pricing/).

Features that rely on ChatGPT credits, such as [fast mode](https://developers.openai.com/codex/speed), are available only when you sign in with ChatGPT. If you sign in with an API key, Codex uses standard API pricing instead.

Recommendation is to use API key authentication for programmatic Codex CLI workflows (for example CI/CD jobs). Don't expose Codex execution in untrusted or public environments.

## Secure your Codex cloud account

Codex cloud interacts directly with your codebase, so it needs stronger security than many other ChatGPT features. Enable multi-factor authentication (MFA).

If you use a social login provider (Google, Microsoft, Apple), you aren't required to enable MFA on your ChatGPT account, but you can set it up with your social login provider.

For setup instructions, see:

- [Google](https://support.google.com/accounts/answer/185839)
- [Microsoft](https://support.microsoft.com/en-us/topic/what-is-multifactor-authentication-e5e39437-121c-be60-d123-eda06bddf661)
- [Apple](https://support.apple.com/en-us/102660)

If you access ChatGPT through single sign-on (SSO), your organization's SSO administrator should enforce MFA for all users.

If you log in using an email and password, you must set up MFA on your account before accessing Codex cloud.

If your account supports more than one login method and one of them is email and password, you must set up MFA before accessing Codex, even if you sign in another way.

## Login caching

When you sign in to the Codex app, CLI, or IDE Extension using either ChatGPT or an API key, Codex caches your login details and reuses them the next time you start the CLI or extension. The CLI and extension share the same cached login details. If you log out from either one, you'll need to sign in again the next time you start the CLI or extension.

Codex caches login details locally in a plaintext file at `~/.codex/auth.json` or in your OS-specific credential store.

For sign in with ChatGPT sessions, Codex refreshes tokens automatically during use before they expire, so active sessions usually continue without requiring another browser login.

## Credential storage

Use `cli_auth_credentials_store` to control where the Codex CLI stores cached credentials:

```toml
# file | keyring | auto
cli_auth_credentials_store = "keyring"
```

- `file` stores credentials in `auth.json` under `CODEX_HOME` (defaults to `~/.codex`).
- `keyring` stores credentials in your operating system credential store.
- `auto` uses the OS credential store when available, otherwise falls back to `auth.json`.

If you use file-based storage, treat `~/.codex/auth.json` like a password: it contains access tokens. Don't commit it, paste it into tickets, or share it in chat.

## Enforce a login method or workspace

In managed environments, admins may restrict how users are allowed to authenticate:

```toml
# Only allow ChatGPT login or only allow API key login.
forced_login_method = "chatgpt" # or "api"

# When using ChatGPT login, restrict users to a specific workspace.
forced_chatgpt_workspace_id = "00000000-0000-0000-0000-000000000000"
```

If the active credentials don't match the configured restrictions, Codex logs the user out and exits.

These settings are commonly applied via managed configuration rather than per-user setup. See [Managed configuration](https://developers.openai.com/codex/enterprise/managed-configuration).

## Login diagnostics

Direct `codex login` runs write a dedicated `codex-login.log` file under your configured log directory. Use it when you need to debug browser-login or device-code failures, or when support asks for login-specific logs.

## Custom CA bundles

If your network uses a corporate TLS proxy or private root CA, set `CODEX_CA_CERTIFICATE` to a PEM bundle before logging in. When `CODEX_CA_CERTIFICATE` is unset, Codex falls back to `SSL_CERT_FILE`. The same custom CA settings apply to login, normal HTTPS requests, and secure websocket connections.

```shell
export CODEX_CA_CERTIFICATE=/path/to/corporate-root-ca.pem
codex login
```

## Login on headless devices

If you are signing in to ChatGPT with the Codex CLI, there are some situations where the browser-based login UI may not work:

- You're running the CLI in a remote or headless environment.
- Your local networking configuration blocks the localhost callback Codex uses to return the OAuth token to the CLI after you sign in.

In these situations, prefer device code authentication (beta). In the interactive login UI, choose **Sign in with Device Code**, or run `codex login --device-auth` directly. If device code authentication doesn't work in your environment, use one of the fallback methods.

### Preferred: Device code authentication (beta)

1. Enable device code login in your ChatGPT security settings (personal account) or ChatGPT workspace permissions (workspace admin).
2. In the terminal where you're running Codex, choose one of these options:
   - In the interactive login UI, select **Sign in with Device Code**.
   - Run `codex login --device-auth`.
3. Open the link in your browser, sign in, then enter the one-time code.

If device code login isn't enabled by the server, Codex falls back to the standard browser-based login flow.

### Fallback: Authenticate locally and copy your auth cache

If you can complete the login flow on a machine with a browser, you can copy your cached credentials to the headless machine.

1. On a machine where you can use the browser-based login flow, run `codex login`.
2. Confirm the login cache exists at `~/.codex/auth.json`.
3. Copy `~/.codex/auth.json` to `~/.codex/auth.json` on the headless machine.

Treat `~/.codex/auth.json` like a password: it contains access tokens. Don't commit it, paste it into tickets, or share it in chat.

If your OS stores credentials in a credential store instead of `~/.codex/auth.json`, this method may not apply. See [Credential storage](#credential-storage) for how to configure file-based storage.

Copy to a remote machine over SSH:

```shell
ssh user@remote 'mkdir -p ~/.codex'
scp ~/.codex/auth.json user@remote:~/.codex/auth.json
```

Or use a one-liner that avoids `scp`:

```shell
ssh user@remote 'mkdir -p ~/.codex && cat > ~/.codex/auth.json' < ~/.codex/auth.json
```

Copy into a Docker container:

```shell
# Replace MY_CONTAINER with the name or ID of your container.
CONTAINER_HOME=$(docker exec MY_CONTAINER printenv HOME)
docker exec MY_CONTAINER mkdir -p "$CONTAINER_HOME/.codex"
docker cp ~/.codex/auth.json MY_CONTAINER:"$CONTAINER_HOME/.codex/auth.json"
```

For a more advanced version of this same pattern on trusted CI/CD runners, see [Maintain Codex account auth in CI/CD (advanced)](https://developers.openai.com/codex/auth/ci-cd-auth). That guide explains how to let Codex refresh `auth.json` during normal runs and then keep the updated file for the next job. API keys are still the recommended default for automation.

### Fallback: Forward the localhost callback over SSH

If you can forward ports between your local machine and the remote host, you can use the standard browser-based flow by tunneling Codex's local callback server (default `localhost:1455`).

1. From your local machine, start port forwarding:

```shell
ssh -L 1455:localhost:1455 user@remote
```

2. In that SSH session, run `codex login` and follow the printed address on your local machine.

## Alternative model providers

When you define a [custom model provider](https://developers.openai.com/codex/config-advanced#custom-model-providers) in your configuration file, you can choose one of these authentication methods:

- **OpenAI authentication**: Set `requires_openai_auth = true` to use OpenAI authentication. You can then sign in with ChatGPT or an API key. This is useful when you access OpenAI models through an LLM proxy server. When `requires_openai_auth = true`, Codex ignores `env_key`.
- **Environment variable authentication**: Set `env_key = "<ENV_VARIABLE_NAME>"` to use a provider-specific API key from the local environment variable named `<ENV_VARIABLE_NAME>`.
- **No authentication**: If you don't set `requires_openai_auth` (or set it to `false`) and you don't set `env_key`, Codex assumes the provider doesn't require authentication. This is useful for local models.
