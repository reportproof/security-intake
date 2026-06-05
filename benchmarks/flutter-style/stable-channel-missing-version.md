# Flutter-Style Synthetic Report: Missing Stable Version

Affected component: route generation command in file `packages/flutter_tools/lib/src/router.dart`.

Environment: macOS 15.5 and Dart 3.5.

Steps to reproduce:

1. Run command `flutter pub run demo_router --input fixture/routes.yaml`.
2. Include a route named `../../demo`.

Observed result: the command writes a generated file outside the intended output directory.

Security impact: a malicious package could write data outside the generated route directory during a developer build.

Proof of concept: the attached payload `fixture/routes.yaml` and log show:

```text
route=../../demo output=../demo.dart result=written
```

I do not know the affected release, tag, commit, or stable version.
