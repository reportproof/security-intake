# Public Advisory Trial

This trial checks whether `security-intake` behaves sensibly on report shapes
inspired by public security advisories from mature open-source ecosystems.

It does not copy upstream vulnerability reports, reproduce exploit details, scan
projects, or claim that any upstream project is vulnerable. Each case is a
synthetic or sanitized Markdown report designed to test first-pass intake
behavior.

## Source Set

Reviewed on 2026-06-05.

| Source | Why it is useful |
| --- | --- |
| [GitHub Security Lab advisories](https://securitylab.github.com/advisories/) | Coordinated disclosure writeups with affected components, exploit class, impact, and patch context. |
| [Rails security advisories](https://github.com/rails/rails/security/advisories) | GitHub Security Advisory style for a large framework with concise GHSA summaries. |
| [Next.js security releases](https://github.com/vercel/next.js/security/advisories) | Framework release advisories with affected versions and patched releases. |
| [Grafana security advisories](https://grafana.com/security/security-advisories/) | Product advisory catalog with CVE, severity, product, title, and update context. |
| [Kubernetes official CVE feed](https://kubernetes.io/docs/reference/issues-security/official-cve-feed/) | Infrastructure CVE feed that scanner tools may quote without cluster-specific validation. |
| [RustSec advisory database](https://github.com/rustsec/advisory-db) | Machine-readable dependency advisory workflow for Rust crates. |
| [curl security advisories](https://curl.se/docs/security.html) | Mature maintainer security archive and a useful shape for public-CVE-derived low-quality reports. |

## Trial Cases

| Case | Expected decision | Why |
| --- | --- | --- |
| `public-advisory-style-github-security-lab-workflow-injection-complete` | `ready_for_maintainer_review` | Complete coordinated-disclosure-style report with affected commit, component, repro, logs, environment, and impact. |
| `public-advisory-style-nextjs-release-middleware-bypass-complete` | `ready_for_maintainer_review` | Framework advisory-style report with concrete repro and sanitized proof. |
| `public-advisory-style-rails-ghsa-active-storage-missing-repro` | `needs_more_evidence` | Concise GHSA-style summary has affected area and impact but lacks incoming-report repro and proof. |
| `public-advisory-style-grafana-permission-missing-proof` | `needs_more_evidence` | Product advisory-style report has steps and impact but lacks proof, log, screenshot, trace, or failing test. |
| `public-advisory-style-kubernetes-cve-feed-scanner-dump` | `likely_low_quality_or_ai_generated` | Public CVE feed text is copied into a scanner template without tested version, component, target, or proof. |
| `public-advisory-style-rustsec-dependency-no-reachability` | `needs_more_evidence` | Dependency advisory match needs project-specific reachability and proof before maintainer triage. |
| `public-advisory-style-curl-ai-slop-connection-claim` | `likely_low_quality_or_ai_generated` | AI-generated public-CVE summary has no concrete target, testing, or evidence. |

## How To Run

```bash
npm run eval
npm run benchmark:results
npm run oss-trial:results
```

To inspect one case:

```bash
node dist/cli.js benchmarks/public-advisory-style/kubernetes-cve-feed-scanner-dump.md --no-fail
```

## What This Proves

- Public advisory structures are useful for shaping realistic fixtures.
- Complete reports should pass even when they are concise.
- Advisory summaries and dependency matches still need incoming-report evidence.
- Scanner and AI reports that quote public advisories should not skip
  project-specific validation.

## What This Does Not Prove

- It does not validate any real vulnerability.
- It does not measure upstream maintainer endorsement.
- It does not prove private security reports will classify perfectly.
- It does not replace feedback from maintainers and security triagers.

