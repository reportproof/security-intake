# Kubernetes-Style Synthetic Report: Complete Admission Policy Bypass

Synthetic benchmark only. This is not a Kubernetes vulnerability report.

Affected version: Kubernetes-style control plane release v1.35.2, commit `1111222233334444`.

Affected component: API server admission chain module `pkg/apiserver/admission/chain.go`.

Environment: three-node kind cluster, Kubernetes-style API server on Linux x64, default RBAC, Pod Security admission set to restricted for namespace `tenant-a`.

Steps to reproduce:

1. Start a fresh cluster with the synthetic API server build from commit `1111222233334444`.
2. Apply the included namespace label manifest for `tenant-a`.
3. As a user with only `create pods` in `tenant-a`, send the request below to create a pod with `hostPID: true`.
4. Confirm the admission chain logs record the request as allowed.

Observed result: the response is HTTP 201, and the audit log shows `admission.synthetic/pod-security=skipped-after-mutating-webhook`.

Security impact: an attacker with namespace-scoped pod creation access can bypass a namespace policy that should block host process namespace access.

Proof: the sanitized audit log below shows the policy skip and the accepted pod UID:

```text
request.user=tenant-a-writer verb=create resource=pods namespace=tenant-a
admission.synthetic/pod-security=skipped-after-mutating-webhook
response.code=201 pod.uid=00000000-1111-2222-3333-444444444444
```
