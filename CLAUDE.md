# Fractera AI Workspace

## Project structure

```
fractera-light/
  app/          ← Next.js application (port 3000) — work here only
  bridges/      ← WebSocket bridge server (ports 3200–3206)
  services/     ← Media service (port 3300)
  docs/         ← Documentation: platforms, hosting, lightrag, openclaw
  package.json  ← Root: runs all three services via concurrently
```

## Working directory rule

**Always run Claude Code from `app/` — never from the project root.**

The root is for infrastructure only (starting services, installing dependencies).
All development work — code, components, database, API routes — lives in `app/`.

If you are currently in the project root: `cd app` then restart Claude Code.

## Documentation

All reference documentation is in `docs/`:

- `docs/platforms/` — install and usage guides for each AI platform
- `docs/hosting/` — deployment guides for VPS providers (Hetzner, Oracle, DigitalOcean, etc.)
- `docs/lightrag/` — LightRAG (Company Brain) — coming in v1.3
- `docs/openclaw/` — Open Claw orchestration — coming in v1.4

When installing a platform or deploying — read the relevant doc folder first.
Never rely on training memory for install commands — docs are always more current.
