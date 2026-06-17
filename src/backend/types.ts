export type UserRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  role: UserRole;
  email: string;
};

export type ContractStatus = "draft" | "active" | "cancelled" | "expired";

export type RenewalStatus = "created" | "paid" | "failed";

export type Contract = {
  id: string;
  userId: string;
  status: ContractStatus;
  monthlyPriceCents: number;
  currency: "USD" | "EUR";
  renewalCount: number;
};

export type RenewalRequest = {
  id: string;
  contractId: string;
  userId: string;
  status: RenewalStatus;
  amountCents: number;
  currency: string;
  paymentIntentId?: string;
  createdAt: string;
};
