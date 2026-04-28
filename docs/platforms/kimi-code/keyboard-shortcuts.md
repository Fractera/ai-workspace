# Kimi Code — Keyboard Shortcuts Quick Reference

Kimi Code CLI shell mode supports the following keyboard shortcuts. Press Ctrl-D to exit when the input box is empty; press Ctrl-C to interrupt the current operation or clear the input.

## Shortcuts

| Shortcut | Function |
|---|---|
| Ctrl-X | Toggle agent / shell mode. Prompt changes with the mode: Agent ✨, Thinking 💫, Plan 📋, Shell $ |
| Shift-Tab | Toggle plan mode (read-only research and planning). After enabling, the prompt changes to 📋, and a blue plan badge appears in the status bar. You can also manage it via the `/plan` slash command |
| Ctrl-C | Interrupt the current operation; in the input box, clears the input; during slash command execution, interrupts the command |
| Ctrl-D | Exit Kimi Code CLI (only when the input box is empty) |
| Ctrl-S | Immediately inject a message into the current turn context while the AI is running (Steer). Unlike queued sending (Enter), the injected message is immediately seen and responded to by the AI |
| Ctrl-J / Alt-Enter | Insert a newline (by default, Enter submits the message) |
| Enter | Submit the message. When the AI is running, messages enter the queue and are automatically sent after the current turn completes |
| Ctrl-O | Edit current input in an external editor. Editor priority: `/editor` configuration → `$VISUAL` → `$EDITOR` → auto-detect (`code --wait` → `vim` → `vi` → `nano`). After saving, replaces the input box content; if not saved, remains unchanged. Pasted text placeholders are automatically expanded in the editor, and unmodified portions are re-collapsed after saving |
| Ctrl-V | Paste clipboard content. Text exceeding 1000 characters or 15 lines is automatically collapsed into `[Pasted text #n]`, expanding when sent; images are cached as `[image:xxx.png,WxH]` (requires model support for `image_in`); videos are inserted as file paths (requires model support for `video_in`) |
| Ctrl-E | Expand the full content of a truncated approval request (fullscreen pager). When truncated, displays "... (truncated, ctrl-e to expand)". Useful for viewing longer shell commands or file diffs |
| 1–3 | Approval panel: directly select and submit the corresponding option by number, without using arrow keys + Enter |
| 4 | Approval panel: decline with feedback. After entering the feedback mode, type the reason for declining or how you expect the agent to adjust, then press Enter to submit. The feedback text is passed to the agent to guide its next attempt |
| ↑ / ↓ | Question panel: browse options |
| ← / → / Tab | Question panel: switch questions (in multi-question mode, displayed as tabs; answered questions are marked as complete, and switching back restores the previous selection) |
| 1–5 | Question panel: select options by number. Auto-submits for single-select, toggles selection state for multi-select |
| Space | Question panel: submit selection in single-select mode, toggle selection state in multi-select mode |
| Enter | Question panel: confirm selection |
| Esc | Question panel: skip the question |
| / | Trigger the slash command completion menu. Use arrow keys to select, Enter to confirm, Esc to close, and continue typing to filter |
| @ | Trigger the working directory file path completion menu. Use arrow keys to select, Enter to confirm, Esc to close, and continue typing to filter |

## Status bar

The bottom status bar auto-refreshes, displaying:

- Current time
- Current mode (agent/shell) and model name
- YOLO badge (yellow when enabled)
- Plan badge (blue when enabled)
- Shortcut hints
- Context usage rate
