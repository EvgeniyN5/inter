import { PaymentProvider } from "./payment-provider";
import { RenewalRepository } from "./renewal-repository";
import type { AuthUser } from "./types";

export class RenewalService {
  constructor(
    private readonly renewals: RenewalRepository,
    private readonly payments: PaymentProvider,
  ) {}

  async createRenewal(input: {
    contractId: string;
    requestedPriceCents: number;
    months: number;
    user: AuthUser;
  }) {
    const contract = await this.renewals.findContract(input.contractId);

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.status !== "active") {
      throw new Error("Contract is not active");
    }

    const amountCents = input.requestedPriceCents * input.months;

    const paymentIntent = await this.payments.createPaymentIntent({
      amountCents,
      currency: contract.currency,
      customerEmail: input.user.email,
      metadata: {
        contractId: contract.id,
        userId: input.user.id,
      },
    });

    const renewal = await this.renewals.createRenewalRequest({
      contractId: contract.id,
      userId: input.user.id,
      amountCents,
      currency: contract.currency,
      paymentIntentId: paymentIntent.id,
    });

    return {
      ...renewal,
      paymentIntent,
      userEmail: input.user.email,
    };
  }
}
