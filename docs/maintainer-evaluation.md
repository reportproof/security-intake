# Maintainer Evaluation Guide

Use this guide to decide whether `security-intake` would make first-pass
security report triage faster for your project.

This evaluation should use sanitized or synthetic reports only. Do not paste
private vulnerability reports, secrets, customer data, active exploit payloads,
or unpatched sensitive details into public issues, public repositories, or
public Actions logs.

## What To Validate

The tool is useful only if the output helps a maintainer answer three questions
faster:

- Is the report ready for a human to triage?
- If not, what exact evidence is missing?
- Is the suggested response safe and fair to send back to the reporter?

It does not validate exploitability, decide vulnerability truth, or replace a
project security policy.

## 30-Minute Local Trial

Start with the known examples:

```bash
git clone https://github.com/reportproof/security-intake.git
cd security-intake
npm install
npm run eval
node dist/cli.js examples/good-report.md
node dist/cli.js examples/ai-slop-report.md --no-fail
node dist/cli.js examples/scanner-dump.md --config .security-intake.yml --no-fail
```

Then run three sanitized reports from your own workflow:

1. One report that was clearly ready for maintainer triage.
2. One report that had a plausible issue but missed key evidence.
3. One report that looked like a scanner dump, template, or untested claim.

Run each report in report-only mode:

```bash
mkdir -p /tmp/security-intake-results
node dist/cli.js /path/to/sanitized-report.md \
  --output /tmp/security-intake-results/sanitized-report-result.md \
  --no-fail
```

## How To Judge The Output

Use this scorecard for each report:

| Question | Good sign | Problem sign |
| --- | --- | --- |
| Decision | Matches how a maintainer would route the report. | Blocks a report that should reach triage, or passes obvious noise. |
| Missing evidence | Names concrete evidence the reporter can add. | Asks for irrelevant or impossible evidence. |
| Low-quality signals | Explains why scanner or vague claims are low confidence. | Labels a normal researcher report as low quality for weak reasons. |
| Suggested response | Is safe, neutral, and usable with light editing. | Sounds accusatory, decides vulnerability truth, or leaks sensitive context. |
| Workflow fit | Saves a maintainer step. | Adds a new review burden without changing triage quality. |

The most important failure modes are false negatives for incomplete reports and
false positives against legitimate but concise researcher reports.

## Decision Guide

| Decision | What a maintainer should do |
| --- | --- |
| `ready_for_maintainer_review` | Read the report and validate the claim through your normal security process. |
| `needs_more_evidence` | Ask for the missing evidence before spending deeper maintainer time. |
| `likely_low_quality_or_ai_generated` | Route away from direct maintainer triage unless the reporter adds concrete evidence. |

Do not auto-close reports based only on this decision. Use it as pre-triage
support until your project understands its own false-positive and false-negative
patterns.

## Feedback To Record

For every useful mismatch, capture:

- report shape, with sensitive details removed,
- command or Action setup,
- actual decision,
- expected decision,
- rule IDs that were wrong or confusing,
- the maintainer action you would have taken,
- whether the suggested response would be safe to send.

Open the most specific issue form from [public-feedback.md](public-feedback.md).
If you cannot share even a sanitized example, describe the rule gap and workflow
impact without including private details.

## Pass Gate Before Adoption

Treat the tool as worth further evaluation only if:

- at least two of the three workflow reports route correctly,
- no suggested response creates a safety or trust problem,
- missing-evidence output is specific enough to send back to a reporter,
- the result would save a maintainer at least one back-and-forth or triage step.

If the trial fails, the best next contribution is a sanitized fixture or
benchmark case that captures the wrong behavior.
