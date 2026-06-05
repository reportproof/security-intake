# Public OSS Benchmark Suite

The benchmark suite uses synthetic reports modeled after public open-source
project shapes. It is meant to test report-quality behavior across realistic
ecosystems without scanning those projects, opening issues, or implying
endorsement.

Current benchmark profiles:

- `expo-style`: React Native/mobile tooling, build logs, public config, dependency noise, auth redirect flows.
- `flutter-style`: SDK/framework reports, platform-specific behavior, stable-channel/version expectations.
- `nodejs-style`: runtime reports, mature security-process boundaries, denial-of-service claims, generic scanner dumps.
- `kubernetes-style`: infrastructure/control-plane reports, admission policy evidence, and security response workflows.
- `pnpm-style`: package-manager supply-chain reports, supported versions, lockfile/integrity proof expectations.
- `homebrew-style`: package-manager trust boundaries, official metadata, third-party taps, and scanner-only claims.
- `rust-style`: language/toolchain reports, trusted source assumptions, security-response scope, and vague AI claims.
- `public-advisory-style`: synthetic cases modeled after public advisories from GitHub Security Lab, Rails, Next.js, Grafana, Kubernetes, RustSec, and curl.

These are style benchmarks only. They do not claim vulnerabilities in Expo,
Flutter, Node.js, Kubernetes, pnpm, Homebrew, Rust, or related projects.

## How to run

```bash
npm run eval
```

The public evaluation command runs the core synthetic corpus plus benchmark
cases registered in `fixtures/evaluation-cases.json`.

## Safety rules

- Do not open issues against upstream projects based on these fixtures.
- Do not use real exploit details, secrets, private reports, or active zero-day material.
- Do not describe the suite as endorsed by upstream projects.
- Use phrases like `Expo-style`, `Flutter-style`, `Node.js-style`, and
  `Kubernetes-style`.
- Treat `ready_for_maintainer_review` as evidence readiness, not vulnerability truth.

## Sources used for benchmark shape

- Expo security reporting routes tool vulnerabilities to Expo's vulnerability disclosure contact: <https://expo.dev/security>.
- Flutter security policy routes vulnerability reports through Google's vulnerability report channel and warns against public disclosure of sensitive reports: <https://github.com/flutter/flutter/security>.
- Node.js security policy documents HackerOne intake, validation expectations, and examples of project-specific policy boundaries: <https://github.com/nodejs/node/security/policy>.
- Kubernetes documents private vulnerability disclosure through the Security Response Committee and security@kubernetes.io: <https://kubernetes.io/docs/reference/issues-security/security/>.
- pnpm documents supported versions and GitHub private advisory intake: <https://github.com/pnpm/pnpm/security/policy>.
- Homebrew documents supported rolling-release boundaries, third-party tap scope, scanner-only report limits, and public-research conduct: <https://github.com/Homebrew/brew/security/policy>.
- Rust documents Security Response WG scope, toolchain assumptions, third-party crate boundaries, and disclosure handling: <https://www.rust-lang.org/policies/security>.

The public advisory trial is documented in
[docs/public-advisory-trial.md](public-advisory-trial.md). See
`docs/evaluation.md` for the case list and expected decisions. The current OSS
trial method is documented in `docs/oss-trial-runs.md`.
