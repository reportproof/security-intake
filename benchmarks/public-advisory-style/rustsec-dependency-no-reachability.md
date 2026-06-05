# Public Advisory-Style Synthetic Report: RustSec Dependency Without Reachability

Synthetic benchmark only. This is modeled after a RustSec dependency advisory
workflow, not copied from an upstream report.

Source shape: RustSec advisories identify affected crates, patched versions,
categories, related vulnerabilities, and machine-readable metadata.

Affected version: Cargo.lock from application release 1.4.0 includes
`demo-parser` 0.8.1.

Affected package: `demo-parser` dependency in `Cargo.lock`.

Environment: Linux x64, Rust 1.88, `cargo audit` run in CI.

Observed result: scanner output reports a RustSec-style advisory for
`demo-parser` 0.8.1.

Security impact: the advisory says attacker-controlled input may lead to data
access in applications that pass untrusted input to the parser.

The report only includes the dependency advisory match. It does not show how
application input reaches the package and does not include an independently
checkable artifact from a real application run.
