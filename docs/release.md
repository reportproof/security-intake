# Release Checklist

This repo is release-ready when the checks below pass.

The first release target is `v0.1.0`, distributed npm-first as a CLI and then as
a versioned GitHub Action. See
[distribution-strategy.md](distribution-strategy.md).

## Before tagging

- `npm test`
- `npm run eval`
- `npm run check:syntax`
- `npm run check`
- `npm run demo:bad`
- `npm run pack:dry-run`
- GitHub Actions CI passes on `main`.
- CodeQL completes or has an understood, documented setup issue.
- OpenSSF Scorecard completes or any remaining warnings are documented in
  `docs/repository-governance.md`.
- README quick start works from a fresh clone.
- `docs/rubric.md` matches the rule IDs in `src/rules.ts`.
- `docs/evaluation.md` matches `fixtures/evaluation-cases.json`.
- `docs/benchmarks.md` matches the public OSS style benchmark profiles under `benchmarks/`.
- `docs/benchmark-results.md` is current; verify with `npm run check:benchmark-results`.
- `docs/trust-safety.md` still reflects the actual runtime behavior.
- `docs/openssf-best-practices.md` reflects the current badge status.
- `npm run build` creates committed `dist/` runtime files for the CLI and GitHub Action.
- `action.yml` uses `runs.using: node24`; do not release Node 20-based Action metadata.
- `CHANGELOG.md` has an entry for the release.
- `docs/distribution-strategy.md` reflects the current npm, Action, and
  Marketplace plan.

## Before publishing to npm

- Confirm `@reportproof/security-intake` is controlled by this project.
- Configure npm trusted publishing for the release workflow.
- Use OIDC trusted publishing instead of a long-lived npm token.
- Verify the published package will include npm provenance.
- Run `npm run pack:dry-run` and inspect the included files.
- Install the generated tarball from a clean temporary directory, create a
  sample `report.md`, and run `npx security-intake report.md --no-fail`.
- Tag the release as `v0.1.0`.
- Confirm the GitHub Action works as `reportproof/security-intake@v0.1.0`.
- Add the npm quick start to the README only when the package is actually
  published.

## Versioning

Use `0.x` while the rule rubric and output schema are still changing.

- Patch: docs, examples, small rule wording changes.
- Minor: new rules, output fields, config keys, action outputs.
- Major: reserved for stable public API after validation.

## Publishing

Publishing to npm is the next distribution milestone once the `v0.1.0` publish
gate is satisfied. Do not publish to GitHub Marketplace or build a hosted
workflow until external usage shows that maintainers want those paths.
