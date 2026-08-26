# Google sign-in backend contract

The workspace uses Google Identity Services in popup mode and sends the returned Google ID token to the website backend. The browser must never validate the identity or mint the website JWT itself.

## Frontend configuration

- Create a Google OAuth client with application type `Web application`.
- Add `https://www.kaliai.fun` as an authorized JavaScript origin. Add the exact localhost origins used for local testing separately.
- Set `PUBLIC_GOOGLE_CLIENT_ID` in the website build environment to the Web client ID. This value is public configuration, not a client secret.
- No Google client secret is used by the static website.

## Login endpoint

Provide one endpoint:

```http
POST /api/user/google_login
Content-Type: application/json

{
  "credential": "<Google ID token>",
  "invite_code": "ABC123"
}
```

`invite_code` is optional. The frontend also sends the equivalent `inviteCode` alias when present.

The successful response must match email login so the existing session and account code can be reused:

```json
{
  "code": 200,
  "data": {
    "token": "<website JWT>",
    "user": {},
    "user_plan": {}
  }
}
```

## Required verification and account rules

1. Verify the token with the maintained Google authentication library for Python. Validate its signature plus `aud`, `iss`, and `exp`; `aud` must equal the same Web client ID configured in the frontend.
2. Require `email_verified=true`. Use the token `sub`, not the email address, as the stable Google identity.
3. Add nullable unique `users.google_sub` and index it. Do not put a Google access token or ID token in the database.
4. Find returning Google users by `google_sub`. For a new Google identity, use verified profile claims to set `email`, `nickname`, and `avatar_url`, then create the same signup plan and invite attribution used by email registration.
5. Do not automatically link an existing password account solely because a non-Gmail, non-Workspace Google account reports the same email. Require the user to sign in to the existing account and explicitly link Google. Gmail addresses, or verified Google Workspace identities with `hd`, may be linked under the documented Google authoritative-email rule.
6. Reject disabled users and preserve existing team ownership, signup credits, invitation, and website JWT behavior.
7. Return generic authentication errors to the browser and keep provider/library details in server logs without logging the raw Google credential.

## Backend configuration

- Add `GOOGLE_WEB_CLIENT_ID` to the backend runtime environment. Its value must match `PUBLIC_GOOGLE_CLIENT_ID`.
- Add the maintained Google authentication dependency, database migration for `users.google_sub`, endpoint tests for invalid signature/audience/issuer/expiry, disabled users, returning users, new users, existing-email conflicts, and invite attribution.
- Credentials belong only in deployment configuration; repository docs and memory record locations, never values.
