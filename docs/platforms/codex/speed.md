# Speed

## Fast mode

Codex offers the ability to increase the speed of the model for increased credit consumption.

Fast mode increases supported model speed by 1.5x and consumes credits at a higher rate than Standard mode. It currently supports GPT-5.5 and GPT-5.4, consuming credits at 2.5x the Standard rate for GPT-5.5 and 2x the Standard rate for GPT-5.4.

Use `/fast on`, `/fast off`, or `/fast status` in the CLI to change or inspect the current setting. You can also persist the default with `service_tier = "fast"` plus `[features].fast_mode = true` in `config.toml`. Fast mode is available in the Codex IDE extension, Codex CLI, and the Codex app when you sign in with ChatGPT. With an API key, Codex uses standard API pricing instead and you can't use Fast mode credits.

## Codex-Spark

GPT-5.3-Codex-Spark is a separate fast, less-capable Codex model optimized for near-instant, real-time coding iteration. Unlike fast mode, which speeds up a supported model at a higher credit rate, Codex-Spark is its own model choice and has its own usage limits.

During research preview Codex-Spark is only available for ChatGPT Pro subscribers.
