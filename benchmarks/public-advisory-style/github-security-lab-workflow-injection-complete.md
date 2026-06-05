# Public Advisory-Style Synthetic Report: Workflow Injection

Synthetic benchmark only. This is modeled after coordinated disclosure advisory
structure, not copied from an upstream report.

Source shape: GitHub Security Lab publishes coordinated-disclosure advisories
only after patches are available.

Affected version: workflow-demo project at commit `5f6e7d8c9b0a1`.

Affected component: GitHub Actions workflow file `.github/workflows/release.yml`.

Environment: GitHub-hosted Ubuntu runner, default `pull_request_target`
workflow permissions, Node 24 build step.

Steps to reproduce:

1. Open a fork pull request that changes only Markdown documentation.
2. Set the pull request title to the synthetic marker `release-check`.
3. Let the privileged workflow run the release validation command.
4. Inspect the job log for the generated shell command.

Observed result: the job log shows the pull request title was interpolated into
the shell command before escaping.

Security impact: an external contributor could execute commands in a privileged
runner context and potentially access release credentials scoped to the workflow.

Proof of concept: the sanitized job log includes the command expansion below:

```text
 release_title="release-check"
 bash -lc "node scripts/release.js --title release-check"
 result=privileged-workflow-command-reached
```
