# security-intake

Evidence checks for security reports before maintainers triage them.

`security-intake` is an open-source CLI and GitHub Action that reviews incoming vulnerability reports, scanner dumps, and AI-generated security submissions for report quality. It does **not** decide whether a vulnerability is real. It checks whether the report has enough evidence to be worth human triage.

## Why this exists

Maintainers are being asked to spend time on reports that look plausible but lack affected versions, reproduction steps, proof of impact, or any tested evidence. The first ReportProof goal is to make incomplete reports cheap to identify, cheap to respond to, and easy to improve.

See [docs/problem.md](docs/problem.md) for the public evidence behind the problem.

## Quick start

```bash
npm install
npm test
npm run eval
node dist/cli.js examples/ai-slop-report.md --no-fail
```

Requires Node.js 24 or newer.

Run against any Markdown report:

```bash
node dist/cli.js examples/good-report.md
node dist/cli.js examples/ai-slop-report.md --json --no-fail
node dist/cli.js examples/scanner-dump.md --config .security-intake.yml --no-fail
node dist/cli.js examples/ai-slop-report.md --output security-intake-result.md --no-fail
```

## Example output

```md
# Security Intake Result

Decision: likely_low_quality_or_ai_generated
Exit code: 2
Score: 0/100

## Missing Evidence
- RP001_AFFECTED_VERSION: Affected version or commit (high)
- RP003_REPRODUCTION_STEPS: Reproduction steps (high)
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence (high)

## Suggested Maintainer Response
Thanks for the report. We cannot assess this as a vulnerability without...
```

## Decisions and exit codes

| Decision | Exit code | Meaning |
| --- | ---: | --- |
| `ready_for_maintainer_review` | 0 | The report has enough initial evidence for a human to triage. |
| `needs_more_evidence` | 1 | The report is missing important evidence, but may be salvageable. |
| `likely_low_quality_or_ai_generated` | 2 | The report combines missing evidence with multiple low-quality signals. |

Use `--no-fail` when you want a report without failing a script or GitHub Action step.

## GitHub Action

This repository can be used as a Node.js 24 GitHub Action.

```yaml
name: Security intake check

on:
  workflow_dispatch:

jobs:
  intake:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: reportproof/security-intake@main
        id: intake
        with:
          report-path: examples/ai-slop-report.md
          config-path: .security-intake.yml
          format: markdown
          output-path: security-intake-result.md
          fail-on-low-quality: "false"
      - run: echo "decision=${{ steps.intake.outputs.decision }} score=${{ steps.intake.outputs.score }}"
```

For early validation, keep `fail-on-low-quality` set to `false` and review the generated output manually.
The Action also writes a safe GitHub job summary with the decision, score, result file, and triggered rule IDs. It does not include the report body.

Action outputs:

| Output | Meaning |
| --- | --- |
| `decision` | One of the three intake decisions. |
| `score` | Score from `0` to `100`. |
| `exit-code` | CLI-style exit code for the decision. |
| `result-path` | Path to the written Markdown or JSON result file. |

## Configuration

Create `.security-intake.yml` in your repo:

```yaml
minReadyScore: 70
maxMissingForReady: 2
lowQualitySignalsForLikely: 3
missingForLikelyLowQuality: 3
disabledRules:
```

See [docs/configuration.md](docs/configuration.md).

## Rule rubric

Rules have stable IDs so maintainers can critique specific checks:

- `RP001_AFFECTED_VERSION`
- `RP002_AFFECTED_COMPONENT`
- `RP003_REPRODUCTION_STEPS`
- `RP004_OBSERVED_RESULT`
- `RP005_SECURITY_IMPACT`
- `RP006_PROOF_OR_EVIDENCE`
- `RP007_TESTED_ENVIRONMENT`
- `RP101_SPECULATIVE_IMPACT`
- `RP102_UNTESTED_CLAIM`
- `RP103_GENERIC_SCANNER_DUMP`
- `RP104_NO_CONCRETE_TARGET`
- `RP105_AI_GENERATED_DISCLOSURE`

See [docs/rubric.md](docs/rubric.md).

## Current scope

- Deterministic report-quality checks.
- Missing-evidence detection.
- Speculative-language detection.
- Maintainer-readable Markdown output.
- JSON output for integrations.
- Configurable thresholds and disabled rules.
- GitHub Action wrapper.
- TypeScript source compiled to plain Node.js for the CLI and Action.

## Not in scope yet

- Final vulnerability adjudication.
- Exploit generation.
- Automatic issue closing.
- Hosted SaaS workflow.
- Bug bounty marketplace replacement.
- LLM-based triage.

## Public validation

This is an early validation repo. Useful feedback is specific:

- A sanitized report that this tool classifies incorrectly.
- A rule that should be stricter or more lenient for your project.
- A missing field that maintainers need before triage.
- A workflow where this could save time without annoying legitimate researchers.

Open a feedback issue with a sanitized example. Do not post private vulnerabilities publicly.

The synthetic validation corpus lives in [fixtures/](fixtures/) and is documented in [docs/evaluation.md](docs/evaluation.md). Run `npm run eval` before changing the rubric. Trust and safety guidance is in [docs/trust-safety.md](docs/trust-safety.md).

## Project operations

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Support scope: [SUPPORT.md](SUPPORT.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- Release checklist: [docs/release.md](docs/release.md)
- Validation plan: [docs/validation-plan.md](docs/validation-plan.md)
- Evaluation corpus: [docs/evaluation.md](docs/evaluation.md)
- Trust and safety: [docs/trust-safety.md](docs/trust-safety.md)
