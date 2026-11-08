# EpaDash Task 2 — Authentication and User Management Starter

## Included
- Express + TypeScript application scaffold.
- Registration, login, refresh-token rotation, logout and password-reset endpoints.
- Argon2id password hashing and SHA-256 hashes for opaque refresh/reset tokens.
- Bearer access-token middleware and role guard.
- User profile read/update and administrator account-status endpoint.
- Zod request validation, Helmet, CORS, rate limiting and consistent error responses.
- PostgreSQL Docker Compose file, environment template and starter validation tests.

## Important integration note
This starter was written against the Task 3 design vocabulary:
- `User`: `id`, `email`, `phone`, `passwordHash`, `status`, timestamps.
- `UserRole`: `userId`, `role`.
- `RefreshToken`: `id`, `userId`, `tokenHash`, `expiresAt`, `revokedAt`, `createdAt`.
- `PasswordResetToken`: `id`, `userId`, `tokenHash`, `expiresAt`, `usedAt`, `createdAt`.

The actual Task 3 Prisma schema must be merged/reconciled before `prisma generate` or execution. `prisma/task2-required-models.prisma` is an integration reference, not a complete schema. The Task 3 design document describes the entity set but does not settle every generated Prisma field name. Review `docs/INTEGRATION-CHECKLIST.md`.

## Setup
1. Install Node.js 20+ and Docker Desktop (or use an existing PostgreSQL 16 database).
2. Copy `.env.example` to `.env`.
3. Replace `ACCESS_TOKEN_SECRET` with a random secret of at least 32 characters. Never commit `.env`.
4. Start PostgreSQL: `docker compose up -d`.
5. Merge the required token models into the project's Task 3 Prisma schema and confirm all field/relation names.
6. Install dependencies: `npm install`.
7. Generate Prisma client: `npm run prisma:generate`.
8. Run type check and tests: `npm run typecheck && npm test`.
9. Start development server: `npm run dev`.

## Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/password/forgot`
- `POST /api/v1/auth/password/reset`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/admin/users/:userId/status` (ADMIN role)

Access tokens are returned in JSON; refresh tokens are stored in an HttpOnly cookie. Configure cookie security and CORS for the actual frontend origin.

## Before production
- Connect a real email/SMS provider to password reset; the current route deliberately does not send or expose the reset token.
- Add email/phone verification and account activation policy.
- Add login lockout/abuse monitoring and structured redacted logging.
- Add audit-log writes for administrative status changes.
- Review cookie CSRF protection and frontend token handling.
- Reconcile role/status enums and Prisma relation names.
- Add integration tests against a disposable PostgreSQL database.
- Review privacy, retention and account deletion policies.

## Status
This is a starter implementation package, not a production-certified or runtime-verified service. The tests included cover request schemas only; database integration, end-to-end authentication and migrations have not been run in this environment.

See `EpaDash_Task2_Implementation_Guide.pdf` and `.docx` for a concise scope/security/status guide.
