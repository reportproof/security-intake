# Expo-Style Synthetic Report: Dependency Alert Without Reachability

Affected version: lockfile from SDK 50.0.0 includes `demo-transitive-parser@2.3.4`.

Affected package: `demo-transitive-parser` dependency in `package-lock.json`.

Environment: automated scanner on Ubuntu 24.04 with Node 24.

Observed result: the scanner template reports a high-severity advisory for `demo-transitive-parser@2.3.4`.

Security impact: the generic advisory says attacker-controlled JSON may lead to data access in applications that call the parser.

No reproduction steps, request, route, proof of concept, failing test, or project-specific reachability evidence was provided.
