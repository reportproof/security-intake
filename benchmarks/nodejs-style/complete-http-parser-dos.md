# Node.js-Style Synthetic Report: HTTP Parser Denial of Service

Affected version: Node-style runtime release 24.2.0, commit `node-demo-c3`.

Affected component: HTTP parser module in file `src/node_http_parser.cc`.

Environment: Linux x64, Node 24.2.0, default HTTP server configuration.

Reproduction steps:

1. Start the demo server with command `node fixtures/http-server.js`.
2. Send the crafted request: `curl --raw --http1.1 "http://localhost:3000/%5B%5B%5B%5B%5B"`.
3. Repeat the request 20 times from one client.

Observed result: the response times out and the process log shows unbounded parser recursion.

Security impact: an unauthenticated attacker can cause practical denial of service with low request volume.

Proof of concept: the failing regression test `test/parallel/test-http-parser-depth.js` logs:

```text
parser_depth=100000 result=RangeError server=unavailable
```
