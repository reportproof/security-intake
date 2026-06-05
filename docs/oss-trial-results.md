# OSS Triage Trial Results

Generated from `fixtures/evaluation-cases.json` by `npm run oss-trial:results`.

This is the focused pre-outreach trial set for real-world-style maintainer workflows. The cases are synthetic `*-style` fixtures, not copied upstream reports, and they test report-quality classification only.

## Summary

- Cases: 26
- Passed: 26
- Failed: 0
- Ready for maintainer review: 8
- Needs more evidence: 12
- Likely low quality / AI-generated: 6

## What This Tests

- Evidence-complete reports should reach a human maintainer instead of being blocked by automation.
- Salvageable reports should get a specific evidence request instead of being dismissed as junk.
- Generic scanner dumps and untested AI-style claims should be routed away from direct maintainer triage.
- Policy-boundary cases should remain evidence decisions; the tool should not decide final project scope or vulnerability truth.

## Profile Summary

| Profile | Cases | Ready | Needs evidence | Low quality |
| --- | ---: | ---: | ---: | ---: |
| Expo-style | 5 | 1 | 3 | 1 |
| Flutter-style | 5 | 1 | 3 | 1 |
| Node.js-style | 5 | 2 | 2 | 1 |
| Kubernetes-style | 1 | 1 | 0 | 0 |
| pnpm-style | 1 | 0 | 1 | 0 |
| Homebrew-style | 1 | 1 | 0 | 0 |
| Rust-style | 1 | 0 | 0 | 1 |
| Public advisory-style | 7 | 2 | 3 | 2 |

## Cases

| Profile | Case | Manual expectation | Actual | Score | Result | Triage value |
| --- | --- | --- | --- | ---: | --- | --- |
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
| Public advisory-style | [public-advisory-style-github-security-lab-workflow-injection-complete](../benchmarks/public-advisory-style/github-security-lab-workflow-injection-complete.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Coordinated-disclosure-style reports with concrete version, component, repro, logs, and impact should reach maintainer triage. |
| Public advisory-style | [public-advisory-style-nextjs-release-middleware-bypass-complete](../benchmarks/public-advisory-style/nextjs-release-middleware-bypass-complete.md) | Ready for maintainer review | Ready for maintainer review | 100 | Pass | Framework security-release-shaped reports should pass when they include a concrete repro and sanitized proof. |
| Public advisory-style | [public-advisory-style-rails-ghsa-active-storage-missing-repro](../benchmarks/public-advisory-style/rails-ghsa-active-storage-missing-repro.md) | Needs more evidence | Needs more evidence | 68 | Pass | Concise public advisory summaries should not be treated as intake-ready when an incoming report lacks repro and proof. |
| Public advisory-style | [public-advisory-style-grafana-permission-missing-proof](../benchmarks/public-advisory-style/grafana-advisory-permission-missing-proof.md) | Needs more evidence | Needs more evidence | 86 | Pass | Product advisory-shaped reports should ask for sanitized proof when steps and impact are present but evidence is absent. |
| Public advisory-style | [public-advisory-style-kubernetes-cve-feed-scanner-dump](../benchmarks/public-advisory-style/kubernetes-cve-feed-scanner-dump.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 22 | Pass | Copy-pasted public CVE feed matches should be routed away from direct triage without project-specific evidence. |
| Public advisory-style | [public-advisory-style-rustsec-dependency-no-reachability](../benchmarks/public-advisory-style/rustsec-dependency-no-reachability.md) | Needs more evidence | Needs more evidence | 52 | Pass | Dependency advisory matches should ask for project-specific reachability evidence before maintainer triage. |
| Public advisory-style | [public-advisory-style-curl-ai-slop-connection-claim](../benchmarks/public-advisory-style/curl-ai-slop-connection-claim.md) | Likely low quality / AI-generated | Likely low quality / AI-generated | 28 | Pass | AI-generated reports derived from public CVE summaries should not reach direct triage without a concrete tested target. |

## How To Reproduce

```bash
npm run oss-trial:results
npm run check:oss-trial-results
node dist/cli.js benchmarks/expo-style/vague-ai-mobile-claim.md --no-fail
node dist/cli.js benchmarks/nodejs-style/complete-http-parser-dos.md --no-fail
```

## What This Does Not Prove

- It does not prove any upstream project is vulnerable.
- It does not validate exploitability or patch correctness.
- It does not replace maintainer judgment, security policy, or project scope decisions.
- It does not prove private reports will classify perfectly; real maintainer feedback is still required.

