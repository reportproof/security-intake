# Missing Reproduction Steps Synthetic Report

Affected version: demo service release 3.2.1, commit `a1b2c3d`.

Affected component: password reset endpoint `/account/reset`, file `src/account/reset.ts`.

Environment: Node 24 on Ubuntu 24.04.

Observed result: the response log shows a password reset token being accepted twice for the same account.

Security impact: an attacker with access to an old reset link may gain account access after the user changes their password.

Proof: attached log excerpt:

```text
token=demo-reset-token account=alice result=accepted
token=demo-reset-token account=alice result=accepted
```

I cannot share exact reproduction steps yet because I need to clean up the demo script.
