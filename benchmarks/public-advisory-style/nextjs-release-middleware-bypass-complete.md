# Public Advisory-Style Synthetic Report: Framework Middleware Bypass

Synthetic benchmark only. This is modeled after a framework security release,
not copied from an upstream report.

Source shape: Next.js/Vercel security releases group multiple advisories by
impact area, affected component, and patched versions.

Affected version: framework-demo 15.2.4, commit `next-demo-a1b2c3`.

Affected component: middleware authorization matcher module
`packages/framework/src/server/middleware.ts`.

Environment: Node 24, Linux x64, production build with middleware-based account
authorization.

Steps to reproduce:

1. Build the synthetic app with `npm run build && npm start`.
2. Sign in as a user without access to account `acct_2`.
3. Send the request `GET /acct_2/settings?segment=synthetic-prefetch`.
4. Compare the response with a normal `GET /acct_2/settings` request.

Observed result: the synthetic-prefetch request returns HTTP 200 while the normal
request returns HTTP 403.

Security impact: an authenticated user could bypass middleware authorization and
read another account's settings page.

Proof of concept: the regression test `test/security/middleware-bypass.test.ts`
records the response comparison:

```text
 normal_status=403 synthetic_prefetch_status=200 leaked_account=acct_2
```
