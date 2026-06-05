# Short Actionable Synthetic Report

Version: 0.8.0 release, commit `def5678`.

Component: admin export route `/admin/export`, file `server/export.ts`.

Environment: Node 24 on Ubuntu 24.04 with Docker.

Steps to reproduce: run `curl -H "X-User: readonly" http://localhost:8080/admin/export?format=json`.

Observed result: the response returns `200` with a JSON export containing another account's email address.

Impact: a readonly attacker can access account data that should require administrator privilege.

Proof of concept: the command above returns this response header and body marker:

```text
HTTP/1.1 200 OK
"accountEmail":"victim@example.test"
```
