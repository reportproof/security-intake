# OpenSSF Best Practices Readiness

This repository is preparing for the OpenSSF Best Practices passing badge.

Official program:

- OpenSSF project page: <https://openssf.org/projects/best-practices-badge/>
- Badge application: <https://www.bestpractices.dev/>
- Passing criteria: <https://www.bestpractices.dev/en/criteria/0>

The badge is a maintainer self-certification. A logged-in project maintainer
must create the project entry on `bestpractices.dev`, answer the criteria, and
then add the assigned badge URL to the README. This repository can prepare the
evidence, but it cannot earn the badge only through committed files.

## Current Status

- Badge project ID: not created yet.
- Target level: passing.
- Owner: project maintainer.
- Last readiness review: 2026-06-05.

## In-Repo Evidence

| Area | Current evidence |
| --- | --- |
| License | `LICENSE` uses MIT. |
| Public source | Repository is public on GitHub. |
| Contribution process | `CONTRIBUTING.md` documents useful contributions, rule changes, PR flow, and local checks. |
| Security policy | `SECURITY.md` documents private vulnerability reporting and public-safety boundaries. |
| Code of conduct | `CODE_OF_CONDUCT.md` exists. |
| Support scope | `SUPPORT.md` exists. |
| Automated tests | `npm test` runs TypeScript build plus Node tests. |
| CI | `.github/workflows/ci.yml` runs tests on pushes and pull requests. |
| Static analysis | `.github/workflows/codeql.yml` runs CodeQL. |
| Scorecard | `.github/workflows/scorecard.yml` runs OpenSSF Scorecard with pinned actions. |
| Branch protection | `main` requires pull requests, one approval, resolved conversations, and required checks for non-bypass users. |
| Dependency lockfile | `package-lock.json` is committed. |
| Release checklist | `docs/release.md` defines pre-release checks. |
| Trust and safety | `docs/trust-safety.md` explains tool boundaries and sensitive-report handling. |

## Known Gaps Before Applying

- Create the project on `bestpractices.dev` and record the assigned project ID.
- Complete the passing badge questionnaire.
- Add the generated badge to the README after the project ID exists.
- Keep using pull requests for routine changes so the repository can demonstrate
  code-review practice over time.
- Decide whether to add fuzzing around config/report parsing after the public
  validation sprint.

## Maintainer Application Steps

1. Sign in to <https://www.bestpractices.dev/>.
2. Create a project for `reportproof/security-intake`.
3. Use this readiness document as evidence while answering the passing criteria.
4. Record the assigned project ID in this file.
5. Add the generated badge markdown near the existing README badges.
6. Re-run OpenSSF Scorecard and confirm the `CIIBestPracticesID` alert changes
   state or score.

## What Not To Claim Yet

Do not claim the repository has earned an OpenSSF Best Practices badge until the
badge application shows a passing status. Until then, describe this document as
readiness tracking only.

