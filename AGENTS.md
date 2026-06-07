<!-- repobrief:start -->
## Repobrief

This repository uses Repobrief for AI coding work state.

Codex reads this guidance from `AGENTS.md`.
Claude Code reads this guidance from `CLAUDE.md`.

Preserve all existing project, repo, and team instructions in this file.
Repobrief only manages work-state continuity: wake context, active task selection, verification records, and handoff notes.
If these instructions conflict with existing project instructions, follow the project instructions and record the conflict in the handoff.

At the start of work:
- Run `repobrief wake --explain`.
- Continue only the selected active task.
- Do not use parked task context unless the user explicitly asks.

If the session was launched through `repobrief run codex` or `repobrief run claude`:
- Repobrief already printed wake context before the tool started.
- Repobrief will write an automatic handoff when the tool exits normally.

Before stopping, switching tools, or when context is getting long:
- Run `repobrief verify`.
- Run `repobrief handoff` and record what changed, what passed, risks, and next step.

If no task is selected:
- Ask the user for the intended task or run `repobrief start "<task title>"`.
<!-- repobrief:end -->
