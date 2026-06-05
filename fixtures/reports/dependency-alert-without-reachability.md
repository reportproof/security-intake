# Dependency Alert Without Reachability Synthetic Report

Affected version: package lock from release 1.0.0 includes `demo-parser@4.5.6`.

Affected package: `demo-parser` dependency in `package-lock.json`.

Environment: automated scanner run on Ubuntu 24.04 with Node 24.

Observed result: the scanner reports that `demo-parser@4.5.6` has a known advisory in its generic template output.

Security impact: the package advisory says prototype pollution may allow data access in applications that parse attacker-controlled JSON.

There are no reproduction steps for this project yet, and there is no proof that the vulnerable code path is reachable from a request.
