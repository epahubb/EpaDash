# Implementation and verification guide

## Prerequisites
- Node.js 22 LTS
- npm
- Docker Desktop with Linux containers enabled
- PostgreSQL 16 (provided by Docker Compose)

## Windows PowerShell setup

```powershell
# Extract the ZIP and open PowerShell in the EpaDash_Task3_Implementation folder.
Copy-Item .env.example .env
# Edit .env and set a private local SEED_DEMO_PASSWORD (12+ characters).
npm install
docker compose up -d db
npm run db:migration:generate
```

Review the generated SQL in `prisma/migrations/<timestamp>_initial_database/migration.sql`. If it is correct:

```powershell
npm run db:migrate
npm run prisma:generate
npm run db:seed
npm run typecheck
npm test
```

## Evidence to capture

Save the actual terminal output for:
1. `npx prisma validate`
2. `npx prisma migrate status`
3. `npm run db:migrate`
4. `npm run db:seed`
5. `npm run typecheck`
6. `npm test`

Also capture a PostgreSQL query showing all tables and indexes:

```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

For constraint evidence:

```sql
SELECT conrelid::regclass AS table_name, conname, contype
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY table_name, conname;
```

## Important safety notes
- Use only a disposable local database until the project lead approves the schema.
- Do not point the seed script at production.
- Do not run `docker compose down -v` unless you intend to permanently delete the local database volume.
- Review and commit generated migration SQL. The migration generator is a first-time bootstrap helper, not a substitute for migration review.
