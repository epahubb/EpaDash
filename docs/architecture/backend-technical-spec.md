# EpaDash Backend Technical Requirements & Core System Architecture

**Document ID:** EPADASH-BE-ARCH-001  
**Version:** 0.1  
**Status:** Proposed — submitted for technical review  
**Scope:** Original Assignment Task 5

## 1. Purpose

This document proposes the backend technical foundation for EpaDash. It identifies the major backend domains, architecture, technology options, security approach, API conventions and external integration boundaries. It is a design proposal, not evidence of implementation, deployment or approval.

## 2. Scope and requirements

The backend must support customer, merchant, rider and administrator management; merchant and product discovery; orders; payments; delivery assignment and tracking; notifications; administration; authentication and authorisation; validation; consistent errors; logging; security; documentation; tests; and database migrations.

Public discovery must expose only active merchants intentionally listed publicly and products that are published and available under agreed business rules.

## 3. Proposed technology stack

| Area | Proposal | Review status |
|---|---|---|
| Runtime | Node.js | Confirm company standard |
| Language | TypeScript | Proposed |
| HTTP framework | Express.js | Proposed; NestJS is an alternative |
| Database | PostgreSQL | Proposed |
| ORM | Prisma | Proposed |
| Validation | Zod | Proposed |
| API specification | OpenAPI 3.1 | Proposed |
| API documentation UI | Swagger UI | Proposed |
| Tests | Vitest and Supertest | Proposed |
| Deployment | Container-based deployment | Hosting platform TBD |

The stack must be reconciled with existing company standards and the rest of the project before implementation.

## 4. Architecture

Recommend a **modular monolith** initially: one deployable backend application with clearly separated domain modules and one primary relational database. This avoids premature distributed-system complexity while preserving module boundaries.

Typical request flow:

1. HTTP route receives a request.
2. Middleware handles request IDs, authentication where required, validation and rate limiting.
3. Application service applies business rules.
4. Repository/data-access layer performs database operations.
5. Response mapper returns a stable public API representation.

Keep business logic out of route handlers. Use database transactions for multi-step operations that must remain consistent.

## 5. Logical modules

- Authentication and sessions
- Users, profiles and roles
- Merchants and merchant discovery
- Products, categories and inventory
- Orders and order status history
- Payments and provider transactions
- Riders and verification
- Deliveries and tracking
- Notifications
- Administration and audit logging

Modules should expose explicit service interfaces and avoid direct dependence on another module's internal implementation.

## 6. Core entities

The conceptual domain includes User, UserRole, CustomerProfile, Merchant, MerchantCategory, MerchantOperatingHour, DeliveryZone, Product, ProductCategory, Inventory, Address, Order, OrderItem, OrderStatusHistory, Payment, PaymentTransaction, RiderProfile, Delivery, DeliveryTrackingEvent, Notification and AuditLog.

Detailed attributes, relationships, constraints, indexes, migrations and the ERD belong to Task 3 and must be reviewed against actual business rules.

## 7. Roles and access control

The principal roles are customer, merchant, rider and administrator. Use role-based access control together with resource ownership checks. A role alone must not grant access to another merchant's records or another customer's private information.

The final permission matrix, multi-role policy, merchant staff model and administrator privileges require technical/product approval.

## 8. Authentication and security

Use a reviewed authentication design with secure password hashing, short-lived access credentials, refresh-token rotation/revocation where applicable, password recovery, account status checks and rate limiting for sensitive endpoints.

Security requirements include HTTPS outside local development, strict input validation, least-privilege database credentials, environment-based secrets, safe error responses, CORS allowlists, security headers, audit logging for privileged changes, dependency maintenance, backups and restore procedures.

Do not store payment-card details unless the organisation has explicitly approved and implemented the required compliance controls. Prefer provider-hosted or tokenised payment flows.

## 9. API conventions

- Version REST endpoints, for example `/api/v1`.
- Use consistent JSON request and response structures.
- Define validation and error response formats in OpenAPI.
- Apply authentication and resource-level authorisation to protected routes.
- Document pagination, filtering, sorting and idempotency where relevant.
- Keep public response DTOs separate from database models.

Detailed endpoint contracts belong to Task 4.

## 10. External integrations

| Integration | Required capability | Proposed boundary | Decisions outstanding |
|---|---|---|---|
| Payments | Initiation, verification, callbacks/webhooks, reconciliation | Payment provider adapter | Provider, fees, currency, refunds, webhook signature |
| Mapping/geolocation | Geocoding, distance/route estimates, delivery zones | Mapping provider adapter | Provider, coverage, pricing, location policy |
| Notifications | Email, SMS and/or push delivery | Notification provider adapter | Provider, channels, templates, retry policy |
| Media storage | Merchant/product images if required | Storage adapter | Provider, limits, access and retention |

Provider selection must be confirmed. Keep provider-specific payloads out of domain models and verify webhook signatures where supported.

## 11. Quality and testing strategy

Plan for unit tests, API integration tests, database migration/constraint tests, authorisation/security tests, provider adapter tests and end-to-end workflow tests. OpenAPI documentation should be checked against the implemented routes.

No test execution or runtime verification is claimed by this architecture document.

## 12. Review decisions required

1. Approve or replace the proposed technology stack.
2. Confirm modular-monolith architecture and module boundaries.
3. Confirm API conventions and authentication/session expectations.
4. Select or defer payment, mapping and notification providers.
5. Confirm merchant publication, product availability, order, payment, rider assignment and delivery rules.
6. Confirm hosting, secrets, backup and deployment requirements.
7. Review and approve this technical specification.

## 13. Status

This is a proposed technical specification submitted for review. It does not claim that architecture choices have been approved, implemented, deployed or tested.
