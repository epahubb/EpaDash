# EpaDash backend starter

This backend uses the PostgreSQL and Prisma baseline from Task 3. The
[architecture specification](docs/architecture/backend-technical-spec.md)
describes the broader Express backend. Task 1 and Task 2 source snapshots
are kept with their task reports. The [OpenAPI draft](docs/api/openapi.yaml)
marks the routes currently implemented.

## Local database setup

Use the Node release in `.nvmrc` and Docker with Compose. Copy `.env.example` to
`.env` and verify that `DATABASE_URL` points to a fresh local database. The
included Compose service uses port 5432. If that port is already occupied,
configure a different local database and update the connection string before
running checks.

```sh
npm ci
npm run db:up
npm run prisma:generate
npm run db:validate
npm run db:migrate
npm run db:status
npm run typecheck
npm test
```

Wait for PostgreSQL to become healthy before deploying migrations. The
integration tests create and delete fixtures. Use a disposable database and
run the optional seed only when demo data is needed. Use `npm run db:down` to stop
the Compose service. The historical migration helper is preserved in `scripts/`.

See the [verification record](docs/reports/task-3/starter-verification.md) for
executed checks and the [development workflow](docs/workflows/development-workflow.md)
for assignment branches and submission.

## Merchant onboarding API

Set `ACCESS_TOKEN_SECRET` to a randomly generated secret of at least 32
characters in your local `.env`. Run `npm run dev` or `npm run build` followed by
`npm start`. The HTTP API listens on port 3000 by default.

Use an existing active `MERCHANT` account and an active `ADMIN` account. The
optional development seed can provision local demo accounts. Send an email and
password to `POST /api/v1/auth/login` and use the returned `data.accessToken` as
an Authorization bearer token. Tokens expire after 15 minutes. Authorization
uses the account status and roles stored in PostgreSQL. The demo merchant
already has a profile. Use a separate active merchant account without a
profile to submit a new application.

| Method and path | Behavior |
| --- | --- |
| `GET /health` | Check that the HTTP process is responding. |
| `POST /api/v1/merchants` | Submit a private, pending application with a name and slug. |
| `GET /api/v1/merchant/profile` | Read the signed-in merchant's profile and hours. |
| `PATCH /api/v1/merchant/profile` | Update permitted fields on the signed-in merchant's profile. |
| `PUT /api/v1/merchant/hours` | Replace the schedule. Sunday is day 0. Open days require increasing HH:mm times within the day. |
| `PATCH /api/v1/merchant/status` | Set `acceptsOrders`. Only an active merchant can enable it. |
| `PATCH /api/v1/admin/merchants/{merchantId}/status` | Approve or suspend a merchant as an administrator. Suspension disables order acceptance and public visibility. |

Express 5 handles HTTP routing and async errors. Zod validates requests,
jsonwebtoken signs and verifies access tokens, and express-rate-limit limits
failed sign-in attempts per IP. Password verification uses the existing Argon2
dependency. The API tests use Node's built-in HTTP client.

## Merchant product catalogue

Use the merchant bearer token on `/api/v1/merchant/products` to list or
create products and on `/api/v1/merchant/products/{productId}` to read,
edit, or archive a product. Send prices as decimal strings such as
`"24.50"`. New products are drafts with a zero-stock inventory record.
Use the `/status` and `/availability` subroutes to publish, unpublish, or
change availability. Publishing requires an approved merchant. Archived
products are read-only and omitted from the default list. Use
`?status=ARCHIVED` to include them in a dedicated list.

Merchants can browse the shared taxonomy at `/api/v1/merchant/product-categories`
and set `categoryIds` on their products. Administrators create, rename, and
delete categories at `/api/v1/admin/product-categories`. Categories in use
or with child categories are protected from deletion.

## Merchant inventory

Under `/api/v1/merchant/products/{productId}/inventory`, use `GET` to
read current stock and `PUT` to set `quantityOnHand` and optionally
`lowStockLevel`. Use `POST /adjustments` for a signed `quantityDelta`
and optional note, and `GET /movements` for paginated movement history.
Available quantity is on-hand stock minus reserved stock.

Send an `Idempotency-Key` on stock writes. Retry the same operation and body
with the same key to recover its original result. Use a new key for a new
operation. The forward migration adds per-product request records so delayed
retries remain safe after later updates, including threshold-only updates
that do not create stock movements.

## Product images

Configure a private S3-compatible bucket with `STORAGE_BUCKET`,
`STORAGE_ACCESS_KEY`, and `STORAGE_SECRET_KEY`. Set `STORAGE_REGION` to the
bucket region and `STORAGE_ENDPOINT` for a custom provider. The provider
must support path-style requests, SigV4, conditional PUT, SHA-256 upload
checksums, checksums on HEAD requests, and byte-range reads. Grant the application object read
and write access under `product-images/`. For browser uploads, configure
bucket CORS to allow PUT and the `Content-Type`, `If-None-Match`, and `x-amz-checksum-sha256`
headers from your frontend origin. Keep the bucket private.

1. Send `productId`, `contentType`, `sizeBytes`, and base64-encoded
   `checksumSha256` to `POST /api/v1/uploads/presign` as the product owner.
   JPEG, PNG, and WebP files up to 5 MiB are supported.
2. PUT the original file bytes to the returned URL with the returned
   headers. The HTTP client must send the file length in `Content-Length`.
   Upload URLs expire after five minutes. Once a file is uploaded, the same URL cannot replace it.
3. Call `POST /api/v1/merchant/products/{productId}/images/{imageId}/complete`
   within ten minutes of issuance. The API checks the stored size, checksum,
   content type, and file signature before registering the image.
4. Use `GET /api/v1/merchant/products/{productId}/images` to list registered
   images as their owner, or add `/{imageId}` to obtain a 60-second read URL.
   The corresponding public routes under `/api/v1/products/{productId}/images`
   are available for published, available products of active public merchants.
   Previously issued URLs remain usable until they expire.

The API uses `aws4fetch` to sign S3 requests and the forward migration to
store image metadata and pending uploads. Expired tickets stop counting
toward the 20-image limit. Reconcile expired unregistered objects when
setting up storage cleanup. Keep an actual storage verification run separate
from the default test suite by pointing `EPADASH_TEST_S3_ENDPOINT`,
`EPADASH_TEST_S3_ACCESS_KEY`, and `EPADASH_TEST_S3_SECRET_KEY` at a disposable
S3-compatible server. The tests create a scratch bucket.
