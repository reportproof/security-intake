# Homebrew-Style Synthetic Report: Third-Party Tap Boundary Complete

Synthetic benchmark only. This is not a Homebrew vulnerability report.

Affected version: Homebrew-style package manager release 5.0.1, commit `aaaabbbbccccdddd`.

Affected component: tap resolution module `Library/Homebrew/tap_resolver.rb`.

Environment: macOS 15.5, zsh, default Homebrew prefix, no modified `PATH`, no wrapper scripts.

Steps to reproduce:

1. Create an empty temporary repository named `example/homebrew-tools`.
2. Run `brew tap example/tools https://example.invalid/homebrew-tools.git`.
3. Run `brew install example/tools/demo`.
4. Observe whether the install output labels the source as an official Homebrew tap.

Observed result: the install log shows `Using official tap metadata for example/tools` even though the tap URL is not under the Homebrew organization.

Security impact: an attacker who convinces a user to add a lookalike tap could cause the user to trust metadata that appears official.

Proof: the sanitized log excerpt below shows the source label and the tap URL:

```text
tap=example/tools url=https://example.invalid/homebrew-tools.git
source_label=official Homebrew tap metadata
install_result=continued
```

Policy note: final scope depends on the project's security boundary, but the report contains enough evidence for a maintainer to review that boundary.
