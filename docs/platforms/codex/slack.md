# Use Codex in Slack

Use Codex in Slack to kick off coding tasks from channels and threads. Mention `@Codex` with a prompt, and Codex creates a cloud task and replies with the results.

## Set up the Slack app

1. Set up [Codex cloud tasks](https://developers.openai.com/codex/cloud). You need a Plus, Pro, Business, Enterprise, or Edu plan (see [ChatGPT pricing](https://chatgpt.com/pricing)), a connected GitHub account, and at least one [environment](https://developers.openai.com/codex/cloud/environments).
2. Go to [Codex settings](https://chatgpt.com/codex/settings/connectors) and install the Slack app for your workspace. Depending on your Slack workspace policies, an admin may need to approve the install.
3. Add `@Codex` to a channel. If you haven't added it yet, Slack prompts you when you mention it.

## Start a task

1. In a channel or thread, mention `@Codex` and include your prompt. Codex can reference earlier messages in the thread, so you often don't need to restate context.
2. (Optional) Specify an environment or repository in your prompt, for example: `@Codex fix the above in openai/codex`.
3. Wait for Codex to react (👀) and reply with a link to the task. When it finishes, Codex posts the result and, depending on your settings, an answer in the thread.

### How Codex chooses an environment and repo

- Codex reviews the environments you have access to and selects the one that best matches your request. If the request is ambiguous, it falls back to the environment you used most recently.
- The task runs against the default branch of the first repository listed in that environment's repo map. Update the repo map in Codex if you need a different default or more repositories.
- If no suitable environment or repository is available, Codex will reply in Slack with instructions on how to fix the issue before retrying.

### Enterprise data controls

By default, Codex replies in the thread with an answer, which can include information from the environment it ran in.
To prevent this, an Enterprise admin can clear **Allow Codex Slack app to post answers on task completion** in [ChatGPT workspace settings](https://chatgpt.com/admin/settings). When an admin turns off answers, Codex replies only with a link to the task.

### Data usage, privacy, and security

When you mention `@Codex`, Codex receives your message and thread history to understand your request and create a task.
Data handling follows OpenAI's [Privacy Policy](https://openai.com/privacy), [Terms of Use](https://openai.com/terms/), and other applicable [policies](https://openai.com/policies).
For more on security, see the Codex [security documentation](https://developers.openai.com/codex/agent-approvals-security).

Codex uses large language models that can make mistakes. Always review answers and diffs.

### Tips and troubleshooting

- **Missing connections**: If Codex can't confirm your Slack or GitHub connection, it replies with a link to reconnect.
- **Unexpected environment choice**: Reply in the thread with the environment you want (for example, `Please run this in openai/openai (applied)`), then mention `@Codex` again.
- **Long or complex threads**: Summarize key details in your latest message so Codex doesn't miss context buried earlier in the thread.
- **Workspace posting**: Some Enterprise workspaces restrict posting final answers. In those cases, open the task link to view progress and results.
- **More help**: See the [OpenAI Help Center](https://help.openai.com/).
