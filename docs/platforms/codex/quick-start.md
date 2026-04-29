# Quickstart

Every ChatGPT plan includes Codex.

You can also use Codex with API credits by signing in with an OpenAI API key.

## Setup

### App (Recommended)

The Codex app is available on macOS and Windows.

Most Codex app features are available on both platforms. Platform-specific exceptions are noted in the relevant docs.

#### 1. Download and install the Codex app

Download the Codex app for macOS or Windows. Choose the Intel build if you're using an Intel-based Mac.

[Get notified for Linux](https://openai.com/form/codex-app/)

#### 2. Open Codex and sign in

Once you downloaded and installed the Codex app, open it and sign in with your ChatGPT account or an OpenAI API key.

If you sign in with an OpenAI API key, some functionality such as cloud threads might not be available.

#### 3. Select a project

Choose a project folder that you want Codex to work in.

If you used the Codex app, CLI, or IDE Extension before you'll see past projects that you worked on.

#### 4. Send your first message

After choosing the project, make sure **Local** is selected to have Codex work on your machine and send your first message to Codex.

You can ask Codex anything about the project or your computer in general. Here are some examples:

- "Tell me about this project"
- "Build a classic Snake game in this repo."
- "Find and fix bugs in my codebase with minimal, high-confidence changes."

If you need more inspiration, explore [Codex use cases](https://developers.openai.com/codex/use-cases).
If you're new to Codex, read the [best practices guide](https://developers.openai.com/codex/learn/best-practices).

[Learn more about the Codex app](https://developers.openai.com/codex/app)

---

### IDE Extension (Codex in your IDE)

Install the Codex extension for your IDE.

#### 1. Install the Codex extension

Download it for your editor:

- [Download for Visual Studio Code](vscode:extension/openai.chatgpt)
- [Download for Cursor](cursor:extension/openai.chatgpt)
- [Download for Windsurf](windsurf:extension/openai.chatgpt)
- [Download for Visual Studio Code Insiders](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt)

#### 2. Open the Codex panel

Once installed, the Codex extension appears in the sidebar alongside your other extensions. It may be hidden in the collapsed section. You can move the Codex panel to the right side of the editor if you prefer.

#### 3. Sign in and start your first task

Sign in with your ChatGPT account or an API key to get started.

Codex starts in Agent mode by default, which lets it read files, run commands, and write changes in your project directory.

Example prompts:

- "Tell me about this project"
- "Build a classic Snake game in this repo."
- "Find and fix bugs in my codebase with minimal, high-confidence changes."

#### 4. Use Git checkpoints

Codex can modify your codebase, so consider creating Git checkpoints before and after each task so you can easily revert changes if needed.
If you're new to Codex, read the [best practices guide](https://developers.openai.com/codex/learn/best-practices).

[Learn more about the Codex IDE extension](https://developers.openai.com/codex/ide)

---

### CLI (Codex in your terminal)

The Codex CLI is supported on macOS, Windows, and Linux.

#### 1. Install the Codex CLI

Install with npm:

```bash
npm install -g @openai/codex
```

Install with Homebrew:

```bash
brew install codex
```

#### 2. Run `codex` and sign in

Run `codex` in your terminal to get started. You'll be prompted to sign in with your ChatGPT account or an API key.

#### 3. Ask Codex to work in your current directory

Once authenticated, you can ask Codex to perform tasks in the current directory.

Example prompts:

- "Tell me about this project"
- "Build a classic Snake game in this repo."
- "Find and fix bugs in my codebase with minimal, high-confidence changes."

#### 4. Use Git checkpoints

Codex can modify your codebase, so consider creating Git checkpoints before and after each task so you can easily revert changes if needed.
If you're new to Codex, read the [best practices guide](https://developers.openai.com/codex/learn/best-practices).

[Learn more about the Codex CLI](https://developers.openai.com/codex/cli)

---

### Cloud (Codex in your browser)

Use Codex in the cloud at [chatgpt.com/codex](https://chatgpt.com/codex).

#### 1. Open Codex in your browser

Go to [chatgpt.com/codex](https://chatgpt.com/codex). You can also delegate a task to Codex by tagging `@codex` in a GitHub pull request comment (requires signing in to ChatGPT).

#### 2. Set up an environment

Before starting your first task, set up an environment for Codex. Open the environment settings at [chatgpt.com/codex/settings/environments](https://chatgpt.com/codex/settings/environments) and follow the steps to connect a GitHub repository.

#### 3. Launch a task and monitor progress

Once your environment is ready, launch coding tasks from the [Codex interface](https://chatgpt.com/codex). You can monitor progress in real time by viewing logs, or let tasks run in the background.

Example prompts:

- "Tell me about this project"
- "Explain the top failure modes of my application's architecture."
- "Find and fix bugs in my codebase with minimal, high-confidence changes."

#### 4. Review changes and create a pull request

When a task completes, review the proposed changes in the diff view. You can iterate on the results or create a pull request directly in your GitHub repository.

Codex also provides a preview of the changes. You can accept the PR as is, or check out the branch locally to test the changes:

```bash
git fetch
git checkout <branch-name>
```

[Learn more about Codex cloud](https://developers.openai.com/codex/cloud)
