# Current OSS Trial Runs

This document records the safe trial method for testing `security-intake`
against current open-source project shapes.

The goal is not to scan upstream repositories or find vulnerabilities. The goal
is to check whether `security-intake` handles report-quality patterns that match
real maintainer workflows.

## Trial method

1. Read only public process documentation such as `SECURITY.md`, vulnerability
   reporting pages, support boundaries, and public security process docs.
2. Create synthetic Markdown reports that mirror the workflow shape without
   copying private report details or claiming any upstream vulnerability.
3. Run each synthetic report through the local CLI:

   ```bash
   node dist/cli.js benchmarks/<profile>/<report>.md --no-fail
   ```

4. Record whether the decision is understandable:
   - `ready_for_maintainer_review` when the report has concrete evidence,
   - `needs_more_evidence` when a salvageable report is missing proof or scope,
   - `likely_low_quality_or_ai_generated` when a report is vague, untested, or
     generic enough to waste maintainer triage time.
5. Add stable cases to `fixtures/evaluation-cases.json` so CI catches regressions.
6. Regenerate the focused OSS-style result table:

   ```bash
   npm run oss-trial:results
   npm run check:oss-trial-results
   ```

7. For GitHub Action validation, use the external playground:
   <https://github.com/reportproof/security-intake-playground>.
   The playground runs `reportproof/security-intake@main` from a separate public
   repository and asserts expected decisions for sanitized sample reports.

The current focused result artifact is
[docs/oss-trial-results.md](oss-trial-results.md). It isolates the OSS-style
benchmark cases from the broader synthetic corpus so reviewers can inspect the
pre-outreach trial without reading every fixture.

## Trial profiles

| Profile | Public source shape | Trial case | Expected decision | Why it matters |
| --- | --- | --- | --- | --- |
| `expo-style` | Mobile app tooling, auth sessions, build logs, public config, and dependency alerts. | Complete, missing proof, scanner, and vague AI report shapes. | Mixed | Mobile/devtool maintainers need to separate actionable reports from dependency noise and public-config misunderstandings. |
| `flutter-style` | Framework SDK, platform channels, stable channel versions, and dependency applicability. | Complete, missing version/proof, scanner, and vague AI report shapes. | Mixed | Framework maintainers need exact channel/version and platform evidence before spending triage time. |
| `nodejs-style` | Runtime surface, third-party module boundaries, unsupported platforms, and scanner dumps. | Complete, missing version/impact, scanner, and policy-boundary report shapes. | Mixed | Runtime maintainers need evidence routing without the tool deciding final security scope. |
| `kubernetes-style` | Private security disclosure, security response process, control-plane complexity. | Complete admission policy bypass report. | `ready_for_maintainer_review` | Infrastructure reports with concrete affected version, component, repro, logs, and impact should reach maintainer triage. |
| `pnpm-style` | Supported versions and GitHub private advisory intake for a package manager. | Lockfile tarball integrity report missing proof. | `needs_more_evidence` | Supply-chain claims need project-specific proof before security triage. |
| `homebrew-style` | Explicit security boundary around Homebrew-maintained code, official metadata, taps, scanners, and user-controlled inputs. | Evidence-complete third-party tap boundary report. | `ready_for_maintainer_review` | The tool should qualify report evidence, not decide final project policy scope. |
| `rust-style` | Central security response policy, toolchain scope, trusted source/dependency assumptions, and explicit out-of-scope areas. | Vague AI-generated toolchain claim. | `likely_low_quality_or_ai_generated` | Language/toolchain maintainers should not receive direct triage work from untested AI claims with no concrete target. |

## Sources Used

- Kubernetes security and disclosure information: <https://kubernetes.io/docs/reference/issues-security/security/>
- Kubernetes Security Response Committee docs: <https://github.com/kubernetes/committee-security-response>
- pnpm security policy: <https://github.com/pnpm/pnpm/security/policy>
- Homebrew security policy: <https://github.com/Homebrew/brew/security/policy>
- Rust security policy: <https://www.rust-lang.org/policies/security>

## Safety Rules

- Do not scan upstream code.
- Do not open upstream security advisories or public issues from these fixtures.
- Do not imply that Kubernetes, pnpm, Homebrew, Rust, or related projects have
  vulnerabilities because a synthetic report passed `ready_for_maintainer_review`.
- Do not include real exploit details, secrets, private reports, customer data,
  or active zero-day material.
- Keep profile names as `*-style` to make clear that the cases are workflow
  simulations, not upstream reports.
