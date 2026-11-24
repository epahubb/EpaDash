# Backend task tracking

| Task | Scope | Starter status |
| --- | --- | --- |
| 1 | Merchant discovery and public catalogue | Source and unit test archived. Reconcile catalogue fields and merchant lookup with the API draft before mounting. |
| 2 | Authentication and user management | Express source and unit test archived. Reconcile the Prisma roles relation and registration fields, build output, and password-reset delivery. |
| 3 | Database implementation | Executable baseline. See the [verification record](../reports/task-3/starter-verification.md). |
| 4 | API contracts and workflows | [Draft OpenAPI](../api/openapi.yaml) and [workflows](business-workflows.mmd) available for review. |
| 5 | Awaiting confirmed scope | No source package found. |
| Merchant assignment | Merchant, product catalogue, and inventory management APIs | Implemented locally on `feat/merchant-catalogue-inventory`. See the handoff below. |

## Merchant assignment handoff

### Acceptance evidence

| Acceptance criterion | Implementation and verification |
| --- | --- |
| Merchant registration and profile management | Merchant applications start private and pending approval. An authenticated, active merchant account can read and edit only its own profile. |
| Verification status | An administrator can approve or suspend a merchant. The API audits each change and disables public visibility and order acceptance on suspension. |
| Operating hours and service availability | Owners can replace weekly hours and toggle order acceptance. Pending and suspended merchants cannot open for orders. |
| Product creation, updates, and deletion | Products start as drafts. Owner-only deletion archives them and preserves order history. |
| Category creation and management | Administrators manage the shared taxonomy. Merchants can browse it and assign categories to products they own. |
| Pricing and descriptions | Prices use PostgreSQL decimals and decimal strings in JSON. Tests cover price validation and product description updates. |
| Secure image upload and retrieval | Signed, checksum-bound uploads use a private S3-compatible bucket. Registration verifies the stored object and public retrieval checks product and merchant visibility. |
| Updating inventory quantities | Owners can set stock or record adjustments. Transactional movement records and idempotency keys protect stock during retries and competing reservations. |
| Product availability | Owners independently control availability and publication. Only approved merchants can publish products. |
| Merchant data isolation | HTTP tests cover cross-merchant profile, product, inventory, and image access. Permissions are read from current PostgreSQL account roles. |
| Product and inventory tests | The end-to-end suite covers lifecycle, validation, movement history, idempotent retries, and concurrency. |
| API documentation | The [OpenAPI contract](../api/openapi.yaml) marks mounted assignment routes. The [README](../../README.md) explains local setup, stock writes, and image uploads. |

Merchant onboarding uses an existing active account with the `MERCHANT`
role. Account provisioning belongs to the authentication workflow.

### PR draft

**Title** — Implement merchant, product catalogue, and inventory management APIs

**Summary** — Add merchant onboarding, owner-managed profiles and hours,
audited administrator approval, and merchant-scoped product and category
management. Add reservation-safe stock adjustments with movement history,
idempotent retries, and private object storage for product images. Document
the API and verify the assignment with end-to-end tests.

**Database changes** — Apply the two forward migrations for inventory
idempotency and product image metadata. The initial database migration is
preserved byte-for-byte.

**Work-account submission** — Use the PR link after opening it in GitHub.

> Implemented merchant onboarding and profile management, product and
> category management, reservation-safe inventory updates, and secure image
> upload and retrieval. Verified merchant ownership and administrator roles.
> All 18 tests passed with disposable PostgreSQL and a local S3 protocol test
> server. Verification against the team's storage provider is pending.

### Final verification

| Check | Result |
| --- | --- |
| Locked dependency install and Prisma Client generation | Passed using the existing npm cache and matching Prisma engines. |
| Prisma validation, migration deployment and status | All three migrations applied to an empty PostgreSQL 16 database. Prisma reported no schema drift. |
| Typecheck and build | Passed. |
| Automated tests | 18 passed across eight files, including authorization, stock concurrency, image verification, and rejection of upload replacement. |
| OpenAPI | YAML, internal references, and OpenAPI 3.0 schema validation passed. The contract marks 28 operations implemented. |
| Live storage and browser CORS | Pending. The local S3 protocol test server passed. MinIO image pulls were denied, and the RustFS pull failed during a registry DNS lookup. Verify with the team's disposable storage environment before deployment. |

This is a local branch without a GitHub remote. The team must confirm the
repository, target branch, and backend path before preparing the assignment
diff against that history. The developer publishes the branch, opens the PR,
and submits the PR link on the assignment page.
