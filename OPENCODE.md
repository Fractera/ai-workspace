# Open Code — Agent Config

⚠️ **STOP. Read `AGENT.md` first.**
All architecture rules, forbidden zones, workflow, component limits,
skills-first policy and response style are defined there — not here.

---

## Open Code specific

**Setup:** Set `OPENROUTER_API_KEY` in `app/.env.local` or use the UI (Data button in workspace carousel)
**Bridge port:** `:3206`
**Non-interactive flag:** `opencode run --command message --format json --model openrouter/<model>`
**Free models:** DeepSeek R1, Llama 3.3 70B, Qwen, Mistral and 300+ more via [openrouter.ai](https://openrouter.ai)
**Get API key:** [openrouter.ai/workspaces/default/keys](https://openrouter.ai/workspaces/default/keys)
