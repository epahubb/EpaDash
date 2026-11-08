# ADR-0001: Initial Backend Architecture

- **Status:** Proposed — approval pending
- **Date:** 2026-11-07
- **Decision owners:** EpaDash technical lead/team

## Context

EpaDash needs backend capabilities across accounts, merchant/product discovery, orders, payments, delivery, notifications and administration. Team conventions, hosting constraints and expected scale must be confirmed.

## Proposed decision

Start with a modular monolith using Node.js and TypeScript, Express.js, PostgreSQL and Prisma, with Zod validation, OpenAPI documentation, and Vitest/Supertest tests.

Integrate external providers through adapters rather than embedding provider-specific behaviour in domain services.

## Rationale

- Lower operational complexity than starting with microservices.
- Clear domain boundaries within one deployable service.
- PostgreSQL supports relational and transactional workflows.
- TypeScript provides static typing across service boundaries.
- OpenAPI gives frontend/backend teams a shared contract.

## Consequences

- Module boundaries and dependency rules must be maintained.
- A single deployment unit may eventually need to be split if independent scaling or ownership becomes necessary.
- The proposed stack must be checked against company standards before implementation.

## Open questions

- Is Express.js the company standard, or should NestJS be used?
- Which payment, mapping, notification and storage providers are approved?
- What are the hosting, observability, backup and deployment standards?
- What authentication/session approach does the frontend expect?

## Review note

This ADR records a proposal only. It is not approved until the technical lead reviews and accepts it.
