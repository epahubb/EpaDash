# EpaDash Database Design — Task 3
**Document ID:** EPADASH-DB-001 | **Version:** 0.1 | **Status:** Proposed design, review required

## 1. Purpose and scope
This document defines the initial relational database design for the EpaDash backend. It covers the entities named or implied by the assignment: customers, merchants, riders, administrators, products, categories, inventory, orders, order items, order status, payments/transactions, delivery assignment/tracking, notifications and audit logs. It also includes authentication/session records and customer delivery addresses needed to support the stated workflows.

The deliverables include a Prisma schema, an editable Mermaid ERD source, this design note and a proposed seed-data plan. The schema is a starting implementation artefact; it must be validated against the approved business rules and company conventions before production use.

## 2. Design assumptions requiring confirmation
1. **Shared identity:** one `User` account can have one or more roles through `UserRole`. Role-specific profiles are separate records.
2. **One merchant per order:** an order belongs to exactly one merchant. If the product must support multi-merchant carts, the order model must be revised to use a parent checkout with merchant-specific sub-orders.
3. **One delivery per order:** an order has zero or one delivery record. Split deliveries require a different cardinality.
4. **Product categories:** products may belong to multiple categories. Merchant categories are also many-to-many.
5. **Currency:** GHS is the default currency, but currency is stored on monetary records. Monetary values use fixed-precision decimals, not floating point.
6. **Geospatial boundaries:** delivery zones store optional GeoJSON initially. Add PostGIS geometry and spatial indexes if radius/polygon queries are required and the hosting database supports PostGIS.
7. **Operating hours:** one row per merchant per weekday; times use a consistent 24-hour `HH:mm` representation. Holiday/special hours are not yet modelled.
8. **Inventory:** `quantityHeld` represents reserved stock. The service layer must enforce `0 <= quantityHeld <= quantityOnHand` transactionally; add database CHECK constraints in the migration.
9. **Provider events:** payment provider payloads are stored only when permitted and must be redacted/minimised. Never store card data or secrets.
10. **Account verification:** verification status is represented on User timestamps and account status; additional verification evidence/document tables may be needed if merchant/rider KYC requirements are defined.

## 3. Entity catalogue

### Identity and access
- **User:** shared identity, login identifiers, password hash, account status and verification timestamps.
- **UserRole:** composite key assigning one or more roles to a user.
- **RefreshToken:** hashed refresh token, expiry and revocation timestamp.
- **PasswordResetToken:** hashed, expiring, single-use password reset token.
- **CustomerProfile:** customer-specific information.
- **RiderProfile:** rider-specific verification and availability.
- **Address:** customer-owned delivery addresses with optional coordinates.

### Merchant and catalogue
- **Merchant:** business profile, owner, public visibility, approval/operating status and location.
- **MerchantCategory / MerchantCategoryLink:** merchant classification.
- **MerchantOperatingHour:** weekly opening schedule.
- **DeliveryZone:** merchant delivery coverage metadata and optional GeoJSON boundary.
- **Product:** merchant-owned item, SKU, price, publication and availability state.
- **ProductCategory / ProductCategoryLink:** hierarchical product taxonomy and many-to-many product classification.
- **Inventory:** on-hand, held/reserved and low-stock quantities.

### Transactions and fulfilment
- **Order:** customer, merchant, delivery address, lifecycle state and monetary totals.
- **OrderItem:** purchased product reference plus immutable-at-purchase name/SKU/price snapshots.
- **OrderStatusHistory:** chronological state-transition audit.
- **Payment:** payment attempt, provider reference, amount, currency and status.
- **PaymentTransaction:** verified/unverified provider event record; provider event idempotency.
- **Delivery:** order fulfilment and optional assigned rider.
- **DeliveryTrackingEvent:** status/location/time history.

### Operations
- **Notification:** user-facing notification channel and delivery/read state.
- **AuditLog:** actor, action, target entity, metadata and timestamp.

