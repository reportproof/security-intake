# Benchmark Results

Generated from `fixtures/evaluation-cases.json` by `npm run benchmark:results`.

These results test report-quality classification only. They do not claim that any benchmarked project has a vulnerability, and they do not decide vulnerability truth.

## Summary

- Cases: 29
- Passed: 29
- Failed: 0

| Profile | Cases | Ready | Needs evidence | Low quality |
| --- | ---: | ---: | ---: | ---: |
| Core synthetic corpus | 10 | 3 | 4 | 3 |
| Expo-style | 5 | 1 | 3 | 1 |
| Flutter-style | 5 | 1 | 3 | 1 |
| Node.js-style | 5 | 2 | 2 | 1 |
| Kubernetes-style | 1 | 1 | 0 | 0 |
| pnpm-style | 1 | 0 | 1 | 0 |
| Homebrew-style | 1 | 1 | 0 | 0 |
| Rust-style | 1 | 0 | 0 | 1 |

## Cases

| Profile | Case | Expected | Actual | Score | Result | What this tests |
| --- | --- | --- | --- | ---: | --- | --- |
| Core synthetic corpus | [complete-web-session-fixation](../fixtures/reports/complete-web-session-fixation.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Good reports should not be blocked just because the project has not validated the vulnerability yet. |
| Core synthetic corpus | [short-but-actionable-report](../fixtures/reports/short-but-actionable-report.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | The rubric should not reward verbosity over actionable evidence. |
| Core synthetic corpus | [public-advisory-summary](../fixtures/reports/public-advisory-summary.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Advisory summaries can be high-quality even when they are not exploit walkthroughs. |
| Core synthetic corpus | [missing-reproduction-steps](../fixtures/reports/missing-reproduction-steps.md) | Needs more evidence | Needs more evidence | 82 | Pass | Maintainers should be able to ask for repro detail without labeling the report as junk. |
| Core synthetic corpus | [missing-impact](../fixtures/reports/missing-impact.md) | Needs more evidence | Needs more evidence | 82 | Pass | Reproduction alone should not make a report ready when the security impact is absent. |
| Core synthetic corpus | [dependency-alert-without-reachability](../fixtures/reports/dependency-alert-without-reachability.md) | Needs more evidence | Needs more evidence | 52 | Pass | Scanner findings should be salvageable when they need reachability evidence. |
| Core synthetic corpus | [environment-only-bug](../fixtures/reports/environment-only-bug.md) | Needs more evidence | Needs more evidence | 68 | Pass | Operational bugs should not be upgraded to security reports without impact evidence. |
| Core synthetic corpus | [scanner-dump-unreachable](../fixtures/reports/scanner-dump-unreachable.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | Unvalidated dumps should be routed away from maintainer triage. |
| Core synthetic corpus | [ai-generated-speculation](../fixtures/reports/ai-generated-speculation.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | AI-assisted submissions should meet the same evidence bar as human submissions. |
| Core synthetic corpus | [no-concrete-target](../fixtures/reports/no-concrete-target.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | Reports without a concrete target should not consume direct maintainer triage time. |
| Expo-style | [expo-style-complete-auth-session-redirect](../benchmarks/expo-style/complete-auth-session-redirect.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Mobile/devtool-style complete reports should reach maintainer triage. |
| Expo-style | [expo-style-config-secret-confusion](../benchmarks/expo-style/config-secret-confusion.md) | Needs more evidence | Needs more evidence | 82 | Pass | Bundled public config is not enough without concrete sensitive-data impact. |
| Expo-style | [expo-style-dependency-alert-no-reachability](../benchmarks/expo-style/dependency-alert-no-reachability.md) | Needs more evidence | Needs more evidence | 52 | Pass | Mobile dependency alerts need project-specific reachability evidence. |
| Expo-style | [expo-style-eas-build-log-leak-missing-proof](../benchmarks/expo-style/eas-build-log-leak-missing-proof.md) | Needs more evidence | Needs more evidence | 86 | Pass | Potentially sensitive build-log claims should ask for sanitized proof before triage. |
| Expo-style | [expo-style-vague-ai-mobile-claim](../benchmarks/expo-style/vague-ai-mobile-claim.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | AI-generated mobile claims should meet the same evidence bar. |
| Flutter-style | [flutter-style-complete-platform-channel-webview](../benchmarks/flutter-style/complete-platform-channel-webview.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Framework-style complete reports should reach maintainer triage. |
| Flutter-style | [flutter-style-dependency-cve-no-applicability](../benchmarks/flutter-style/dependency-cve-no-applicability.md) | Needs more evidence | Needs more evidence | 52 | Pass | SDK dependency alerts should not skip applicability and reachability evidence. |
| Flutter-style | [flutter-style-platform-specific-claim-missing-proof](../benchmarks/flutter-style/platform-specific-claim-missing-proof.md) | Needs more evidence | Needs more evidence | 86 | Pass | Platform-specific claims should require logs, tests, or other proof. |
| Flutter-style | [flutter-style-stable-channel-missing-version](../benchmarks/flutter-style/stable-channel-missing-version.md) | Needs more evidence | Needs more evidence | 84 | Pass | Large SDK projects need exact affected version/channel information. |
| Flutter-style | [flutter-style-vague-ai-framework-claim](../benchmarks/flutter-style/vague-ai-framework-claim.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | AI-generated framework claims should not reach direct triage without evidence. |
| Node.js-style | [nodejs-style-complete-http-parser-dos](../benchmarks/nodejs-style/complete-http-parser-dos.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Mature runtime-style complete reports should reach maintainer triage. |
| Node.js-style | [nodejs-style-missing-affected-version](../benchmarks/nodejs-style/missing-affected-version.md) | Needs more evidence | Needs more evidence | 84 | Pass | Runtime projects need exact affected version information before triage. |
| Node.js-style | [nodejs-style-scanner-dump-runtime](../benchmarks/nodejs-style/scanner-dump-runtime.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | Generic runtime scanner dumps should be routed away from maintainer triage. |
| Node.js-style | [nodejs-style-third-party-module-boundary](../benchmarks/nodejs-style/third-party-module-boundary.md) | Ready for maintainer review | Ready for maintainer review | 92 | Pass | The tool should qualify report evidence, not decide project-specific vulnerability policy. |
| Node.js-style | [nodejs-style-experimental-platform-missing-impact](../benchmarks/nodejs-style/experimental-platform-missing-impact.md) | Needs more evidence | Needs more evidence | 82 | Pass | Unsupported-platform bugs still need attacker capability or security impact evidence. |
| Kubernetes-style | [kubernetes-style-complete-admission-policy-bypass](../benchmarks/kubernetes-style/complete-admission-policy-bypass.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Infrastructure/control-plane reports with concrete repro, logs, and impact should reach maintainer triage. |
| pnpm-style | [pnpm-style-lockfile-tarball-integrity-missing-proof](../benchmarks/pnpm-style/lockfile-tarball-integrity-missing-proof.md) | Needs more evidence | Needs more evidence | 86 | Pass | Package-manager supply-chain claims should ask for proof before maintainer triage. |
| Homebrew-style | [homebrew-style-third-party-tap-boundary-complete](../benchmarks/homebrew-style/third-party-tap-boundary-complete.md) | Ready for maintainer review | Ready for maintainer review | 92 | Pass | The tool should preserve evidence-complete boundary reports for maintainers rather than deciding project scope itself. |
| Rust-style | [rust-style-vague-ai-toolchain-claim](../benchmarks/rust-style/vague-ai-toolchain-claim.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 0 | Pass | AI-generated language/toolchain claims should not reach direct triage without concrete evidence. |

## Safety Notes

- Benchmark profiles are synthetic style fixtures, not upstream project reports.
- Do not open upstream issues based on these fixtures.
- Use the results to critique `security-intake` decisions, not Expo, Flutter, Node.js, Kubernetes, pnpm, Homebrew, Rust, or their maintainers.
- `ready_for_maintainer_review` means evidence readiness, not vulnerability truth.

