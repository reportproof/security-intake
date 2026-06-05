# Expo-Style Synthetic Report: Auth Redirect Trust Boundary

Affected version: Expo-style SDK package version 51.0.0, commit `expo-demo-a1`.

Affected component: `AuthSession` redirect handler endpoint and file `packages/auth-session/src/RedirectSession.ts`.

Environment: Node 24.1.0, iOS simulator 17.5, Android emulator API 35, Expo-style dev server.

Reproduction steps:

1. Create a demo app with the affected package version.
2. Configure the redirect URI to `demo://auth/callback`.
3. Run this command: `curl -i "http://localhost:19000/auth/callback?state=demo-state&redirect_uri=evil://callback"`.
4. Complete the mock provider login in the simulator.

Observed result: the response logs show the callback was accepted with the untrusted redirect URI and the demo token was sent to the attacker-controlled scheme.

Security impact: an attacker who can influence the redirect parameter may capture account tokens for apps using this helper.

Proof of concept: the attached failing test `AuthSession.redirect.test.ts` records this log:

```text
redirect_uri=evil://callback result=accepted token=demo-token
```
