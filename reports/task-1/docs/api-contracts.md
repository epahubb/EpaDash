# EpaDash Task 1 — Merchant Discovery and Product Catalogue API

**Base path:** `/api/v1`  
**Access:** Public read-only endpoints  
**Status:** Implementation starter; schema alignment and runtime verification pending.

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/merchants` | Search and paginate active public merchants |
| GET | `/merchants/{slug}` | Retrieve one public merchant profile |
| GET | `/merchants/{slug}/products` | List published products for a public merchant |
| GET | `/products` | Search and filter the public product catalogue |
| GET | `/products/{productId}` | Retrieve one published product |

## Query parameters

Merchant list:
- `q`: optional text search (name/description), max 100 characters
- `categoryId`: category UUID
- `page`: positive integer, default 1
- `limit`: positive integer, default 20, maximum 100
- `sort`: `relevance`, `name`, or `newest`

Product list adds:
- `merchantId`: merchant UUID
- `minPrice`, `maxPrice`: non-negative numeric bounds; minimum cannot exceed maximum

## Visibility policy

A merchant is public only when `status = ACTIVE` and `isPublic = true`.

A product is public only when:
1. `status = PUBLISHED`;
2. `isAvailable = true`; and
3. its parent merchant is `ACTIVE` and `isPublic = true`.

These conditions are applied at the database query boundary, not merely hidden in the UI. A draft, archived, unavailable, suspended-merchant or private-merchant product must not appear in list or detail responses.

## Response conventions

Collection:
```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 20, "totalItems": 0, "totalPages": 0 }
}
```

Single resource:
```json
{ "data": { "id": "uuid", "name": "Example" } }
```

Errors use stable codes:
- `VALIDATION_ERROR` — malformed query, slug or ID
- `NOT_FOUND` — resource is absent or not publicly visible
- `INTERNAL_ERROR` — unexpected failure (handled by the application's central error middleware)

## Public-field allowlist

Merchant responses may expose public business name, slug, description, logo/cover image, public contact/address, categories, weekly operating schedule and active delivery-zone labels.

Product responses may expose name, slug, SKU if approved for public display, description, price, currency, image, public availability, merchant summary and categories.

Never expose owner/user IDs, password or authentication data, KYC evidence, internal moderation notes, private delivery-zone geometry, supplier cost, internal margin, payment credentials, raw inventory records or audit metadata.

## Important availability limitations

- The current design includes weekly operating hours but does not define merchant timezone or holiday overrides. This implementation returns the schedule but does **not** claim `isOpenNow`.
- Delivery eligibility is destination-specific. The current public profile may list active delivery-zone labels, but it cannot truthfully return `deliveryAvailable` for a customer without a destination and approved zone-intersection logic.
- `inStock` is derived as `quantityOnHand - quantityHeld > 0` when inventory exists. The product schema must decide how to treat products with no inventory row; this starter returns `null` when stock is unknown.

## Pagination and sorting

Pagination is one-based. `limit` is capped at 100. Results use stable ordering to avoid arbitrary ordering for tied names. `relevance` is currently a deterministic name/ID ordering, not a ranked full-text search. Add PostgreSQL full-text search/trigram indexes only after query volume and language requirements are understood.
