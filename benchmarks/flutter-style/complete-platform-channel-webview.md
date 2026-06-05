# Flutter-Style Synthetic Report: Platform Channel WebView Boundary

Affected version: Flutter-style SDK stable release 3.24.0, commit `flutter-demo-b2`.

Affected component: platform channel handler in file `packages/flutter_tools/lib/src/webview_channel.dart`.

Environment: macOS 15.5, Android emulator API 35, Flutter stable channel, Dart 3.5.

Reproduction steps:

1. Build the demo app with `flutter run --flavor securityDemo`.
2. Open the embedded WebView route `/demo-webview`.
3. Send this request from the fixture page: `window.DemoChannel.postMessage('read:file:///demo/private.txt')`.

Observed result: the response log shows the platform channel returned contents from the private demo file.

Security impact: an attacker who controls WebView content could access local app data through the platform channel.

Proof of concept: the failing test `webview_channel_security_test.dart` logs:

```text
channel=DemoChannel action=read path=file:///demo/private.txt result=allowed
```
