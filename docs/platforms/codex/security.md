# Codex Security

Codex Security helps engineering and security teams find, validate, and remediate likely vulnerabilities in connected GitHub repositories.

> **Note:** This page covers Codex Security, the product that scans connected GitHub repositories for likely security issues. For Codex sandboxing, approvals, network controls, and admin settings, see [Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security).

It helps teams:

1. **Find likely vulnerabilities** by using a repo-specific threat model and real code context.
2. **Reduce noise** by validating findings before you review them.
3. **Move findings toward fixes** with ranked results, evidence, and suggested patch options.

## How it works

Codex Security scans connected repositories commit by commit.
It builds scan context from your repo, checks likely vulnerabilities against that context, and validates high-signal issues in an isolated environment before surfacing them.

You get a workflow focused on:

- repo-specific context instead of generic signatures
- validation evidence that helps reduce false positives
- suggested fixes you can review in GitHub

## Access and prerequisites

Codex Security works with connected GitHub repositories through Codex Web. OpenAI manages access. If you need access or a repository isn't visible, contact your OpenAI account team and confirm the repository is available through your Codex Web workspace.

## Related docs

- [Codex Security setup](https://developers.openai.com/codex/security/setup) covers setup, scanning, and findings review.
- [FAQ](https://developers.openai.com/codex/security/faq) covers common product questions.
- [Improving the threat model](https://developers.openai.com/codex/security/threat-model) explains how to tune scope, attack surface, and criticality assumptions.
