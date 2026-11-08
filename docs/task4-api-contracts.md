# EpaDash — Task 4: API Contracts and Business Workflows

**Status:** Contract design prepared; implementation and integration review pending  
**Version:** 0.1 — draft baseline for engineering review

## 1. Purpose
This specification defines proposed HTTP API contracts and core workflows so backend and frontend developers can agree on endpoints, payloads, validation, authentication, authorization and workflow sequencing. It is a design deliverable, not evidence that endpoints have been implemented, deployed or tested.

## 2. API conventions
- Base path: `/api/v1`; JSON request/response bodies; HTTPS in deployed environments.
- IDs: UUID strings. Timestamps: ISO 8601 UTC.
- Money: decimal strings plus ISO 4217 currency code. Proposed default is GHS; confirm before production.
- Pagination: `page` (default 1), `limit` (default 20, maximum 100).
- Protected routes use bearer access tokens. Refresh-token transport/storage must be finalized; browser refresh should use secure HttpOnly/SameSite cookies.
- Payment webhooks require provider-specific signature verification and may require raw-body handling.

## 3. Standard response envelopes
Success: `{"data": {}, "meta": {"requestId": "uuid"}}`  
Collection: `{"data": [], "pagination": {"page": 1, "limit": 20, "totalItems": 0, "totalPages": 0}, "meta": {"requestId": "uuid"}}`  
Error: `{"error": {"code": "VALIDATION_ERROR", "message": "Invalid request.", "details": [{"field": "email", "message": "Invalid email."}], "requestId": "uuid"}}`

Use stable machine-readable error codes. Never expose stack traces, SQL, secrets, password hashes, access tokens or provider credentials.

## 4. Roles and access
- `CUSTOMER`: own profile, addresses, orders and notifications.
- `MERCHANT`: own merchant profile, catalogue and permitted fulfilment actions.
- `RIDER`: assigned deliveries and permitted delivery updates.
- `ADMIN`: administrative operations subject to explicit permissions and audit logging.

Enforce both role permission and resource ownership/assignment on every protected route. Multi-role accounts are subject to product policy.

## 5. Authentication and users
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register customer |
| POST | `/auth/login` | Public | Authenticate and issue credentials |
| POST | `/auth/refresh` | Refresh credential | Rotate/renew access credential |
| POST | `/auth/logout` | Authenticated | Revoke current refresh session |
| POST | `/auth/password/forgot` | Public | Start recovery without account enumeration |
| POST | `/auth/password/reset` | Reset token | Set new password |
| GET | `/users/me` | Authenticated | Read own profile |
| PATCH | `/users/me` | Authenticated | Update permitted own fields |

Registration validates identity uniqueness, password policy and required consent. Hash passwords with a modern password-hashing algorithm. Login/recovery responses must not reveal whether an account exists. Reset tokens must be expiring, single-use and stored securely (preferably hashed).

## 6. Merchant discovery
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/merchants` | Public | Search/list active public merchants |
| GET | `/merchants/{merchantId}` | Public | Public merchant profile |
| GET | `/merchants/{merchantId}/products` | Public | Published products for merchant |

Suggested filters: `q`, `categoryId`, `isOpen`, `deliveryAvailable`, `page`, `limit`, `sort`. Return only active, publicly visible merchants. Operating status is computed from operating hours and merchant time zone. Delivery availability depends on approved coverage and availability rules.

## 7. Product catalogue
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/products` | Public | Search/filter published products |
| GET | `/products/{productId}` | Public | Published product details |
| POST | `/merchant/products` | Merchant | Create product in own catalogue |
| PATCH | `/merchant/products/{productId}` | Owning merchant | Update permitted fields |
| PATCH | `/merchant/products/{productId}/publication` | Owning merchant | Publish/unpublish |

Suggested filters: `q`, `merchantId`, `categoryId`, `minPrice`, `maxPrice`, `available`, `page`, `limit`, `sort`. Public catalogue responses exclude draft, archived, suspended or unpublished products. Prices use decimal strings and currency codes.

## 8. Orders and payments
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/orders` | Customer | Create order |
| GET | `/orders` | Scoped caller | List orders visible to caller |
| GET | `/orders/{orderId}` | Authorized participant | Order details |
| POST | `/orders/{orderId}/cancel` | Policy-dependent | Request/carry out cancellation |
| POST | `/orders/{orderId}/payments` | Customer | Initiate payment |
| POST | `/payments/webhooks/{provider}` | Verified provider | Receive payment event |

Order creation validates merchant status, product publication, current price, stock, delivery eligibility and address ownership. The server calculates totals; client totals are never trusted. Order creation and stock reservation should be atomic or use a documented reservation/compensation process. Payment success is determined by verified provider webhook or server-to-server verification, never by client assertion. Webhooks must be signature-verified and idempotent.

## 9. Rider and delivery
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/rider/deliveries` | Rider | Assigned deliveries |
| GET | `/deliveries/{deliveryId}` | Authorized participant | Delivery details |
| POST | `/admin/deliveries/{deliveryId}/assign` | Admin/dispatcher | Assign rider |
| PATCH | `/rider/deliveries/{deliveryId}/status` | Assigned rider | Permitted status transition |
| POST | `/rider/deliveries/{deliveryId}/tracking-events` | Assigned rider | Submit tracking event subject to privacy rules |

