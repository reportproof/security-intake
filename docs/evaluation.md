# Evaluation Corpus

`security-intake` ships a public-safe synthetic validation corpus in `fixtures/`.
The corpus is not a benchmark for vulnerability truth. It checks whether the
report-quality rubric keeps behaving as intended across complete reports,
salvageable reports, scanner dumps, and speculative AI-style submissions.

Run it locally:

```bash
npm run eval
```

CI runs the same command on every push and pull request.

## Current cases

| Case | Expected decision | What it protects |
| --- | --- | --- |
| `complete-web-session-fixation` | `ready_for_maintainer_review` | Complete reports should reach human triage. |
| `short-but-actionable-report` | `ready_for_maintainer_review` | Short reports should pass when evidence is concrete. |
| `public-advisory-summary` | `ready_for_maintainer_review` | Advisory-style reports can be actionable. |
| `missing-reproduction-steps` | `needs_more_evidence` | Missing repro detail should ask for evidence without dismissing the report. |
| `missing-impact` | `needs_more_evidence` | Repro steps without impact are not enough for security triage. |
| `dependency-alert-without-reachability` | `needs_more_evidence` | Scanner alerts need project-specific reachability or proof. |
| `environment-only-bug` | `needs_more_evidence` | Operational bugs need security impact evidence before security triage. |
| `scanner-dump-unreachable` | `likely_low_quality_or_ai_generated` | Generic untested dumps should not consume maintainer triage time. |
| `ai-generated-speculation` | `likely_low_quality_or_ai_generated` | AI-assisted claims must meet the same evidence bar. |
| `no-concrete-target` | `likely_low_quality_or_ai_generated` | Reports without a concrete target should be routed away from triage. |

## Adding cases

Add a Markdown report under `fixtures/reports/` and register it in
`fixtures/evaluation-cases.json` with:

- `expectedDecision`
- any rule IDs expected in `present`, `missing`, or `lowQualitySignals`
- a short `protects` statement explaining the regression the case is meant to catch

Use synthetic or sanitized content only. Do not commit private vulnerability
details, exploit payloads against real systems, secrets, customer data, or active
zero-day material.
