# Contributing

ReportProof is validating a narrow workflow: checking whether security reports contain enough evidence before maintainer triage.

Useful contributions are specific and evidence-backed.

If you are evaluating whether this fits your maintainer workflow, start with
[docs/public-feedback.md](docs/public-feedback.md). Use the issue forms for
sanitized report examples, rule gaps, workflow feedback, and integration
requests.

## Good first contributions

- Add a sanitized fixture that exposes a false positive or false negative.
- Improve one rule and explain the maintainer workflow it supports.
- Improve output clarity without making the tool sound like it decides vulnerability truth.
- Add documentation that helps maintainers adopt the CLI or GitHub Action safely.

## Rule changes

Rule changes should include:

- The rule ID being changed.
- A sanitized example.
- Expected decision before and after.
- A test that captures the behavior.

Do not add LLM-based classification yet. The current project phase values transparent deterministic rules over opaque judgment.

## Pull request flow

`main` is protected by branch protection and the `Protect main` ruleset.
Contributor changes should go through pull requests with one approving review,
resolved review conversations, and green `test` and `Analyze JavaScript` checks.
Maintainer changes should also use pull requests by default; direct administrator
pushes are reserved for urgent repository recovery or security-sensitive public
documentation fixes.

Default ownership is documented in `.github/CODEOWNERS`. Code owner review is
not enforced yet because this is currently a solo-maintainer validation repo.
See [docs/repository-governance.md](docs/repository-governance.md) for the
current rules and the team hardening path.

## Local checks

```bash
npm test
npm run check:syntax
npm run check
npm run demo:bad
npm run pack:dry-run
```

CI also runs CodeQL on `main`, pull requests, and a weekly schedule.

## Security reports

Do not post private, exploitable vulnerability details in public issues. Use GitHub private vulnerability reporting when available.
