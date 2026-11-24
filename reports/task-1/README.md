# EpaDash Task 1 — Merchant Discovery and Product Catalogue

This is a merge-ready implementation starter for the public merchant and product browsing endpoints. It is designed to be merged into the Task 2 Express/TypeScript application.

## Included
- Merchant list/search/category filtering and public profile
- Merchant-scoped product listing
- Global product list/search/filtering and product detail
- Public visibility predicates enforced in Prisma query conditions
- Zod query/parameter validation and capped pagination
- Public response mapping (allowlist)
- Pure visibility/stock policy tests
- API contract, schema integration checklist and acceptance plan

## Quick integration
1. Copy `src/modules/discovery` and `src/lib/discovery-visibility.ts` into the Task 2 backend.
2. Reconcile field and relation names in `discovery.repository.ts` against the final Prisma schema using `docs/integration-checklist.md`.
3. Export and mount the router in the existing application:
   ```ts
   import { createDiscoveryRouter } from "./modules/discovery";
   app.use("/api/v1", createDiscoveryRouter(prisma));
   ```
4. Merge the test into the existing Vitest configuration.
5. Add database-backed tests, then run typecheck, lint and test suite.
6. Commit on a feature branch and open a pull request.

## Endpoints
- `GET /api/v1/merchants`
- `GET /api/v1/merchants/:slug`
- `GET /api/v1/merchants/:slug/products`
- `GET /api/v1/products`
- `GET /api/v1/products/:productId`

## Important
The Task 3 database artefact describes entities and relationships conceptually; it does not provide a verified final Prisma Client contract. The repository therefore uses explicit, documented schema assumptions. Adapt those names before generating Prisma Client. No package installation, compilation, migration, database query or test execution has been performed for this package. It is a starter implementation, not a verified production release.

See:
- `docs/api-contracts.md`
- `docs/integration-checklist.md`
- `docs/acceptance-and-test-plan.md`
- `project-progress-update.md`
