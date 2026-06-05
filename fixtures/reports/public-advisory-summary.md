# Public Advisory Style Synthetic Report

Affected release: `widget-server` version 2.1.0 through 2.1.3. Fixed in tag `v2.1.4`.

Affected package and module: `@demo/widget-server`, module `src/parser/query.ts`.

Environment: Node 24.0.0, Linux x64 container, default configuration.

Reproduction command: run the regression test added in `tests/security/query-depth.test.ts` with `npm test -- query-depth`.

Observed result before the fix: the test logged repeated parser recursion and returned a `RangeError` response after a crafted request.

Security impact: an unauthenticated attacker could send a single request that consumed CPU and made the demo endpoint unavailable for other users.

Proof: the advisory includes the failing test, the payload fixture `tests/fixtures/deep-query.txt`, and the patched commit sha `fedcba9`.
