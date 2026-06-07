# Distribution Strategy

This project should use npm as the first serious distribution channel.

The product shape is a CLI first, GitHub Action second:

1. CLI for local, script, and CI usage.
2. GitHub Action for repository workflow usage.
3. GitHub Marketplace only after external Action usage.
4. Hosted workflow only after repeated requests for team routing, audit trail,
   comments, or integrations.

## Why npm First

`security-intake` is a developer tool with immediate local output. npm fits
because maintainers can try it without creating an account, installing a hosted
service, or wiring a private disclosure workflow.

The intended post-release trial path is:

```bash
npx @reportproof/security-intake@latest report.md --no-fail
```

For repeat use:

```bash
npm install --save-dev @reportproof/security-intake
npx security-intake report.md --no-fail
```

This is lower-friction than asking maintainers to install a GitHub Action first.
The Action remains important for teams that want repeatable CI behavior, but npm
is the best first adoption surface.

## Current Status

- npm package name: `@reportproof/security-intake`
- npm publication status: not published yet.
- Target first release: `v0.1.0`.
- Runtime target: Node.js 24 or newer.
- Publishing method target: npm trusted publishing from GitHub Actions.

Node.js 24 is a deliberate trust and maintenance tradeoff because the GitHub
Action runtime is Node 24. If npm users report that Node 24 blocks adoption,
revisit the CLI engine range separately from the Action runtime.

## v0.1.0 Publish Gate

Do not publish until all of these are true:

- `npm view @reportproof/security-intake version` returns not found or shows an
  intentionally managed package owned by this project.
- npm organization/scope ownership is understood.
- npm trusted publishing is configured for the release workflow.
- Release workflow uses short-lived OIDC publishing, not a long-lived npm token.
- Published package will include provenance attestations through npm trusted
  publishing.
- `npm run pack:dry-run` includes only expected files.
- A tarball install smoke test passes from a clean temporary directory.
- README has a clearly marked npm quick start.
- `CHANGELOG.md` has a `v0.1.0` entry.
- GitHub release notes explain that this is an early validation release.
- The Action remains usable by tag, for example
  `reportproof/security-intake@v0.1.0`.

## npm Trusted Publishing Notes

npm trusted publishing uses OIDC to create a trust relationship between npm and
the CI provider. When publishing from GitHub Actions through trusted publishing,
npm automatically publishes provenance attestations for the package.

References:

- <https://docs.npmjs.com/trusted-publishers>
- <https://docs.npmjs.com/generating-provenance-statements>
- <https://docs.npmjs.com/viewing-package-provenance>

## What npm Success Means

Treat npm downloads as weak signal. The useful signal is not raw popularity; it
is whether maintainers use the CLI against real or sanitized report shapes and
give specific feedback.

Useful npm-channel signals:

- A maintainer runs the CLI with `npx` and comments on the output.
- A project adds the CLI to a script or CI job.
- Someone reports install/runtime friction.
- Someone asks for config, output, or workflow improvements after trying it.
- Someone compares CLI usage with the GitHub Action path.

Non-signals:

- npm downloads without feedback.
- Stars without usage.
- Generic "cool package" comments.
- Interest in a hosted dashboard before CLI/Action usage is proven.

## Marketplace Deferral

Do not publish to GitHub Marketplace yet.

Marketplace should wait until:

- at least one external repository tries the Action,
- `v0.1.0` exists,
- the Action is tested from a fresh external repo using the version tag,
- README and `action.yml` metadata are polished for Action users,
- feedback indicates maintainers want the Action path, not only the CLI.

## Commercial Path

The current commercial hypothesis is:

```text
npm CLI adoption -> GitHub Action usage -> maintainer workflow feedback ->
integration requests -> hosted/team workflow
```

Do not skip straight to hosted workflow. The next risk is demand and workflow
fit, not infrastructure.

