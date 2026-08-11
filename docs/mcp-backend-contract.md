# MCP service contract

Production endpoints:

- MCP: `https://mcp.kaliai.fun/mcp`
- Health check: `https://mcp.kaliai.fun/health`
- Cloudflare Worker: `kalimcp-mcp`
- Cloudflare deployment version: `724a6d43-0eb5-4fac-b01d-efece70de57b`
- Source: [`pabatiba89-sys/kalimcp@6757658`](https://github.com/pabatiba89-sys/kalimcp/commit/6757658371aa883d8178ef00fafe6a3a60ec1f07)

The MCP service is deployed independently from the website Worker. The account center and copied Codex configuration point directly to the production MCP endpoint.

Verified on 2026-08-11: the health check returned `200` with service version `0.4.0`, and an unauthenticated MCP request returned `401` with `WWW-Authenticate: Bearer realm="Kaliai MCP"`.

## Authentication

- Accept `Authorization: Bearer <user-token>`.
- Reuse the website's existing user Token validation middleware and active-user checks. Do not introduce a separate MCP API key, admin key, or user identity store.
- Return `401` with the Bearer authentication challenge used by protected website APIs when the header is missing, malformed, expired, invalid, or belongs to a disabled/deleted user.
- Preserve the existing `OPTIONS` behavior for browser and MCP client compatibility.

## Token refresh

Provide `POST /api/user/token/refresh` as an authenticated endpoint.

- Validate the current bearer Token through the existing user authentication middleware.
- Issue a new ordinary user Token for the authenticated user.
- Return JSON with `data.token`. Optional `data.expires_at` may be included, but the website also reads the JWT `exp` claim.
- A stateless JWT refresh does not revoke the previous Token. If immediate revocation is required later, add a server-side Token version or denylist as a separate security change.

## MCP transport

- Serve Streamable HTTP MCP at `https://mcp.kaliai.fun/mcp`.
- Run authentication before MCP initialization, tool discovery, or tool execution.
- Use the authenticated website user as the only account scope for resources and tool actions.
- Never accept a user ID from a tool argument as an authorization boundary; derive it from the validated Token context.

The account center displays the connection URL and a Codex `config.toml` snippet using `bearer_token_env_var = "KALIAI_TOKEN"`, so no Token is embedded in copied configuration.
