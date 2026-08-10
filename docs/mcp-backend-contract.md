# MCP backend contract

The website exposes the same-origin MCP URL at `/mcp`. The Cloudflare Worker forwards `/mcp` and `/mcp/*` requests to the existing API origin without removing the `Authorization` header.

## Authentication

- Accept `Authorization: Bearer <user-token>`.
- Reuse the website's existing user Token validation middleware and active-user checks. Do not introduce a separate MCP API key, admin key, or user identity store.
- Return the same `401` behavior used by protected website APIs when the header is missing, malformed, expired, invalid, or belongs to a disabled/deleted user.
- Preserve the existing `OPTIONS` behavior for browser and MCP client compatibility.

## Token refresh

Provide `POST /api/user/token/refresh` as an authenticated endpoint.

- Validate the current bearer Token through the existing user authentication middleware.
- Issue a new ordinary user Token for the authenticated user.
- Return JSON with `data.token`. Optional `data.expires_at` may be included, but the website also reads the JWT `exp` claim.
- A stateless JWT refresh does not revoke the previous Token. If immediate revocation is required later, add a server-side Token version or denylist as a separate security change.

## MCP transport

- Serve Streamable HTTP MCP on `/mcp` (and any transport subpaths under `/mcp/*`).
- Run authentication before MCP initialization, tool discovery, or tool execution.
- Use the authenticated website user as the only account scope for resources and tool actions.
- Never accept a user ID from a tool argument as an authorization boundary; derive it from the validated Token context.

The account center displays the connection URL and a Codex `config.toml` snippet using `bearer_token_env_var`, so no Token is embedded in copied configuration.
