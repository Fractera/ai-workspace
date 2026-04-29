# Get Started with OpenCode

OpenCode is an open source AI coding agent. It's available as a terminal-based interface, desktop app, or IDE extension.

## Prerequisites

To use OpenCode in your terminal, you'll need:

- A modern terminal emulator like:
  - [WezTerm](https://wezterm.org), cross-platform
  - [Alacritty](https://alacritty.org), cross-platform
  - [Ghostty](https://ghostty.org), Linux and macOS
  - [Kitty](https://sw.kovidgoyal.net/kitty/), Linux and macOS
- API keys for the LLM providers you want to use.

## Install

The easiest way to install OpenCode is through the install script.

```bash
curl -fsSL https://opencode.ai/install | bash
```

You can also install it with the following commands:

### Using Node.js

```bash
# npm
npm install -g opencode-ai

# Bun
bun install -g opencode-ai

# pnpm
pnpm install -g opencode-ai

# Yarn
yarn global add opencode-ai
```

### Using Homebrew on macOS and Linux

```bash
brew install anomalyco/tap/opencode
```

> We recommend using the OpenCode tap for the most up to date releases. The official `brew install opencode` formula is maintained by the Homebrew team and is updated less frequently.

### Installing on Arch Linux

```bash
sudo pacman -S opencode           # Arch Linux (Stable)
paru -S opencode-bin              # Arch Linux (Latest from AUR)
```

### Windows

**Recommended: Use WSL**

For the best experience on Windows, we recommend using Windows Subsystem for Linux (WSL). It provides better performance and full compatibility with OpenCode's features.

**Using Chocolatey**

```bash
choco install opencode
```

**Using Scoop**

```bash
scoop install opencode
```

**Using NPM**

```bash
npm install -g opencode-ai
```

**Using Mise**

```bash
mise use -g github:anomalyco/opencode
```

**Using Docker**

```bash
docker run -it --rm ghcr.io/anomalyco/opencode
```

> Support for installing OpenCode on Windows using Bun is currently in progress.

You can also grab the binary from the [Releases](https://github.com/anomalyco/opencode/releases).

## Configure

With OpenCode you can use any LLM provider by configuring their API keys.

If you are new to using LLM providers, we recommend using **OpenCode Zen**. It's a curated list of models that have been tested and verified by the OpenCode team.

1. Run the `/connect` command in the TUI, select `opencode`, and head to `opencode.ai/auth`.

   ```
   /connect
   ```

2. Sign in, add your billing details, and copy your API key.

3. Paste your API key:

   ```
   ┌ API key
   │
   │
   └ enter
   ```

Alternatively, you can select one of the other providers.

## Initialize

Now that you've configured a provider, navigate to a project that you want to work on.

```bash
cd /path/to/project
```

And run OpenCode.

```bash
opencode
```

Next, initialize OpenCode for the project by running the following command.

```
/init
```

This will get OpenCode to analyze your project and create an `AGENTS.md` file in the project root.

> **Tip:** You should commit your project's `AGENTS.md` file to Git.
>
> This helps OpenCode understand the project structure and the coding patterns used.

## Usage

You are now ready to use OpenCode to work on your project. Feel free to ask it anything!

### Ask Questions

You can ask OpenCode to explain the codebase to you.

> **Tip:** Use the `@` key to fuzzy search for files in the project.

```
How is authentication handled in @packages/functions/src/api/index.ts
```

This is helpful if there's a part of the codebase that you didn't work on.

### Add Features

You can ask OpenCode to add new features to your project. We first recommend asking it to create a plan.

#### Create a Plan

OpenCode has a **Plan mode** that disables its ability to make changes and instead suggests how it'll implement the feature.

Switch to it using the `Tab` key. You'll see an indicator for this in the lower right corner.

```
<TAB>
```

Now describe what you want it to do:

```
When a user deletes a note, we'd like to flag it as deleted in the database.
Then create a screen that shows all the recently deleted notes.
From this screen, the user can undelete a note or permanently delete it.
```

You want to give OpenCode enough details to understand what you want. It helps to talk to it like you are talking to a junior developer on your team.

> **Tip:** Give OpenCode plenty of context and examples to help it understand what you want.

#### Iterate on the Plan

Once it gives you a plan, you can give it feedback or add more details.

```
We'd like to design this new screen using a design I've used before.
[Image #1] Take a look at this image and use it as a reference.
```

> **Tip:** Drag and drop images into the terminal to add them to the prompt.
>
> OpenCode can scan any images you give it and add them to the prompt.

#### Build the Feature

Once you feel comfortable with the plan, switch back to **Build mode** by hitting `Tab` again.

```
<TAB>
```

And ask it to make the changes:

```
Sounds good! Go ahead and make the changes.
```

### Make Changes

For more straightforward changes, you can ask OpenCode to directly build it without reviewing the plan first.

```
We need to add authentication to the /settings route. Take a look at how this is
handled in the /notes route in @packages/functions/src/notes.ts and implement
the same logic in @packages/functions/src/settings.ts
```

Provide a good amount of detail so OpenCode makes the right changes.

### Undo Changes

If OpenCode makes changes you didn't want, undo them with:

```
/undo
```

OpenCode will revert the changes and show your original message again so you can tweak the prompt and try again.

> **Tip:** You can run `/undo` multiple times to undo multiple changes.

To redo undone changes:

```
/redo
```

### Share

Conversations can be shared with your team.

```
/share
```

This will create a link to the current conversation and copy it to your clipboard.

> **Note:** Conversations are not shared by default.

## Customize

To make OpenCode your own, we recommend:

- Picking a theme
- Customizing the keybinds
- Configuring code formatters
- Creating custom commands
- Playing around with the OpenCode config
