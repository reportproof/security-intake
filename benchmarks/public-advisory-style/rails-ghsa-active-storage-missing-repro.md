# Public Advisory-Style Synthetic Report: Rails Advisory Summary Missing Repro

Synthetic benchmark only. This is modeled after a concise GitHub security
advisory listing, not copied from an upstream report.

Source shape: Rails publishes GitHub Security Advisories with GHSA identifiers,
affected areas, publication dates, and severity.

Affected version: Rails-style app using `rails-demo` 7.2.2.

Affected component: Active Storage DiskService module
`active_storage/service/disk_service.rb`.

Environment: Ruby 3.3, Linux x64, local Rails-style test app with disk storage.

Observed result: the advisory summary says a specially crafted storage key can
be normalized outside the intended service root.

Security impact: an attacker with upload metadata control may access or write
data outside the expected disk service directory.

The incoming report only includes the advisory summary. It does not include a
replayable validation path or any independently checkable artifact from a real
application run.
