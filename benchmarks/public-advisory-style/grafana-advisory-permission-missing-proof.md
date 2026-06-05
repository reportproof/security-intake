# Public Advisory-Style Synthetic Report: Dashboard Permission Claim Missing Proof

Synthetic benchmark only. This is modeled after a product advisory listing, not
copied from an upstream report.

Source shape: Grafana Labs publishes advisory rows with CVE, severity, product,
advisory title, and update metadata.

Affected version: dashboard-demo 11.5.2.

Affected component: dashboard permissions endpoint
`/api/dashboards/uid/:uid/permissions`.

Environment: Docker Compose, Linux x64, default organization roles, viewer and
editor test users.

Steps to reproduce:

1. Start the synthetic dashboard service with `docker compose up`.
2. Sign in as the viewer user.
3. Send a permissions update request for dashboard `dash-public`.
4. Refresh the dashboard permissions page as an admin user.

Observed result: the admin page shows the viewer user listed with editor access
after the request.

Security impact: a low-privilege user may escalate dashboard permissions and
modify dashboards they should only view.

No proof of concept, screenshot, failing test, trace, payload, or log was
provided with the report.
