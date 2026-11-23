# EpaDash database implementation — Task 3

**Document ID:** EPADASH-DB-001  
**Version:** 1.0.0  
**Status:** Implementation package prepared; local PostgreSQL execution and evidence capture required before resubmission  
**Database:** PostgreSQL 16  
**ORM:** Prisma 6.19.0  
**Runtime:** Node.js 22+

## 1. Scope

This implementation package provides a PostgreSQL relational model for EpaDash identity and roles, merchants, products, categories, inventory, customer addresses, orders, payments, refunds, rider profiles, delivery assignment history, tracking, notifications and audit events.

The source of truth is `prisma/schema.prisma`. The ERD in `docs/erd.mmd` is maintained to represent that schema. PostgreSQL-specific `CHECK` constraints and a partial unique index are appended to the generated initial migration by `scripts/generate-migration.mjs`.

## 2. Material design changes from the rejected version

### 2.1 Historical delivery address

An order now stores a snapshot of recipient name, phone, address lines, city, region, country, coordinates and delivery notes. `deliveryAddressId` is an optional reference to the customer's saved address. If the saved address is later edited or deleted, the order snapshot remains unchanged.

### 2.2 Delivery assignment and reassignment history

`DeliveryAssignment` records each rider assignment with the rider, assigning user, assignment timestamp, end timestamp, status and reason. A PostgreSQL partial unique index permits at most one `ACTIVE` assignment per delivery. The current rider on `Delivery` is a convenience pointer; changes must be made through the transactional assignment service.

### 2.3 Inventory integrity and concurrency

`Inventory` stores on-hand and reserved quantities. PostgreSQL checks enforce non-negative quantities and `quantityReserved <= quantityOnHand`. `InventoryMovement` provides an idempotent audit trail. `reserveInventory` uses a conditional SQL update so competing requests cannot reserve unavailable units. `commitInventorySale` converts an existing reservation into a completed sale.

### 2.4 Payment and refund integrity

`Payment` represents a payment attempt. `PaymentTransaction` stores provider events and enforces provider-event uniqueness. `Refund` records partial or full refund requests with an idempotency key. The refund service checks that aggregate committed/requested refunds do not exceed the original payment amount. Provider callbacks must still be cryptographically verified by the payment integration before setting `verified=true` or changing payment state.

### 2.5 Database-level constraints

The generated migration adds checks for:
- non-negative product and order monetary values;
- positive payment and refund amounts;
- positive order-item quantities;
- non-negative inventory and reserved-stock invariants;
- valid weekday and 24-hour operating-time values;
- valid latitude and longitude ranges;
- valid currency codes;
- delivery assignment end-time consistency;
- one active rider assignment per delivery.

Foreign keys and unique constraints are generated from Prisma relations and unique declarations.

## 3. Entity groups

| Domain | Entities |
|---|---|
| Identity | User, UserRole, RefreshToken, PasswordResetToken |
| Customer | CustomerProfile, Address |
| Merchant | Merchant, MerchantCategory, MerchantCategoryLink, MerchantOperatingHour, DeliveryZone |
| Catalogue | Product, ProductCategory, ProductCategoryLink |
| Inventory | Inventory, InventoryMovement |
| Orders | Order, OrderItem, OrderStatusHistory |
| Payments | Payment, PaymentTransaction, Refund |
| Delivery | RiderProfile, Delivery, DeliveryAssignment, DeliveryTrackingEvent |
| Operations | Notification, AuditLog |

## 4. Transaction boundaries

- **Stock reservation:** perform the conditional inventory update and insert its inventory movement in one database transaction.
- **Stock sale:** decrement on-hand and reserved quantities and insert the sale movement in one transaction.
- **Rider reassignment:** close the active assignment, create the next assignment and update the current delivery rider in one transaction.
- **Refund request:** check the total of in-flight/successful refunds and create the request in one serializable transaction. Retry serialization failures safely with the same idempotency key.
- **Order placement:** create order, immutable address snapshot, order items, status history and stock reservations in a single transaction in the application workflow.

## 5. Migration procedure

The repository pins Prisma 6.19.0. On a clean local PostgreSQL database:

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL with `docker compose up -d db`.
3. Install dependencies using `npm install`.
4. Generate the initial migration using `npm run db:migration:generate`.
5. Review the generated `prisma/migrations/*/migration.sql`.
6. Apply it using `npm run db:migrate`.
7. Generate Prisma Client using `npm run prisma:generate`.
8. Run the development seed using `npm run db:seed`.
9. Run tests using `npm test`.

The migration generator intentionally refuses to create a second initial migration. For later schema changes, use `prisma migrate dev --name <descriptive_name>` in a development environment, review the generated migration and commit it. Never regenerate or edit a migration already applied to a shared environment.

## 6. Seed safety

The seed uses clearly fictional `.local` demo email addresses. It requires `ALLOW_DEVELOPMENT_SEED=true` and a `SEED_DEMO_PASSWORD` supplied through the environment. It refuses to run when `NODE_ENV=production`. Never reuse the local password or seeded records in production.

## 7. Verification

The test suite is designed to run against PostgreSQL, not SQLite or an in-memory substitute. It includes:
- uniqueness and CHECK-constraint verification;
- concurrent inventory reservation verification;
- rider reassignment-history verification.

Before submission, run the migration and test commands and capture their actual terminal output. The current package does not claim that these commands have already passed on the target project database.

## 8. Remaining integration decisions

The project owner must confirm the business rules for multi-merchant checkout, order cancellation, tax/tips/discount calculation, rider capacity, delivery-zone geometry/PostGIS, retention rules and KYC evidence. This package models one merchant and one delivery record per order. These decisions should be approved before production rollout.
