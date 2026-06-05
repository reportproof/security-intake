# Expo-Style Synthetic Report: Build Log Leak Missing Proof

Affected version: EAS-style build worker release 4.2.0.

Affected component: build log redaction module `packages/build/src/redact.ts`.

Environment: Node 24, Linux x64 build worker, Android release profile.

Steps to reproduce:

1. Configure a demo secret named `PAYMENT_TOKEN`.
2. Run command `eas build --profile release --platform android`.
3. Review the build log output.

Observed result: the reporter says the response appears to include a token-like value.

Security impact: if confirmed, an attacker with build-log access could read deployment data or account credentials.

I cannot provide proof, log excerpt, screenshot, trace, payload, or failing test because the demo log was deleted.