Reject updates from riders not assigned to the delivery. Validate transitions through a central state machine. Tracking precision, retention, consent and access rules require privacy/product approval.

## 10. Notifications and administration
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/notifications` | Authenticated | List caller notifications |
| PATCH | `/notifications/{notificationId}/read` | Owner | Mark own notification read |
| PATCH | `/admin/users/{userId}/status` | Authorized admin | Change account status |
| GET | `/admin/audit-logs` | Authorized admin | Search audit events |

Audit administrative, financial, order-state and delivery-assignment changes with actor, action, target, timestamp and non-sensitive context.

## 11. Validation and security requirements
- Validate IDs, query parameters, request bodies and enum values at the API boundary.
- Reject negative prices, quantities, fees and totals; enforce maximum page size and search length.
- Recalculate totals server-side; enforce resource ownership and role permissions.
- Rate-limit registration, login, password recovery and sensitive routes.
- Use idempotency keys for operations where retries could duplicate effects.
- Verify webhook signatures and deduplicate provider events.
- Use HTTPS, short-lived access credentials, refresh rotation/revocation and secure password hashing.
- Redact personal/payment-sensitive data from logs; use request IDs and structured logs.
- Use database transactions for order, inventory and payment state changes.

## 12. Business workflows

### A. Registration and login
1. Client submits registration details.
2. API validates fields and policy requirements.
3. Password is hashed and account is created with initial status.
4. If required, send verification challenge and restrict access until verified.
5. Login checks credentials and account status, then issues credentials.
6. Logout revokes the refresh session.

### B. Merchant and product browsing
1. Client searches merchants with optional text/category/location context.
2. API returns active public merchants and computed open/delivery indicators where supported.
3. Client requests a merchant's published products or global catalogue.
4. API applies publication, category, price and availability filters.

### C. Place order and pay
1. Customer submits merchant, items, quantities and delivery address.
2. API verifies ownership, merchant eligibility, publication, stock and delivery eligibility.
3. API calculates prices, fees and total using trusted server-side data.
4. API creates order and reserves stock atomically or through a defined reservation workflow.
5. Customer initiates payment.
6. Provider processes payment; API verifies signed webhook or server-side status.
7. API records transaction and advances order state only after verified success.
8. On failure/expiry/cancellation, release reserved stock according to approved compensation rules.

### D. Assign and complete delivery
1. Eligible paid/confirmed order becomes ready for fulfilment.
2. Dispatcher assigns an available rider.
3. Rider acknowledges assignment according to policy.
4. Rider submits allowed status/tracking events.
5. Customer and merchant receive relevant notifications.
6. Delivery completion is recorded and order reaches delivered state.

## 13. Suggested state transitions
Suggested order progression: `PENDING_PAYMENT → PAID → CONFIRMED → PREPARING → READY_FOR_PICKUP → OUT_FOR_DELIVERY → DELIVERED`. Possible terminal alternatives: `CANCELLED`, `PAYMENT_FAILED`, `REFUNDED`.

Suggested delivery progression: `PENDING_ASSIGNMENT → ASSIGNED → ACCEPTED → PICKED_UP → IN_TRANSIT → DELIVERED`. Alternatives may include `REJECTED`, `FAILED`, `CANCELLED`, `RETURNED`.

These are proposals, not confirmed product rules. Define allowed transitions, actor permissions and audit events; do not allow arbitrary status changes.

## 14. Assumptions requiring confirmation
1. Customer self-registration is supported; merchant/rider/admin accounts may require invitation or approval.
2. One order belongs to one merchant; one delivery record per order (current database design assumptions).
3. GHS is the proposed default currency; multi-currency is unconfirmed.
4. Payment, mapping and notification providers are not selected here.
5. Merchant operating hours use the merchant's configured time zone.
6. Delivery coverage and fees depend on a business policy not yet confirmed.
7. Cancellation, refund, stock reservation and rider reassignment rules require business approval.

## 15. Review and implementation checklist
- [ ] Frontend/backend agree on endpoint names and payloads.
- [ ] Product owner confirms business rules and state transitions.
- [ ] Security review confirms token transport, RBAC and webhook verification.
- [ ] Payment, mapping and notification providers are selected.
- [ ] OpenAPI contract is reviewed and versioned.
- [ ] Endpoint implementation adds request validation and automated contract tests.
- [ ] API documentation is published from the approved OpenAPI file.
- [ ] Integration tests cover order/payment/delivery workflows.

**Completion statement:** Task 4 contract design is prepared as a baseline. Endpoint implementation, integration testing, stakeholder approval and publication remain outstanding.
