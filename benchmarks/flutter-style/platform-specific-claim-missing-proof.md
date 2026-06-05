# Flutter-Style Synthetic Report: Platform-Specific Claim Missing Proof

Affected version: Flutter-style stable release 3.24.0.

Affected component: iOS keychain bridge module `packages/flutter_secure_bridge/ios/KeychainBridge.mm`.

Environment: iOS 17.5 simulator and macOS 15.5.

Steps to reproduce:

1. Build the demo app with command `flutter run -d ios`.
2. Save a value through the secure bridge.
3. Restart the simulator and read the value through the bridge.

Observed result: the reporter says the value appears to remain readable after reinstall.

Security impact: if true, stale account data could be accessible to a later user of the same test device.

No proof of concept, log, screenshot, trace, payload, or failing test is available yet.
