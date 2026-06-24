# Blaze Integration Configuration

Phase C uses real HTTP, OAuth, PostgreSQL, scheduled snapshot, webhook, and Socket.IO infrastructure. Blaze's public website does not currently expose a discoverable developer contract, so provider URLs and resource paths are configured through environment variables rather than hardcoded assumptions.

## Required Blaze Contract

Configure the values in `apps/api/.env.example` from Blaze's developer documentation:

- OAuth authorization and token URLs
- API base URL and profile path
- Channel, stream, live, follower, subscriber, and activity paths
- OAuth client credentials and redirect URI
- Webhook signing secret

The adapter accepts either a direct JSON response or a `{ "data": ... }` envelope. Provider-specific field normalization is isolated in the Blaze service classes.

## Security

- OAuth state is one-time and expires after ten minutes.
- Provider tokens are encrypted with AES-256-GCM.
- Sessions use random opaque tokens; only their hashes are stored.
- Session cookies are HttpOnly, SameSite=Lax, and Secure in production.
- Access tokens refresh before expiry.
- Event payloads require an HMAC-SHA256 signature in `x-blaze-signature`.

## Database

Run:

```bash
npm run prisma:generate
npm run prisma:migrate --workspace @blaze/api
npm run prisma:seed --workspace @blaze/api
```

The checked-in migration creates product tables and the additional credential, session, and OAuth state tables required for secure authentication.

## Event Flow

Configure Blaze to deliver events to:

```text
POST /api/events/blaze
```

Accepted events are persisted before being emitted to the authenticated channel's Socket.IO room. The frontend invalidates its existing React Query data when `creator:data-changed` is received.
