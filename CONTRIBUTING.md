# Contributing

ReportProof is validating a narrow workflow: checking whether security reports contain enough evidence before maintainer triage.

Useful contributions are specific and evidence-backed.

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
