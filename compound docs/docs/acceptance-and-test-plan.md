# Task 1 Acceptance and Test Plan

## Acceptance criteria
- Only active and public merchants appear in list and detail endpoints.
- Only published and available products belonging to active public merchants appear in global, merchant-scoped and detail endpoints.
- Search and category filters work independently and together.
- Product price bounds are validated and applied.
- Pagination defaults to page 1 / 20 items and rejects limits above 100.
- Responses contain only approved public fields.
- Private, suspended, draft, archived and unavailable records are not exposed.
- Merchant detail includes public profile, weekly operating schedule and active delivery coverage labels.
- Product responses distinguish known in-stock from unknown inventory.
- Error responses use consistent machine-readable codes.

## Automated tests to add/run
1. Repository integration tests against a disposable PostgreSQL database for every visibility condition.
2. Search matching tests (case-insensitive; relevant fields).
3. Category filtering tests for merchant and product join tables.
4. Price range tests, including min > max rejection.
5. Pagination boundary tests (empty results, last page, max limit, >100).
6. Public-field leakage tests asserting owner IDs, KYC, supplier cost, internal notes and raw zone geometry are absent.
7. Product detail tests for unknown, unpublished and unavailable products.
8. Merchant-scoped product list returns 404 when merchant is private or inactive.
9. Inventory tests for on-hand/held stock and concurrent order reservation (the latter belongs with order/inventory service integration).
10. Operating-hours and delivery-zone tests after timezone and geospatial rules are approved.

## Current test status
Pure policy unit tests are included in `tests/discovery-visibility.test.ts`. They have **not been executed**. Database-backed repository/API tests are not included because the final Prisma schema and database environment have not been reconciled. Do not report tests as passing until they are run in the project.
