# Remote connections

SSH remote connections are currently in alpha. To enable them today, set `remote_connections = true` in the `[features]` table in `~/.codex/config.toml`. Availability, setup flows, and supported environments may change as the feature improves.

Remote connections let Codex work with projects that live on another SSH-accessible machine. Use them when the codebase, credentials, services, or build environment you need are available on that host instead of your local machine.

Keep the remote host configured with the same security expectations you use for normal SSH access: trusted keys, least-privilege accounts, and no unauthenticated public listeners.

## Codex app

In the Codex app, add remote projects from an SSH host and run threads against the remote filesystem and shell.

1. Add the host to your SSH config so Codex can auto-discover it.

   ```text
   Host devbox
     HostName devbox.example.com
     User you
     IdentityFile ~/.ssh/id_ed25519
   ```

   Codex reads concrete host aliases from `~/.ssh/config`, resolves them with OpenSSH, and ignores pattern-only hosts.

2. Confirm you can SSH to the host from the machine running the Codex app.

   ```bash
   ssh devbox
   ```

3. Install and authenticate Codex on the remote host.

   The app starts the remote Codex app server through SSH, using the remote user's login shell. Make sure the `codex` command is available on the remote host's `PATH` in that shell.

4. In the Codex app, open **Settings > Connections**, add or enable the SSH host, then choose a remote project folder.

If remote connections don't appear yet, enable the alpha feature flag in `~/.codex/config.toml`:

```toml
[features]
remote_connections = true
```

Remote project threads run commands, read files, and write changes on the remote host.

## Authentication and network exposure

Use SSH port forwarding with local-host WebSocket listeners. Don't expose an unauthenticated app-server listener on a shared or public network.

If you need to reach a remote machine outside your current network, use a VPN or mesh networking tool such as Tailscale instead of exposing the app server directly to the internet.

## See also

- [Codex app settings](https://developers.openai.com/codex/app/settings)
- [Command line options](https://developers.openai.com/codex/cli/reference)
- [Authentication](https://developers.openai.com/codex/auth)
