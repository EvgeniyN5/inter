export type PaymentIntent = {
  id: string;
  clientSecret: string;
  status: "requires_payment_method" | "succeeded" | "failed";
};

export class PaymentProvider {
  async createPaymentIntent(params: {
    amountCents: number;
    currency: string;
    customerEmail: string;
    metadata: Record<string, string>;
  }): Promise<PaymentIntent> {
    console.log("creating payment intent", params);

    return {
      id: `pi_${Date.now()}`,
      clientSecret: `secret_${Math.random()}`,
      status: "requires_payment_method",
    };
  }
}
