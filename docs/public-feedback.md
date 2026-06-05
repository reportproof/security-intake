# Public Feedback Guide

`security-intake` is looking for narrow, practical feedback from maintainers
and security triagers.

The question is not "is this a complete security platform?" The question is:

> Would this output make first-pass security report triage faster without
> annoying legitimate reporters?

## 10-minute evaluation

Run the local path first:

```bash
git clone https://github.com/reportproof/security-intake.git
cd security-intake
npm install
npm run eval
node dist/cli.js examples/good-report.md
node dist/cli.js examples/ai-slop-report.md --no-fail
```

Then inspect:

- [OSS triage trial results](oss-trial-results.md)
- [Benchmark results](benchmark-results.md)
- [Rule rubric](rubric.md)
- [External GitHub Action playground](https://github.com/reportproof/security-intake-playground)

## What to judge

Good feedback usually answers one of these:

- Would the decision help route a report faster?
- Is the suggested maintainer response clear, fair, and safe?
- Is a rule too strict or too lenient for your project?
- Is an evidence field missing from the rubric?
- Would this create friction for legitimate security researchers?
- Would you run this as a CLI, GitHub Action, template check, or hosted workflow?

## Where to send feedback

Use the most specific path:

| Feedback type | Use |
| --- | --- |
| A sanitized report classified incorrectly | [Sanitized report example](https://github.com/reportproof/security-intake/issues/new?template=sanitized-report.yml) |
| A wrong, missing, strict, or lenient rule | [Rule gap](https://github.com/reportproof/security-intake/issues/new?template=rule-gap.yml) |
| Workflow fit, adoption blockers, or triage concerns | [Workflow feedback](https://github.com/reportproof/security-intake/issues/new?template=workflow-feedback.yml) |
| Real integration interest or hosted/API needs | [Integration request](https://github.com/reportproof/security-intake/issues/new?template=integration-request.yml) |
| General validation discussion | [Pinned validation issue](https://github.com/reportproof/security-intake/issues/3) |

## Safety rules

Do not post:

- private vulnerability reports,
- exploitable unpatched details,
- secrets, tokens, credentials, or customer data,
- live targets,
- real exploit payloads that could harm a project.

Synthetic examples are preferred. Redacted examples are fine when they preserve
the report shape without exposing sensitive details.

## Useful feedback format

For report-quality feedback, include:

- your role or workflow context,
- the sanitized report shape,
- the command or Action setup used,
- the actual decision,
- the expected decision,
- the rule IDs or output that were confusing,
- why a maintainer would handle it differently.

For workflow feedback, include:

- how reports arrive today,
- who does first-pass triage,
- where time is wasted,
- what output would be actionable,
- what output would be unsafe or annoying,
- whether you would try CLI, GitHub Action, or another integration.

## Outreach draft

Use this when asking for critique:

```text
I am validating security-intake, an open-source CLI/GitHub Action that checks
whether security reports include enough evidence before maintainers triage them.

It does not decide vulnerability truth. It flags missing affected versions,
reproduction steps, proof/evidence, impact, and low-confidence scanner or
AI-style claims.

Current focused OSS-style trial: 19/19 expected classifications across synthetic
Expo, Flutter, Node.js, Kubernetes, pnpm, Homebrew, and Rust-style report
shapes.

Looking for maintainers/security triagers to critique the rubric:
https://github.com/reportproof/security-intake/blob/main/docs/public-feedback.md
```

## What happens next

Specific feedback becomes one of:

- a new fixture or benchmark case,
- a rule or scoring change,
- clearer output wording,
- documentation of a known limitation,
- an integration request for future product direction.
