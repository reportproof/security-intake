# Rule Rubric

`security-intake` uses deterministic rules. The project should stay explainable while it validates the workflow.

## Required evidence rules

| Rule | Evidence | Why it matters |
| --- | --- | --- |
| `RP001_AFFECTED_VERSION` | Affected version, release, tag, commit, or SHA | Maintainers need a concrete target before they can reproduce or scope a report. |
| `RP002_AFFECTED_COMPONENT` | Component, endpoint, route, package, file, or module | A report should name the affected area. |
| `RP003_REPRODUCTION_STEPS` | Steps, command, request, curl, or repro text | A maintainer should not have to reverse-engineer the exploit path. |
| `RP004_OBSERVED_RESULT` | Observed result, actual result, response, error, or log | Reports should describe what happened, not only what might happen. |
| `RP005_SECURITY_IMPACT` | Attacker capability, exploit path, privilege, access, data, or account impact | Impact should be specific enough to prioritize. |
| `RP006_PROOF_OR_EVIDENCE` | PoC, proof, screenshot, log, trace, payload, or failing test | Evidence makes the claim independently checkable. |
| `RP007_TESTED_ENVIRONMENT` | Environment, OS, browser, runtime, dependency, or Docker details | Environment narrows project bugs versus setup issues. |

## Low-quality signal rules

| Rule | Signal | Why it matters |
| --- | --- | --- |
| `RP101_SPECULATIVE_IMPACT` | May, might, could, possibly, potentially, or likely around security impact | Speculation should be paired with concrete evidence. |
| `RP102_UNTESTED_CLAIM` | Not tested, did not test, unable to verify, theoretically, looks like | Untested claims push validation cost to maintainers. |
| `RP103_GENERIC_SCANNER_DUMP` | Scanner, automated tool, template, generic, best practice | Scanner output needs project-specific reachability and proof. |
| `RP104_NO_CONCRETE_TARGET` | Your application, your software, the system, the project | Reports need a concrete target. |
| `RP105_AI_GENERATED_DISCLOSURE` | AI, LLM, ChatGPT, language model, generated analysis | AI assistance is not disqualifying, but evidence standards still apply. |

## Decision logic

Default thresholds:

- `ready_for_maintainer_review`: no high-severity required evidence is missing, score is at least `70`, and no more than `2` required evidence rules are missing.
- `needs_more_evidence`: any high-severity required evidence is missing, score is below `70`, or more than `2` required evidence rules are missing.
- `likely_low_quality_or_ai_generated`: at least `3` low-quality signals and at least `3` required evidence gaps.

These defaults are intentionally conservative. Projects can tune them with `.security-intake.yml`.
