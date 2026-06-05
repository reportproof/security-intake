# Repository Governance

This repository is public, security-adjacent, and still in validation. The
governance model should protect `main`, keep external contributions reviewable,
and avoid locking out a solo maintainer before there is a second trusted
maintainer.

## Current Main Branch Rules

The `main` branch is protected by both GitHub branch protection and the
`Protect main` repository ruleset.

Required today:

- Pull requests before merge for non-bypass users.
- One approving review.
- Stale review dismissal when new commits are pushed.
- All review conversations resolved before merge.
- Required status checks:
  - `test`
  - `Analyze JavaScript`
- Required status checks must be up to date with `main`.
- Force pushes are blocked.
- Branch deletion is blocked.

Allowed today:

- Repository administrators can bypass the ruleset.
- Merge, squash, and rebase merge methods are allowed.
- Code owner review is documented through `.github/CODEOWNERS`, but not enforced.
- Approval of the most recent push is not required.

## Why Admin Bypass Remains Enabled

This project is currently run by one maintainer. Removing admin bypass, requiring
code owner review, or requiring approval of the most recent push can create a
solo-maintainer lockout where routine release, documentation, or emergency
maintenance requires another trusted reviewer who does not exist yet.

The current rule is intentional: contributors get a normal protected-branch
workflow, while the maintainer can still recover the repository if automation,
required checks, or release wiring breaks.

## Direct-To-Main Policy

Routine changes should go through pull requests, even for the maintainer. This
keeps review history, required checks, and branch-protection behavior visible to
the public.

Administrator bypass is reserved for exceptional cases:

- required checks are broken because of workflow or GitHub platform failure,
- release or action metadata needs urgent repair,
- a security-sensitive public documentation mistake needs immediate correction,
- repository recovery is blocked by a rule configuration mistake.

When admin bypass is used, the follow-up commit or issue should explain why a
normal pull request could not be used.

## PR Expectations

Every meaningful pull request should explain:

- What changed.
- Whether rule behavior, output format, workflows, or documentation changed.
- Which local checks were run.
- Whether fixtures, benchmarks, or docs were updated when behavior changed.
- That no private vulnerability details, secrets, customer data, or active
  exploit material were added.

Behavior changes should include a sanitized fixture or benchmark case whenever
possible.

## Team Hardening Path

When there is at least one additional trusted maintainer, tighten the repository
in this order:

1. Require CODEOWNERS review.
2. Require approval of the most recent reviewable push.
3. Remove administrator bypass from the ruleset.
4. Increase required approvals from one to two for workflow, release, and action
   entrypoint changes.
5. Add path-specific required reviewers for `.github/workflows/`, `action.yml`,
   `dist/`, and release documentation.

Do not enable these before there is another active maintainer who can review and
recover blocked pull requests.

## Current Scorecard Tradeoffs

OpenSSF Scorecard may continue to report these governance and maturity warnings
while the project is a young solo-maintainer repository:

- `CodeReviewID`: improves only after pull requests have approved reviews from
  someone other than the author.
- `BranchProtectionID`: remains partial while administrator bypass, one-review
  approval, non-enforced CODEOWNERS, and non-required last-push approval are
  intentional solo-maintainer tradeoffs.
- `MaintainedID`: improves with repository age and sustained activity.
- `FuzzingID`: deferred until the parsing and configuration surface justifies a
  fuzzing harness.
- `CIIBestPracticesID`: tracked in
  [openssf-best-practices.md](openssf-best-practices.md).
