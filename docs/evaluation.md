# Evaluation Corpus

`security-intake` ships a public-safe synthetic validation corpus in `fixtures/`
and public OSS style benchmarks in `benchmarks/`. The corpus is not a benchmark
for vulnerability truth. It checks whether the report-quality rubric keeps
behaving as intended across complete reports, salvageable reports, scanner
dumps, speculative AI-style submissions, and ecosystem-shaped report examples.

Run it locally:

```bash
npm run eval
```

CI runs the same command on every push and pull request.

## Core cases

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

## Public OSS style benchmark cases

| Profile | Cases | Purpose |
| --- | ---: | --- |
| `expo-style` | 5 | Mobile/devtool reports around auth redirects, public config, dependency noise, build logs, and vague AI claims. |
| `flutter-style` | 5 | SDK/framework reports around platform channels, stable-channel versioning, dependency applicability, platform proof, and vague AI claims. |
| `nodejs-style` | 5 | Runtime reports around denial-of-service, affected versions, scanner dumps, and project-policy boundaries. |
| `kubernetes-style` | 1 | Infrastructure/control-plane report with complete admission policy evidence. |
| `pnpm-style` | 1 | Package-manager supply-chain report that needs proof before triage. |
| `homebrew-style` | 1 | Evidence-complete package-manager boundary report where maintainers decide final scope. |
| `rust-style` | 1 | Vague AI-generated language/toolchain claim with no concrete evidence. |

The benchmark cases are synthetic and not endorsed by Expo, Flutter, Node.js,
Kubernetes, pnpm, Homebrew, Rust, or their maintainers. They are style
benchmarks for report-quality behavior only. See [docs/benchmarks.md](benchmarks.md)
and [docs/oss-trial-runs.md](oss-trial-runs.md).

## Adding cases

Add a Markdown report under `fixtures/reports/` or a benchmark profile under
`benchmarks/`, then register it in `fixtures/evaluation-cases.json` with:

- `expectedDecision`
- any rule IDs expected in `present`, `missing`, or `lowQualitySignals`
- a short `protects` statement explaining the regression the case is meant to catch

Use synthetic or sanitized content only. Do not commit private vulnerability
details, exploit payloads against real systems, secrets, customer data, or active
zero-day material.
