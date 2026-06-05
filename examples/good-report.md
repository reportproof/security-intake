# Authentication bypass in session refresh endpoint

## Affected version

Version 1.4.2 and commit `8f1c7de`.

## Affected component

Endpoint `/api/session/refresh` in `src/server/session.ts`.

## Environment

Node 20, macOS 15.5, local Docker Postgres.

## Reproduction steps

1. Create a normal user account.
2. Capture a valid refresh request.
3. Replace the `user_id` body field with another account id.
4. Send the request with curl:

```bash
curl -i http://localhost:3000/api/session/refresh \
  -H "content-type: application/json" \
  -d '{"user_id":"victim-user","refresh_token":"valid-attacker-token"}'
```

## Observed result

The response returns a session token for `victim-user`.

## Expected result

The endpoint should bind the refresh token to the original user and reject mismatched user ids.

## Security impact

An attacker with any valid refresh token can access another account if they know or guess the target user id.

## Proof of concept

The attached test reproduces the issue and fails before the patch.
