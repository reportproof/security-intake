# Validation Plan

This project should earn trust through public artifacts before becoming a bigger product.

## 30-day success gate

- 20+ clones or local installs.
- 5+ specific critiques from maintainers or security practitioners.
- 3+ sanitized report examples shared by others.
- 1+ repository tries the CLI or GitHub Action.
- 1+ person asks for org workflow, routing, audit trail, hosted queue, or integration support.

## What counts as useful feedback

- A sanitized report that was misclassified.
- A missing field maintainers need before triage.
- A rule that should be stricter or more lenient.
- A workflow where the output could reduce maintainer time.
- A case where the tool would annoy legitimate researchers.

## What does not count

- Stars without usage.
- Likes without examples.
- Generic "cool project" comments.
- Interest in a SaaS dashboard before the local workflow proves value.

## Pre-public OSS trial gate

Do not start broad social distribution until the project passes this smaller
trial loop. The goal is to prove that the tool behavior is understandable before
asking strangers for feedback.

1. Keep the pinned validation issue open:
   [Feedback wanted: security-intake public validation](https://github.com/reportproof/security-intake/issues/3).
2. Keep the external Action playground green:
   [reportproof/security-intake-playground](https://github.com/reportproof/security-intake-playground).
3. Run the local validation path from the README on a fresh clone.
4. Run `npm run eval`, `npm run check:benchmark-results`, and
   `npm run check:oss-trial-results`.
5. Review [docs/benchmark-results.md](benchmark-results.md) and
   [docs/oss-trial-results.md](oss-trial-results.md), then confirm the
   result does not read like a claim about real upstream vulnerabilities.
6. Pick 3 to 5 mature OSS project shapes, such as mobile tooling, framework SDK,
   runtime, package manager, or developer infrastructure.
7. Create only synthetic or sanitized Markdown reports for those shapes.
8. Run `node dist/cli.js <report.md> --no-fail` on each report.
9. Record whether the output is:
   - correct enough to share publicly,
   - confusing but fixable with wording,
   - wrong enough to become a fixture or rule change.
10. Convert every useful failure into a fixture in `fixtures/` or `benchmarks/`.
11. Only then draft public posts for X, Reddit, Product Hunt, or Hacker News.

Safety rules:

- Do not scan upstream projects.
- Do not open upstream security issues.
- Do not use real exploit details, secrets, customer data, or active zero-day material.
- Do not say an upstream project is vulnerable because a synthetic report passed
  `ready_for_maintainer_review`.
- Treat this as report-quality validation, not vulnerability validation.

Minimum gate before broad posting:

- CI passes on `main`.
- CodeQL passes on `main`.
- Secret scanning has zero alerts.
- `docs/benchmark-results.md` is current.
- `docs/oss-trial-results.md` is current.
- The playground workflow passes using `reportproof/security-intake@main`.
- At least 3 new or reviewed OSS-shaped dry runs have an understood decision.
- Any confusing decision wording has either been fixed or documented as a known limitation.

## Next product steps

1. Improve fixture coverage.
2. Add snapshot tests for Markdown and JSON output.
3. Add an issue or private-report template generator.
4. Add advisory GitHub Action comments.
5. Only then consider hosted org workflow.
