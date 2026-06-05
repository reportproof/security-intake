# Complete Synthetic Report: Session Fixation

Affected version: ReportProof Demo App version 1.4.2, commit `abc1234`.

Affected component: `/login/callback` endpoint in file `src/routes/session.ts`.

Environment: Node 24.1.0, Docker image `demo-app:1.4.2`, macOS 15.5.

Reproduction steps:

1. Start the demo app with `docker run -p 3000:3000 demo-app:1.4.2`.
2. Send this request:
   `curl -i "http://localhost:3000/login/callback?session_id=fixed-demo-session&code=valid-demo-code"`.
3. Open a second browser and authenticate with the same `session_id` value.

Observed result: the response sets `Set-Cookie: session=fixed-demo-session` and the second browser receives access to the first user's demo account.

Security impact: an attacker who can choose the `session_id` before login can force a victim account onto a known session and access account data after authentication.

Proof: the attached PoC command above produced matching log entries:

```text
session=fixed-demo-session user=demo-victim result=authenticated
session=fixed-demo-session user=attacker result=reused
```
