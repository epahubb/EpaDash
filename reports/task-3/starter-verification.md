# Local starter verification

Verified on 23 November 2026 using Node.js 24.21.0, npm 11.19.0, Prisma
6.19.0, Vitest 3.2.4, and disposable PostgreSQL 16 Docker containers bound
to randomly assigned loopback ports.

| Check | Result |
| --- | --- |
| `npm ci` | Installed the locked dependencies. |
| `npm run prisma:generate` | Generated Prisma Client 6.19.0. The engine download failed, so verification used the matching binaries already installed in the original Task 3 package. |
| `npm run db:validate` | Schema valid. |
| `npm run db:migrate` and `npm run db:status` | Applied `20261123061803_initial_database` to a fresh database in each layout. Prisma reported the schema up to date. |
| `npm run typecheck` | Passed before and after relocating services and tests. |
| Original layout, `npm test -- --configLoader runner` | 6 files passed, 10 tests passed. |
| Consolidated layout, `npm test` | 6 files passed, 10 tests passed. |
| Development seed | Preserved. The integration suites create their own fixtures, so the seed was skipped. |

The Task 1 and Task 2 unit tests remain in the source snapshots. The active
Vitest configuration discovers tests under `tests/`. The
[original task evidence](test-evidence.md) records the earlier preparation status.
