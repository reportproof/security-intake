# Expo-Style Synthetic Report: Public Config Secret Confusion

Affected version: demo app created with SDK 51.0.0.

Affected component: app config module `app.config.ts` and generated bundle.

Environment: Node 24, Android emulator API 35, production-style release bundle.

Steps to reproduce:

1. Add `EXPO_PUBLIC_ANALYTICS_KEY=demo-public-key` to the app environment.
2. Run command `npx expo export --platform android`.
3. Search the output bundle for `demo-public-key`.

Observed result: the response from the search command shows the key in the generated JavaScript bundle.

Proof: command output:

```text
dist/_expo/static/js/android/index.js:EXPO_PUBLIC_ANALYTICS_KEY=demo-public-key
```

I have not determined whether this key grants data access, account access, privilege change, or other security impact.
