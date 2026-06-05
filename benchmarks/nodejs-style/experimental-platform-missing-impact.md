# Node.js-Style Synthetic Report: Experimental Platform Missing Impact

Affected version: Node-style runtime experimental build commit `node-demo-e5`.

Affected component: experimental platform module `src/experimental_platform.cc`.

Environment: unsupported experimental OS target, Node 24 experimental build.

Steps to reproduce:

1. Build the runtime with command `./configure --experimental-platform && make`.
2. Run command `node fixtures/experimental-platform.js`.

Observed result: the process exits with error log `unsupported platform fallback failed`.

Proof: log excerpt:

```text
platform=experimental result=unsupported-fallback-failed
```

I have not determined any attacker capability, exploit path, data access, account access, privilege change, or other security impact.
