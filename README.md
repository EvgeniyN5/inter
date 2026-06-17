## Files

- `src/backend/renewal-route.ts`
- `src/backend/renewal-service.ts`
- `src/backend/renewal-repository.ts`
- `src/backend/payment-provider.ts`
- `src/frontend/RenewalRequestsPage.tsx`

## Context

Business rules:

- A contract can be renewed only by its owner.
- A contract must be active.
- Renewal price should be calculated on the backend.
- Payment provider webhooks may arrive later and may arrive more than once.
- Admin UI can show many renewal requests.
- The system must not leak PII or payment details in logs/API responses.
