# Use Codex in GitHub

Use Codex to review pull requests without leaving GitHub. Add a pull request comment with `@codex review`, and Codex replies with a standard GitHub code review.

## Set up code review

1. Set up [Codex cloud](https://developers.openai.com/codex/cloud).
2. Go to [Codex settings](https://chatgpt.com/codex/settings/code-review) and turn on **Code review** for your repository.

## Request a review

1. In a pull request comment, mention `@codex review`.
2. Wait for Codex to react (👀) and post a review.

Codex posts a review on the pull request, just like a teammate would.

## Enable automatic reviews

If you want Codex to review every pull request automatically, turn on **Automatic reviews** in [Codex settings](https://chatgpt.com/codex/settings/code-review). Codex will post a review whenever a new PR is opened for review, without needing an `@codex review` comment.

## Customize what Codex reviews

Codex searches your repository for `AGENTS.md` files and follows any **Review guidelines** you include.

To set guidelines for a repository, add or update a top-level `AGENTS.md` with a section like this:

```md
## Review guidelines

- Don't log PII.
- Verify that authentication middleware wraps every route.
```

Codex applies guidance from the closest `AGENTS.md` to each changed file. You can place more specific instructions deeper in the tree when particular packages need extra scrutiny.

For a one-off focus, add it to your pull request comment, for example:

`@codex review for security regressions`

In GitHub, Codex flags only P0 and P1 issues. If you want Codex to flag typos in documentation, add guidance in `AGENTS.md` (for example, "Treat typos in docs as P1.").

## Give Codex other tasks

If you mention `@codex` in a comment with anything other than `review`, Codex starts a [cloud task](https://developers.openai.com/codex/cloud) using your pull request as context.

```md
@codex fix the CI failures
```
