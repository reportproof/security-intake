# Node.js-Style Synthetic Report: Missing Affected Version

Affected component: DNS resolver module in file `lib/dns.js`.

Environment: Linux x64 with Node runtime installed.

Steps to reproduce:

1. Start the demo resolver with command `node fixtures/dns-server.js`.
2. Send request `curl "http://localhost:3000/resolve?name=demo.internal"`.

Observed result: the response log shows a private host name being returned to the caller.

Security impact: an attacker may gain access to internal service names through the resolver.

Proof: log excerpt:

```text
query=demo.internal result=10.0.0.5 visibility=private
```

I do not know the affected version, release, tag, sha, or commit.
