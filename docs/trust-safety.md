# Trust and Safety

`security-intake` is designed as a pre-triage report-quality check for open
source maintainers. It does not decide whether a vulnerability is real.

## What the tool does

- Reads a local Markdown report.
- Checks for evidence fields maintainers usually need before triage.
- Flags generic scanner dumps, untested claims, and speculative language.
- Writes Markdown or JSON output that a maintainer can review.
- In GitHub Actions, writes a short job summary with the decision, score, and rule IDs.

## What the tool does not do

- It does not upload report content.
- It does not make network calls.
- It does not run exploit code.
- It does not generate exploit steps.
- It does not close issues or reject reports by itself.
- It does not claim that a report is true, false, malicious, or AI-written.

## Recommended public use

For early adopters, run with `fail-on-low-quality: "false"` in GitHub Actions.
Use the output as a maintainer-facing triage aid first. After you understand the
false-positive and false-negative patterns for your project, you can decide
whether to fail a CI step.

Do not use this tool to auto-close private vulnerability reports. A low-quality
decision means the report lacks enough evidence for efficient triage; it does not
prove bad intent.

## Handling sensitive reports

- Keep private vulnerability details in the private disclosure channel where they arrived.
- Ask reporters to sanitize examples before posting public feedback issues.
- Do not paste secrets, customer data, real tokens, or active exploit details into public fixtures.
- If a rule causes a bad outcome, file a sanitized reproduction with the rule ID.

## Feedback standard

Useful feedback includes:

- a sanitized report that receives the wrong decision,
- a rule ID that is too strict or too lenient,
- a missing evidence field your project requires,
- a workflow where the output would create friction for legitimate researchers.
