# Public Validation Sprint

This sprint tests whether `security-intake` is useful enough to keep building
before adding hosted workflows, dashboards, AI triage, or commercial features.

Sprint window: 2026-06-05 to 2026-06-19.

## Positioning

`security-intake` is an open-source evidence checklist and response generator
for first-pass security report intake.

It is for:

- OSS maintainers who receive low-evidence vulnerability reports.
- Small security or engineering teams without managed triage.
- Projects using `SECURITY.md`, email intake, GitHub issues, or GitHub private
  vulnerability reporting.
- Teams that want consistent "please provide more evidence" responses.
- Projects receiving scanner, dependency CVE, or AI-generated report noise.

It is not for:

- Mature security teams already using HackerOne, Bugcrowd, or custom PSIRT
  workflows.
- Final vulnerability validation, severity assignment, bounty decisions, or CVE
  publication.
- Automatic report closure.
- Replacing human security review.
- Publicly testing or scanning upstream projects.

## Validation Question

The sprint is trying to answer one question:

> Would this output help maintainers respond faster to low-evidence security
> reports without creating friction for legitimate researchers?

## Current Evidence

- Local benchmark corpus: 36/36 expected classifications.
- Focused OSS-style trial: 26/26 expected classifications.
- Public advisory-style trial covers complete, salvageable, scanner-copy,
  dependency, and AI-summary report shapes.
- External GitHub Action playground has passed against ready, missing-evidence,
  and low-quality example reports.

These results prove deterministic behavior on the current corpus. They do not
prove real maintainer usefulness.

## Success Signals

Continue building if, by 2026-06-19, at least three of these are true:

- 5+ specific critiques from maintainers or security triagers.
- 2+ sanitized or synthetic report examples shared by people outside the project.
- 1+ external repository tries the CLI or GitHub Action.
- 1+ maintainer says the generated response would save triage time.
- 1+ person asks for workflow support such as GitHub advisory integration,
  SECURITY.md generation, routing, audit history, Slack/Jira/GitHub comments, or
  hosted intake.

## Stop Or Pivot Signals

Pause or pivot if most feedback looks like this:

- People like the idea but do not try it.
- Maintainers say the output is too bureaucratic or too noisy.
- The tool mostly catches cases that templates could catch more simply.
- Users ask for final vulnerability validation rather than evidence checking.
- Interest is only in SaaS dashboards before the local workflow proves value.

## Feedback Tracker

| Date | Channel | Link | Signal | Follow-up |
| --- | --- | --- | --- | --- |
| 2026-06-05 | GitHub issue | https://github.com/reportproof/security-intake/issues/3 | Baseline validation hub | Keep updated with sprint status |
| 2026-06-05 | GitHub repo | README, docs, benchmarks, playground | Public artifacts ready | Share narrow validation ask |

## Outreach Channels

Start narrow:

1. GitHub validation issue.
2. X or LinkedIn personal post.
3. Reddit only in relevant communities after the ask is clear.
4. Direct maintainer/security-practitioner asks when a relationship already
   exists.

Defer:

- Product Hunt.
- Broad "launch" posts.
- Paid ads.
- Enterprise security sales outreach.

## Public Post Draft

```text
I am validating security-intake, an open-source CLI/GitHub Action for first-pass
security report intake.

It does not decide whether a vulnerability is real. It checks whether a report
has enough evidence for maintainer review: affected version, component,
reproduction steps, observed result, impact, proof, and environment.

Current validation:
- 36/36 expected benchmark classifications
- 26/26 OSS-style trial classifications
- external GitHub Action playground passing

Looking for maintainers/security triagers to critique the rubric:
Would this output save triage time, or would it annoy legitimate researchers?

https://github.com/reportproof/security-intake/issues/3
```

## Reddit Draft

```text
I am validating an OSS tool for security report intake, not vulnerability
scanning.

The problem: maintainers are receiving more low-evidence vulnerability reports,
scanner dumps, dependency-CVE reports without reachability, and AI-generated
claims. The tool checks whether a report includes enough evidence before a human
triages it.

I am looking for critique from maintainers/security triagers:
- Is the evidence checklist reasonable?
- Is the suggested response fair?
- Would this reduce first-pass triage time?
- What would make it annoying or unsafe?

Repo / feedback issue:
https://github.com/reportproof/security-intake/issues/3
```

## Daily Sprint Routine

For each public feedback item:

1. Record the channel, link, and signal in this tracker.
2. Classify it as critique, sanitized report, workflow interest, integration
   interest, or non-signal.
3. Convert concrete failures into fixtures or documentation changes.
4. Avoid building hosted workflow features until there is repeated demand.

## Decision On 2026-06-19

Choose one:

- Continue OSS validation: maintainers tried it but want rubric/output changes.
- Build integration: people ask for GitHub advisory, issue-template, Action
  comments, or routing support.
- Keep as learning project: feedback is positive but not usage-oriented.
- Pivot: maintainers do not see value or the workflow is better solved by
  existing templates/platforms.

