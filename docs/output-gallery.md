# Output Gallery

These examples show the kind of output a maintainer should expect. They are
generated from synthetic reports in this repository and classify report quality
only. They do not prove that any project is vulnerable.

## Complete Report

Input:

```bash
node dist/cli.js examples/good-report.md --no-fail
```

Maintainer takeaway: send this to normal security triage. The report includes
affected version, component, reproduction steps, observed result, impact,
evidence, and tested environment.

```md
# Security Intake Result

Decision: ready_for_maintainer_review
Exit code: 0
Score: 100/100

## Present Evidence
- RP001_AFFECTED_VERSION: Affected version or commit (high)
- RP002_AFFECTED_COMPONENT: Affected component, endpoint, package, or file (high)
- RP003_REPRODUCTION_STEPS: Reproduction steps (high)
- RP004_OBSERVED_RESULT: Observed result (medium)
- RP005_SECURITY_IMPACT: Concrete security impact (high)
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence (high)
- RP007_TESTED_ENVIRONMENT: Tested environment (medium)

## Missing Evidence
- None

## Low-Quality Signals
- None

## Suggested Maintainer Response
Thanks for the report. It includes enough initial evidence for maintainer review. We will validate the claim and follow up through the security process.
```

## Salvageable Dependency Alert

Input:

```bash
node dist/cli.js benchmarks/expo-style/dependency-alert-no-reachability.md --no-fail
```

Maintainer takeaway: do not dismiss the reporter, but ask for reachability proof
and reproduction steps before spending deeper maintainer time.

```md
# Security Intake Result

Decision: needs_more_evidence
Exit code: 1
Score: 52/100

## Present Evidence
- RP001_AFFECTED_VERSION: Affected version or commit (high)
- RP002_AFFECTED_COMPONENT: Affected component, endpoint, package, or file (high)
- RP004_OBSERVED_RESULT: Observed result (medium)
- RP005_SECURITY_IMPACT: Concrete security impact (high)
- RP007_TESTED_ENVIRONMENT: Tested environment (medium)

## Missing Evidence
- RP003_REPRODUCTION_STEPS: Reproduction steps (high)
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence (high)

## Low-Quality Signals
- RP101_SPECULATIVE_IMPACT: Speculative impact language (medium)
- RP103_GENERIC_SCANNER_DUMP: Generic scanner or template language (medium)

## Suggested Maintainer Response
Thanks for the report. We cannot assess this as a vulnerability without the following evidence:
- RP003_REPRODUCTION_STEPS: Reproduction steps
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence

The report also contains low-confidence signals:
- RP101_SPECULATIVE_IMPACT: Speculative impact language
- RP103_GENERIC_SCANNER_DUMP: Generic scanner or template language

Please resubmit with concrete affected versions, reproduction steps, observed behavior, and security impact.
```

## Generic Scanner Dump

Input:

```bash
node dist/cli.js examples/scanner-dump.md --config .security-intake.yml --no-fail
```

Maintainer takeaway: route away from direct maintainer triage until the reporter
adds a concrete target, reproduction steps, and observable evidence.

```md
# Security Intake Result

Decision: likely_low_quality_or_ai_generated
Exit code: 2
Score: 2/100

## Present Evidence
- RP005_SECURITY_IMPACT: Concrete security impact (high)
- RP007_TESTED_ENVIRONMENT: Tested environment (medium)

## Missing Evidence
- RP001_AFFECTED_VERSION: Affected version or commit (high)
- RP002_AFFECTED_COMPONENT: Affected component, endpoint, package, or file (high)
- RP003_REPRODUCTION_STEPS: Reproduction steps (high)
- RP004_OBSERVED_RESULT: Observed result (medium)
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence (high)

## Low-Quality Signals
- RP101_SPECULATIVE_IMPACT: Speculative impact language (medium)
- RP103_GENERIC_SCANNER_DUMP: Generic scanner or template language (medium)
- RP104_NO_CONCRETE_TARGET: No concrete target is named (high)

## Suggested Maintainer Response
Thanks for the report. We cannot assess this as a vulnerability without the following evidence:
- RP001_AFFECTED_VERSION: Affected version or commit
- RP002_AFFECTED_COMPONENT: Affected component, endpoint, package, or file
- RP003_REPRODUCTION_STEPS: Reproduction steps
- RP004_OBSERVED_RESULT: Observed result
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence

The report also contains low-confidence signals:
- RP101_SPECULATIVE_IMPACT: Speculative impact language
- RP103_GENERIC_SCANNER_DUMP: Generic scanner or template language
- RP104_NO_CONCRETE_TARGET: No concrete target is named

Please resubmit with concrete affected versions, reproduction steps, observed behavior, and security impact.
```

## Vague AI-Style Claim

Input:

```bash
node dist/cli.js examples/ai-slop-report.md --no-fail
```

Maintainer takeaway: this should not consume direct maintainer triage time until
the reporter provides basic affected-version, component, reproduction, and
evidence details.

```md
# Security Intake Result

Decision: likely_low_quality_or_ai_generated
Exit code: 2
Score: 0/100

## Present Evidence
- RP005_SECURITY_IMPACT: Concrete security impact (high)

## Missing Evidence
- RP001_AFFECTED_VERSION: Affected version or commit (high)
- RP002_AFFECTED_COMPONENT: Affected component, endpoint, package, or file (high)
- RP003_REPRODUCTION_STEPS: Reproduction steps (high)
- RP004_OBSERVED_RESULT: Observed result (medium)
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence (high)
- RP007_TESTED_ENVIRONMENT: Tested environment (medium)

## Low-Quality Signals
- RP101_SPECULATIVE_IMPACT: Speculative impact language (medium)
- RP102_UNTESTED_CLAIM: Admits the finding was not tested (high)
- RP103_GENERIC_SCANNER_DUMP: Generic scanner or template language (medium)
- RP104_NO_CONCRETE_TARGET: No concrete target is named (high)
- RP105_AI_GENERATED_DISCLOSURE: Mentions AI-generated analysis (low)

## Suggested Maintainer Response
Thanks for the report. We cannot assess this as a vulnerability without the following evidence:
- RP001_AFFECTED_VERSION: Affected version or commit
- RP002_AFFECTED_COMPONENT: Affected component, endpoint, package, or file
- RP003_REPRODUCTION_STEPS: Reproduction steps
- RP004_OBSERVED_RESULT: Observed result
- RP006_PROOF_OR_EVIDENCE: Proof of concept or observable evidence
- RP007_TESTED_ENVIRONMENT: Tested environment

The report also contains low-confidence signals:
- RP101_SPECULATIVE_IMPACT: Speculative impact language
- RP102_UNTESTED_CLAIM: Admits the finding was not tested
- RP103_GENERIC_SCANNER_DUMP: Generic scanner or template language
- RP104_NO_CONCRETE_TARGET: No concrete target is named
- RP105_AI_GENERATED_DISCLOSURE: Mentions AI-generated analysis

Please resubmit with concrete affected versions, reproduction steps, observed behavior, and security impact.
```

## What To Look For

Useful output should:

- separate missing evidence from low-confidence signals,
- preserve legitimate concise reports for human review,
- ask for concrete next evidence instead of rejecting the reporter,
- avoid claiming whether the vulnerability is true,
- avoid exposing the original report body in GitHub Actions summaries.

If an example does not match your maintainer workflow, open the most specific
feedback issue from [public-feedback.md](public-feedback.md).
