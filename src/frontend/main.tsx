import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RenewalRequestsPage } from "./RenewalRequestsPage";
import "./styles.css";

const queryClient = new QueryClient();

const mockRenewals = [
  {
    id: "rr_1001",
    contractId: "contract_901",
    userId: "user_1",
    userEmail: "alex@example.com",
    status: "created",
    amountCents: 129900,
    currency: "USD",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rr_1002",
    contractId: "contract_902",
    userId: "user_2",
    userEmail: "maria@example.com",
    status: "paid",
    amountCents: 99900,
    currency: "USD",
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
] as const;

const originalFetch = window.fetch.bind(window);

window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;

  if (url === "/api/admin/renewal-requests") {
    return Response.json({ data: mockRenewals });
  }

  if (url.includes("/api/admin/renewal-requests/") && init?.method === "POST") {
    return Response.json({ ok: true });
  }

  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RenewalRequestsPage />
    </QueryClientProvider>
  </StrictMode>,
);
