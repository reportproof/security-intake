# Release Checklist

This repo is release-ready when the checks below pass.

## Before tagging

- `npm test`
- `npm run check:syntax`
- `npm run check`
- `npm run demo:bad`
- `npm run pack:dry-run`
- GitHub Actions CI passes on `main`.
- CodeQL completes or has an understood, documented setup issue.
- README quick start works from a fresh clone.
- `docs/rubric.md` matches the rule IDs in `src/rules.js`.
- `CHANGELOG.md` has an entry for the release.

## Versioning

Use `0.x` while the rule rubric and output schema are still changing.

- Patch: docs, examples, small rule wording changes.
- Minor: new rules, output fields, config keys, action outputs.
- Major: reserved for stable public API after validation.

## Publishing

Do not publish to npm or create a GitHub Marketplace release until at least one outside user has tried the CLI or Action and the project has public feedback issues to guide the next release.
