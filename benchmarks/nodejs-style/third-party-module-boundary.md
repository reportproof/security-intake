# Node.js-Style Synthetic Report: Third-Party Module Boundary

Affected version: Node-style runtime release 24.2.0, commit `node-demo-d4`.

Affected component: module loader file `lib/internal/modules/cjs/loader.js`.

Environment: Linux x64, Node 24.2.0, default module loading behavior.

Reproduction steps:

1. Install the demo third-party package `malicious-demo-package@1.0.0`.
2. Run command `node fixtures/load-malicious-package.js`.
3. Observe the package reading its own local fixture file.

Observed result: the response log shows the third-party module executed package code and read `fixtures/package-owned.txt`.

Security impact: the report claims this could lead to account data access if a developer installs malicious code.

Proof of concept: the payload package logs:

```text
module=malicious-demo-package action=read file=fixtures/package-owned.txt result=allowed
```

Note: this benchmark is evidence-complete but policy-dependent. The intake tool should pass it to maintainer review, not decide whether project policy treats it as a vulnerability.