## 4. Relationship summary
- User 1 — 0..1 CustomerProfile, Merchant and RiderProfile; User 1 — many UserRole, Address, tokens, Notifications and AuditLog entries.
- Merchant 1 — many Products, operating-hour rows, delivery zones and Orders.
- Merchant ↔ MerchantCategory is many-to-many through MerchantCategoryLink.
- Product ↔ ProductCategory is many-to-many through ProductCategoryLink; Product 1 — 0..1 Inventory.
- CustomerProfile 1 — many Orders; Merchant 1 — many Orders; Address 1 — many historical Orders.
- Order 1 — many OrderItems, status history and Payment attempts; Order 1 — 0..1 Delivery.
- Payment 1 — many PaymentTransactions; Delivery 1 — many tracking events; RiderProfile 1 — many deliveries.

## 5. Integrity rules and constraints
- Primary keys use UUIDs.
- Email, phone, merchant slug, category slug and order number are unique where defined.
- Product slug and SKU are unique within a merchant.
- Join tables use composite primary keys to prevent duplicate category assignments or role grants.
- Foreign keys protect relationships. Historical order/payment records use restrictive deletion behaviour; do not cascade-delete financial history.
- Quantity and money values must be non-negative; quantities must be whole numbers.
- `OrderItem` stores product name, SKU and price snapshots so catalogue edits do not rewrite purchase history.
- Payment webhook/provider events must be processed idempotently.
- Public discovery query rules must require active and public merchants, and published and available products.
- Service-level checks and database constraints must agree; application validation alone is not enough for critical integrity rules.

## 6. Index strategy
The Prisma schema includes initial indexes for:
- User status and creation time; role lookup.
- Merchant status/public flag, location fields and name.
- Merchant/product category join lookup.
- Product merchant/status/availability and name.
- Inventory quantity.
- Customer order history, merchant order queue and order status.
- Payment order/status/provider reference.
- Rider availability/verification and delivery assignment/status.
- Delivery tracking chronology.
- Notification inbox queries.
- Audit actor, target entity and action chronology.

These are initial candidates. Review query plans against real endpoint queries before adding further indexes. Avoid indiscriminate indexing because indexes add write and storage cost.

## 7. Migration and seed plan
1. Initialise PostgreSQL database and Prisma.
2. Add enums and identity/access tables.
3. Add customer, merchant, category, operating-hours and delivery-zone tables.
4. Add products, product categories and inventory.
5. Add addresses, orders, order items and status history.
6. Add payments and provider transaction records.
7. Add rider, delivery and tracking records.
8. Add notifications and audit logs.
9. Add reviewed SQL constraints for non-negative money/quantity and inventory-held invariants.
10. Seed development-only roles, merchant/product categories and clearly fake demo accounts/products. Never seed real personal data or production credentials.

Use versioned Prisma migrations. Do not edit an already-applied migration in a shared environment; create a new migration for changes. Test both a clean database migration and an upgrade from the previous schema.

## 8. Required database tests
- All migrations apply cleanly to an empty PostgreSQL database.
- Unique constraints reject duplicate email/phone, slugs and order numbers.
- Foreign keys reject orphan records.
- Join-table composite keys reject duplicate links.
- Restrictive delete rules preserve order/payment history.
- Product publication/merchant visibility query returns only eligible public records.
- Inventory reservation logic prevents overselling under concurrent requests (transaction/locking test).
- Order item snapshots remain unchanged after product name/price edits.
- Payment provider event idempotency prevents duplicate processing.
- Seed script is repeatable or safely refuses duplicate insertion.

## 9. Review decisions still open
- Confirm one merchant per order and one delivery per order.
- Confirm whether customer accounts can hold multiple roles.
- Confirm whether product category assignment is single or multiple.
- Confirm product variants/options, taxes, promotions, tips and service fees.
- Confirm stock reservation timing and release rules.
- Confirm order cancellation, payment retry/refund and delivery failure lifecycle.
- Confirm KYC/document requirements for merchants and riders.
- Confirm geospatial database support and delivery-zone representation.
- Confirm data retention and deletion policies for accounts, payments, delivery coordinates and audit records.

## 10. Completion status
The conceptual schema and Prisma starting model are drafted. Task 3 should only be marked **Implemented** after the team validates the schema, generates and applies migrations, runs database tests, reviews the ERD and commits the artefacts. This document is not evidence of a deployed or production-validated database.
