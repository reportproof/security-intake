# pnpm-Style Synthetic Report: Lockfile Tarball Integrity Missing Proof

Synthetic benchmark only. This is not a pnpm vulnerability report.

Affected version: pnpm-style package manager release 11.2.0.

Affected component: package fetcher module `packages/fetcher/src/tarball.ts`.

Environment: Node 24 on Ubuntu 24.04, private registry mirror, project with `pnpm-lock.yaml`.

Steps to reproduce:

1. Run `pnpm install --frozen-lockfile` in a project that resolves a package through a private registry mirror.
2. Compare the lockfile integrity value with the tarball metadata returned by the mirror.
3. The reporter says the install may continue after an integrity mismatch.

Observed result: the reporter says the command printed a normal install summary.

Security impact: if confirmed, an attacker controlling a mirror could provide package contents that differ from the lockfile.

I cannot provide proof, logs, trace output, failing test, packet capture, or the registry fixture because the mirror is no longer available.
