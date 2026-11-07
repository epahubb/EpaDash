# Development seed-data plan

Use fake, non-personal development records only. Never put production credentials or real customer information in seeds.

Suggested seed order:
1. Product categories (e.g. Groceries, Meals, Drinks) and merchant categories (e.g. Restaurant, Grocery).
2. Four clearly fake user accounts with roles CUSTOMER, MERCHANT, RIDER and ADMIN.
3. One demo merchant with `status=ACTIVE`, `isPublic=true`, `acceptsOrders=true`.
4. One draft product and two published demo products with Inventory rows.
5. One demo customer Address and one example Order with OrderItems for local workflow tests.

Do not seed real passwords. For local-only accounts, use a documented development password supplied through environment variables, hash it with the same password service as registration, and ensure the seed cannot run in production by default.
