# Environment Only Synthetic Report

Affected version: desktop helper release 0.3.0.

Affected component: file watcher module `src/watch.ts`.

Environment: macOS 15.5, Node 24.1.0, pnpm 10.

Steps to reproduce:

1. Install dependencies.
2. Run command `npm run watch`.
3. Save the same file quickly three times.

Observed result: the process prints an error log and exits:

```text
Error: EMFILE too many open files
```

This is disruptive during development, but I do not have proof of concept evidence for attacker access, data exposure, privilege change, or other security impact.
