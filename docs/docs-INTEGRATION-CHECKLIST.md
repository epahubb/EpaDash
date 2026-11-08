# Task 2 Integration Checklist

## Align with Task 3 schema
Before running this scaffold, confirm the generated Prisma schema has:
- `User.email` unique and normalized to lowercase.
- `User.displayName` string (used by registration and profile updates).
- `User.passwordHash` string.
- `User.status` enum containing `ACTIVE`, `SUSPENDED`, `DEACTIVATED` (or update code to actual enum).
- `UserRole` relation named `userRoles`, with a `role` field.
- `RefreshToken` model and relation named `refreshTokens`.
- `PasswordResetToken` model and relation named `passwordResetTokens`.
- User relations named/used in include statements as `userRoles`.

If your schema uses different names or status values, update the code or schema consistently before generating Prisma Client.

## Security decisions still needed
1. Confirm whether customer accounts become ACTIVE immediately or require email/phone verification.
2. Select the approved email/SMS provider for password-reset delivery.
3. Confirm browser/mobile refresh-token transport and CSRF strategy.
4. Confirm password policy and session expiry with product/security leads.
5. Confirm whether a user may have multiple roles.
6. Add audit log writes for admin changes and session/security events.

## Runtime verification (deferred by project timeline)
Run:
```bash
npm install
cp .env.example .env
# Edit .env and set ACCESS_TOKEN_SECRET and DATABASE_URL
docker compose up -d
npm run prisma:generate
npm run typecheck
npm test
```
Then add/apply the Prisma migration in the main repository and run API integration tests against PostgreSQL.

Do not mark runtime verification complete until commands pass in the target repository.
