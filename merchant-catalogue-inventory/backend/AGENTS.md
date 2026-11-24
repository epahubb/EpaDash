# EpaDash backend agent instructions

These instructions apply to Codex and OpenCode.

## Architecture

Use Node.js, strict TypeScript, Express for the HTTP application, PostgreSQL,
and Prisma. Read the architecture specification, relevant ADRs, and assignment
criteria. Check generated Prisma types and mounted routes against draft contracts.
Keep Express composition in `src/app.ts` and startup in `src/server.ts` when the
HTTP application is integrated. Validate requests at the boundary. Enforce role
and ownership rules and keep transaction boundaries in domain services.

## Inspect and protect local work

Read applicable instructions, then run `git status --short --branch`. Check the
current branch, remote destination, and working and staged diffs. Trace callers,
tests, schema, and migrations before editing. Preserve existing local changes.
Work on a local branch authorized for the assignment. Get explicit approval
before destructive actions, history changes, database resets, or cross-module
changes. Explain the affected consumers and data. Obtain authorization before
committing, pushing, merging, or opening a PR.

## Protect environments and migration history

Keep local environment files, credentials, connection strings, and private data
out of commits and logs. Document variables with example values in
`.env.example`. Verify database targets before running commands that can change
data. Use disposable local PostgreSQL for integration tests. Preserve existing
migration paths and SQL. Use reviewed forward migrations and document schema
and dependency decisions in `docs/decisions/`.

## Verify and hand off

Read the package scripts on the current branch. For the database baseline, run
`npm run prisma:generate`, `npm run db:validate`, `npm run db:migrate`,
`npm run db:status`, `npm run typecheck`, and `npm test` against a disposable
database. Run the seed only when needed. For HTTP changes, also verify the
build, server startup, and affected routes once those scripts exist.

Preserve assertions and prior test evidence. Record the commands, results, and
blocked checks in the task report. Before an authorized commit, check
`git status --short`, `git diff`, `git diff --cached`, `git diff --check`,
and `git diff --cached --check`. Confirm the staged files match the assignment,
contain no secrets or generated dependencies, and preserve migration history.
Prepare the acceptance-criteria summary and evidence for the user's GitHub PR
and work-account submission.
