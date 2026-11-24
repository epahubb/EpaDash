# ADR-0001 Local backend starter baseline

## Context

Tasks 1 through 4 arrived as separate local packages. Task 3 contains the complete
Prisma schema, migration SQL, database services, and PostgreSQL integration tests.
The Task 1 catalogue queries and the Task 2 Express application were written
against earlier schema assumptions.

## Decision

Use Task 3 as the executable baseline and preserve its locked dependency set and
migration history. Keep the Task 1 and Task 2 code as source snapshots during
consolidation. Use Express when integrating the HTTP application. Keep the Task 4
contract in draft until the overlapping catalogue paths and response shapes are
reviewed.

## Consequences

The starter runs database validation and tests without requiring a merged HTTP
application. Future work must reconcile the Prisma relation and field names before
mounting existing routes. Keep local starter history independent until a team
repository destination and base branch are confirmed.
