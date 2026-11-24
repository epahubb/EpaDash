# Task 1 Integration Checklist — Must Complete Before Runtime Use

The Task 3 database document is a conceptual model, not a final field-by-field Prisma contract. This starter uses the following field/relation names; reconcile them with the actual shared schema before running `prisma generate`.

## Merchant model fields assumed
- `id`, `name`, `slug`, `description`
- `status` enum containing `ACTIVE`
- `isPublic` boolean
- `logoUrl`, `coverImageUrl`, `phone`
- `addressLine`, `city`, `region`, optional `latitude`, `longitude`
- `createdAt`
- relation `categories`, with nested `category` (`id`, `name`, `slug`)
- relation `operatingHours` (`dayOfWeek`, `opensAt`, `closesAt`, `isClosed`)
- relation `deliveryZones` (`isActive`, `id`, `name`, `description`)

## Product model fields assumed
- `id`, `merchantId`, `name`, `slug`, `sku`, `description`
- `status` enum containing `PUBLISHED`
- `isAvailable` boolean
- `price` decimal, `currency`, `imageUrl`, `createdAt`
- relation `merchant` (`status`, `isPublic`, `id`, `name`, `slug`)
- relation `categories`, with nested `category` (`id`, `name`, `slug`)
- optional relation `inventory` (`quantityOnHand`, `quantityHeld`)

## Category join relations
The repository assumes relation names `categories` on Merchant and Product and a nested `category` relation. The database design describes join models `MerchantCategoryLink` and `ProductCategoryLink`; actual Prisma relation names may differ. Change only the repository query shapes to match the approved Prisma schema.

## Inventory policy
Confirm whether every sellable product must have an Inventory row. If stock tracking is mandatory, enforce it and make the `inStock` field boolean. If not, define whether missing inventory means unlimited stock or unknown stock. Ensure held quantity never exceeds on-hand quantity and reserve/release stock transactionally during order creation/cancellation.

## Operating hours and time zone
Add a merchant IANA timezone (for example `Africa/Accra`) and holiday/special-hours model before implementing reliable `isOpenNow`. Confirm overnight schedules and daylight-saving behaviour for other supported regions.

## Delivery availability
A zone label is not enough to decide whether a customer can receive delivery. Define accepted destination input (address ID or coordinates), zone representation (polygon/radius), spatial query strategy (PostGIS recommended for polygon intersection), and edge-case rules before returning a boolean.

## Mounting
In the existing Express application:
```ts
import { createDiscoveryRouter } from "./modules/discovery";

app.use("/api/v1", createDiscoveryRouter(prisma));
```
Do not create a second Express server if Task 2 already owns `app.ts` and `server.ts`.

## Dependencies
The Task 2 starter already proposes Express, Zod and Prisma. Merge these files into that application and its dependency versions rather than maintaining duplicate package manifests.

## Security and operational checks
- Public routes must be rate-limited at the application or gateway layer.
- Apply response caching only with correct invalidation when merchant/product publication, status, price or availability changes.
- Do not leak private merchant/product records through 404/empty-list distinctions.
- Add request IDs and structured error logging in the shared application middleware.
- Review whether public phone/address fields are approved for display.
