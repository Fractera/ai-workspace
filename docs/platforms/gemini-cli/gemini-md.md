# GEMINI.md — Gemini CLI Project Context

Gemini CLI is an open-source AI agent that brings the power of Gemini directly into the terminal. It is designed to be a terminal-first, extensible, and powerful tool for developers.

---

## Project Overview

**Purpose:** Provide a seamless terminal interface for Gemini models, supporting code understanding, generation, automation, and integration via MCP (Model Context Protocol).

**Main Technologies:**

- **Runtime:** Node.js (>=20.0.0, recommended ~20.19.0 for development)
- **Language:** TypeScript
- **UI Framework:** React (using Ink for CLI rendering)
- **Testing:** Vitest
- **Bundling:** esbuild
- **Linting/Formatting:** ESLint, Prettier

**Architecture:** Monorepo structure using npm workspaces.

- `packages/cli` — User-facing terminal UI, input processing, and display rendering.
- `packages/core` — Backend logic, Gemini API orchestration, prompt construction, and tool execution.
- `packages/a2a-server` — Experimental Agent-to-Agent server.
- `packages/sdk` — Programmatic SDK for embedding Gemini CLI capabilities.
- `packages/devtools` — Integrated developer tools (Network/Console inspector).
- `packages/test-utils` — Shared test utilities and test rig.
- `packages/vscode-ide-companion` — VS Code extension pairing with the CLI.

---

## Building and Running

| Command | Description |
|---|---|
| `npm install` | Install Dependencies |
| `npm run build:all` | Build All (Builds packages, sandbox, and VS Code companion) |
| `npm run build` | Build Packages |
| `npm run start` | Run in Development |
| `npm run debug` | Run in Debug Mode (Enables Node.js inspector) |
| `npm run bundle` | Bundle Project |
| `npm run clean` | Clean Artifacts |

---

## Testing and Quality

### Test Commands

| Command | Description |
|---|---|
| `npm run test` | Unit (All) |
| `npm run test:e2e` | Integration (E2E) |
| `npm run test:memory` | Memory (Nightly) — Runs memory regression tests against baselines. Excluded from preflight, run nightly. |
| `npm run test:perf` | Performance (Nightly) — Runs CPU performance regression tests against baselines. Excluded from preflight, run nightly. |
| `npm test -w <pkg> -- <path>` | Workspace-Specific (Note: `<path>` must be relative to the workspace root, e.g., `-w @google/gemini-cli-core -- src/routing/modelRouterService.test.ts`) |
| `npm run preflight` | Full Validation — Heaviest check; runs clean, install, build, lint, type check, and tests. |
| `npm run lint` | Lint only |
| `npm run format` | Format only |
| `npm run typecheck` | Type check only |

> **NOTE:** Please run the memory and perf tests locally only if you are implementing changes related to those test areas. Otherwise skip these tests locally and rely on CI to run them on nightly builds.

**Full Validation note:** `npm run preflight` is recommended before submitting PRs. Due to its long runtime, only run this at the very end of a code implementation task. If it fails, use faster, targeted commands (e.g., `npm run test`, `npm run lint`, or workspace-specific tests) to iterate on fixes before re-running preflight. For simple, non-code changes like documentation or prompting updates, skip preflight at the end of the task and wait for PR validation.

---

## Development Conventions

- **Contributions:** Follow the process outlined in `CONTRIBUTING.md`. Requires signing the Google CLA.
- **Pull Requests:** Keep PRs small, focused, and linked to an existing issue. Always activate the `pr-creator` skill for PR generation, even when using the `gh` CLI.
- **Commit Messages:** Follow the Conventional Commits standard.
- **Imports:** Use specific imports and avoid restricted relative imports between packages (enforced by ESLint).
- **License Headers:** For all new source code files (`.ts`, `.tsx`, `.js`), include the Apache-2.0 license header with the current year (e.g., `Copyright 2026 Google LLC`). This is enforced by ESLint.

---

## Testing Conventions

**Environment Variables:** When testing code that depends on environment variables, use `vi.stubEnv('NAME', 'value')` in `beforeEach` and `vi.unstubAllEnvs()` in `afterEach`. Avoid modifying `process.env` directly as it can lead to test leakage and is less reliable. To "unset" a variable, use an empty string `vi.stubEnv('NAME', '')`.

---

## Documentation

- Always use the `docs-writer` skill when you are asked to write, edit, or review any documentation.
- Documentation is located in the `docs/` directory.
- Suggest documentation updates when code changes render existing documentation obsolete or incomplete.
