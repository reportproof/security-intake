# Missing Impact Synthetic Report

Affected version: demo API release 0.6.5.

Affected component: `/api/search` route in file `routes/search.ts`.

Environment: Node 24.1.0, Docker compose profile `demo`.

Steps to reproduce:

1. Start the app with `docker compose up`.
2. Run this command:
   `curl "http://localhost:3000/api/search?q=%25%25%25%25"`.

Observed result: the response takes 9 seconds and logs `slow query fallback used`.

Proof: the log trace includes:

```text
query="%%%%" result=slow-fallback duration_ms=9021
```

I have not determined whether this has a security impact.
