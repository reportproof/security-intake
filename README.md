# security-intake

Open-source security report intake checks for maintainers.

`security-intake` is a small CLI that reviews incoming vulnerability reports, scanner dumps, and AI-generated security submissions before a maintainer spends time on them. It does not decide whether a vulnerability is real. It checks whether the report has enough evidence to be worth human triage.

## Why

Maintainers are increasingly receiving low-quality or AI-generated security reports that look plausible but lack affected versions, reproduction steps, proof of impact, or enough detail to verify. The first goal is to make incomplete reports cheap to identify and respond to.

## Quick start

```bash
npm install
npm run check
```

Run against any Markdown report:

```bash
node src/cli.js examples/ai-slop-report.md
node src/cli.js examples/good-report.md --json
```

## Example output

```md
# Security Intake Result

Decision: needs_more_evidence
Score: 35/100

## Missing Evidence
- Affected version or commit
- Reproduction steps
- Concrete impact
- Proof of concept or observable evidence

## Suggested Maintainer Response
Thanks for the report. We cannot assess this as a vulnerability without...
```

## Current scope

- Deterministic report-quality checks.
- Missing-evidence detection.
- Speculative-language detection.
- Maintainer-readable Markdown output.
- JSON output for future GitHub Action integration.

## Not in scope yet

- Final vulnerability adjudication.
- Exploit generation.
- Automatic issue closing.
- Hosted SaaS workflow.
- Bug bounty marketplace replacement.

## Project status

This is an early validation repo. The near-term goal is to test whether maintainers find a simple report-quality gate useful before building heavier automation.
