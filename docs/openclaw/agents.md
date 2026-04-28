# Open Claw — AGENTS.md (Architecture & Development Reference)

Source: https://github.com/openclaw/openclaw AGENTS.md

---

## Start

- Repo: https://github.com/openclaw/openclaw
- Replies use repo-root refs only (e.g. `extensions/telegram/src/index.ts:80`)
- Run `pnpm docs:list` first if available
- High-confidence answers only — verify source, tests, shipped behavior, dependency contracts

---

## Repository Map

| Area | Path |
|---|---|
| Core TS | `src/` · `ui/` · `packages/` |
| Plugins | `extensions/` |
| SDK | `src/plugin-sdk/*` |
| Channels | `src/channels/*` |
| Loader | `src/plugins/*` |
| Protocol | `src/gateway/protocol/*` |
| Docs/Apps | `docs/` · `apps/` · `Swabble/` |
| Installers | sibling `../openclaw.ai` |

Scoped guides exist in: `extensions/`, `src/{plugin-sdk,channels,plugins,gateway,gateway/protocol,agents}/`, `test/helpers*/`, `docs/`, `ui/`, `scripts/`

---

## Architecture Rules

- Core stays extension-agnostic — no bundled ids in core
- Extensions cross into core only via `openclaw/plugin-sdk/*`, manifest metadata, injected runtime helpers, documented barrels (`api.ts`, `runtime-api.ts`)
- Extension prod code: no `core src/**`, `src/plugin-sdk-internal/**`, other extension `src/**`, or relative outside package
- Core/tests: no deep plugin internals (`extensions/*/src/**`, `onboard.js`) — use `api.ts`, SDK facade, generic contracts
- Owner boundary: fix owner-specific behavior in the owner module
- Gateway protocol changes: additive first; incompatible needs versioning/docs/client follow-through
- Prompt cache: deterministic ordering for maps/sets/registries/plugin lists/files/network results before model/tool payloads

---

## Commands

```bash
# Runtime
node -v  # Node 22+ required; keep Node + Bun paths working

# Install
pnpm install

# CLI / dev
pnpm openclaw ...
pnpm dev

# Build
pnpm build

# Smart gate
pnpm check:changed
pnpm changed:lanes --json
pnpm check:changed --staged

# Full prod sweep
pnpm check

# Tests
pnpm test
pnpm test:changed
pnpm test:serial
pnpm test:coverage
pnpm test:extensions
pnpm test extensions/<id>
pnpm test <path-or-filter> [vitest args]

# Typecheck (tsgo lanes only — do NOT use tsc --noEmit)
pnpm tsgo*
pnpm check:test-types

# Formatting (oxfmt, NOT Prettier)
pnpm format:check
pnpm format
pnpm exec oxfmt --check --threads=1 <files>
pnpm exec oxfmt --write --threads=1 <files>

# Linting (repo wrappers only)
pnpm lint:*
node scripts/run-oxlint.mjs

# Generated/API drift
pnpm check:architecture
pnpm config:docs:gen
pnpm plugin-sdk:api:gen
```

---

## Testing Rules

- Vitest only. Colocated `*.test.ts`; e2e `*.e2e.test.ts`
- Example models: `sonnet-4.6`, `gpt-5.4`
- Do NOT run multiple independent `pnpm test` commands concurrently in same worktree (race on `node_modules/.experimental-vitest-cache`)
- Test workers max 16. Memory pressure: `OPENCLAW_VITEST_MAX_WORKERS=1 pnpm test`
- Live tests: `OPENCLAW_LIVE_TEST=1 pnpm test:live`
- No Jest flags (`--runInBand`) — use `pnpm test:serial` or `OPENCLAW_VITEST_MAX_WORKERS=1`
- Clean timers/env/globals/mocks/sockets/temp dirs/module state between tests
- Mock expensive seams directly: scanners, manifests, registries, fs crawls, provider SDKs, network/process launch
- Do not edit baseline/inventory/ignore/snapshot/expected-failure files without explicit approval

---

## Code Rules

- TypeScript ESM, strict. Avoid `any`; prefer real types, `unknown`, narrow adapters
- No `@ts-nocheck`. Lint suppressions: intentional + explained only
- External boundaries: prefer zod or existing schema helpers
- No static+dynamic import for same prod module — use `*.runtime.ts` lazy boundary
- No prototype mixins/mutations — prefer inheritance/composition
- Split files around ~700 LOC when clarity/testability improves
- Product/docs/UI/changelog: say "plugin/plugins" (`extensions/` is internal)
- American English spelling

---

## Git Rules

```bash
# Commit via script (formats staged files)
scripts/committer "<msg>" <file...>
```

- Commits: conventional-ish, concise, grouped
- `main`: no merge commits; rebase on latest `origin/main` before push
- No manual stash/autostash unless explicit
- Do not delete/rename unexpected files

---

## Security

- Never commit: real phone numbers, videos, credentials, live config
- Secrets: `~/.openclaw/credentials/` and `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`
- Dependency patches/overrides/vendor changes: need explicit approval
- Releases/publish/version bumps: need explicit approval

---

## Version Bump Touches

When bumping version, update ALL of:
- `package.json`
- `apps/android/app/build.gradle.kts`
- `apps/ios/version.json` + `pnpm ios:version:sync`
- macOS `Info.plist`
- `docs/install/updating.md`

---

## Naming

| Context | Use |
|---|---|
| Product / docs / UI / changelog | OpenClaw |
| CLI / package / path / config | openclaw |

---

## Fractera Integration Notes

- Gateway: `openclaw gateway status` — port 18789
- Logs: `./scripts/clawlog.sh`
- Gateway restart: `openclaw gateway restart` (never ad-hoc tmux)
- Mobile LAN pairing: plaintext `ws://` loopback-only; private network needs `OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1`
- Planned for: Fractera **v1.4**
