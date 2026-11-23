# EpaDash Project Progress — Task 1 Update

**Task:** Customer-facing merchant discovery and product catalogue APIs  
**Status:** Implementation starter prepared; integration and verification pending.

## Work prepared
- Public merchant listing, text search, category filter and pagination.
- Public merchant profile lookup.
- Merchant-scoped product listing.
- Global product catalogue search/filter and product detail.
- Query-level rules for active/public merchants and published/available products.
- Public response mapping and field allowlist guidance.
- Zod query/parameter validation.
- Unit tests for merchant visibility, product visibility and sellable-stock calculation.
- API contract, schema integration checklist and acceptance/test plan.

## Not yet completed
- Final Prisma field/relation reconciliation with the shared database schema.
- Mounting into the actual Task 2 application.
- Merchant timezone and holiday hours needed for accurate `isOpenNow`.
- Destination-aware delivery-zone evaluation.
- Database-backed API/repository tests and test execution.
- Typecheck/build, migration validation, code review and PR merge.

## Accurate completion statement
Task 1 has a code starter and supporting technical documentation. It is not yet fully implemented, integrated, tested or production-ready. The current code intentionally avoids claiming open-now or customer-specific delivery availability because the database design does not yet define the timezone and destination/geospatial rules needed to calculate them correctly.
