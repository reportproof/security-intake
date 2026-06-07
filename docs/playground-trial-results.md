# Playground Trial Results

This records the external GitHub Action evaluation path using
[reportproof/security-intake-playground](https://github.com/reportproof/security-intake-playground).

The playground is a separate public repository that consumes this Action as:

```yaml
uses: reportproof/security-intake@main
```

The reports are sanitized, synthetic examples. These runs validate integration
behavior and output shape only; they do not claim vulnerabilities in any real
project.

## Run Set

- Date: 2026-06-05
- Playground commit:
  [`231ddff`](https://github.com/reportproof/security-intake-playground/commit/231ddff0d5a798b1021e0ac95eca249365e3c7bb)
- Consumed `security-intake` commit:
  [`4ab43b8`](https://github.com/reportproof/security-intake/commit/4ab43b8343ea722e5273b4632d395e36c82022ff)
- Runner: GitHub-hosted `ubuntu-24.04`
- Token permissions observed in logs: `contents: read`, `metadata: read`

## Full Matrix Run

The playground regression workflow ran all five public report shapes and passed:

- Workflow: `Security Intake Playground`
- Run:
  [27012296491](https://github.com/reportproof/security-intake-playground/actions/runs/27012296491)
- Result: success

The matrix validates:

- expected decision output,
- generated result file path,
- generated result file existence,
- generated result includes the expected decision,
- generated result does not copy selected report-body text.

## Single-Report Evaluation Runs

These runs validate the report-only workflow a maintainer would use for manual
evaluation. Each run uploaded `security-intake-result.md` as a 7-day artifact.

| Report | Run | Decision | Score | Artifact | Result |
| --- | --- | --- | ---: | --- | --- |
| `reports/good-report.md` | [27012336325](https://github.com/reportproof/security-intake-playground/actions/runs/27012336325) | `ready_for_maintainer_review` | 100 | [7435482938](https://github.com/reportproof/security-intake-playground/actions/runs/27012336325/artifacts/7435482938) | Pass |
| `reports/missing-proof.md` | [27012336566](https://github.com/reportproof/security-intake-playground/actions/runs/27012336566) | `needs_more_evidence` | 86 | [7435483605](https://github.com/reportproof/security-intake-playground/actions/runs/27012336566/artifacts/7435483605) | Pass |
| `reports/scanner-dump.md` | [27012336324](https://github.com/reportproof/security-intake-playground/actions/runs/27012336324) | `likely_low_quality_or_ai_generated` | 0 | [7435483259](https://github.com/reportproof/security-intake-playground/actions/runs/27012336324/artifacts/7435483259) | Pass |

## What Was Verified

- A separate public repository can run `reportproof/security-intake@main`.
- The manual workflow can evaluate one selected report through
  `workflow_dispatch`.
- The Action works with a committed `.security-intake.yml` config.
- `fail-on-low-quality: "false"` keeps evaluation report-only while preserving
  the decision and score.
- The generated Markdown artifact is downloadable and readable.
- The three core maintainer paths are represented:
  - complete report routes to maintainer review,
  - salvageable report asks for missing proof,
  - scanner dump routes away from direct maintainer triage.

## Notes

Artifact links expire according to GitHub Actions retention. The run links remain
useful as historical proof that the external workflow completed successfully.

Do not treat these results as a product launch signal. They are enough to start
small maintainer feedback requests, not broad distribution.
