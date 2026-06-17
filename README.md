# Code Review Task

The product is a B2B rental management platform used by several property/rental companies. Companies manage rental contracts, renewal conditions, signatures, payments, and internal admin workflows. End users can request contract renewals, pay for them through an external payment provider, and admins can review renewal requests in an internal dashboard.

## Feature Scope

The new flow should allow a customer to:

- request a renewal for an existing contract;
- receive a calculated renewal price;
- start payment through an external payment provider;
- continue the flow after payment provider webhooks update payment status.

The admin UI should allow admins to:

- see renewal requests;
- search/filter requests;
- approve selected renewal requests.

## Tech Context

The project is intentionally small, but it follows patterns commonly used in production apps:

- TypeScript;
- Node.js / Express-style route handlers;
- service and repository layers;
- external payment provider integration;
- React admin UI;
- TanStack Query for server state.

The code is not expected to be a complete runnable production system. Treat it as a PR slice that would be integrated into a larger existing application.

## Your Task

Please review the code as if this were a real production.

## Files To Review

- `src/backend/renewal-route.ts`
- `src/backend/renewal-service.ts`
- `src/backend/renewal-repository.ts`
- `src/backend/payment-provider.ts`
- `src/frontend/RenewalRequestsPage.tsx`

## Business Rules

- A contract can be renewed only by its owner.
- A contract must be active.
- Renewal price should be calculated on the backend.
- Payment provider webhooks may arrive later.
- Payment provider webhooks may arrive more than once.
- Admin UI can show many renewal requests.
- The system must not leak PII, secrets, or payment details in logs/API responses.
