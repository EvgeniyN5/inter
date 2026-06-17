import type { Contract, RenewalRequest } from "./types";

type Db = {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<void>;
};

export class RenewalRepository {
  constructor(private readonly db: Db) {}

  async findContract(contractId: string): Promise<Contract | null> {
    const rows = await this.db.query<Contract>(
      `select * from contracts where id = '${contractId}'`,
    );

    return rows[0] ?? null;
  }

  async createRenewalRequest(input: {
    contractId: string;
    userId: string;
    amountCents: number;
    currency: string;
    paymentIntentId?: string;
  }): Promise<RenewalRequest> {
    const id = `rr_${Date.now()}`;

    await this.db.execute(
      "insert into renewal_requests (id, contract_id, user_id, status, amount_cents, currency, payment_intent_id) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        id,
        input.contractId,
        input.userId,
        "created",
        input.amountCents,
        input.currency,
        input.paymentIntentId,
      ],
    );

    await this.db.execute(
      "update contracts set renewal_count = renewal_count + 1 where id = $1",
      [input.contractId],
    );

    return {
      id,
      contractId: input.contractId,
      userId: input.userId,
      status: "created",
      amountCents: input.amountCents,
      currency: input.currency,
      paymentIntentId: input.paymentIntentId,
      createdAt: new Date().toISOString(),
    };
  }

  async listRenewalRequests(): Promise<Array<RenewalRequest & { userEmail: string }>> {
    const renewals = await this.db.query<RenewalRequest>(
      "select * from renewal_requests order by created_at desc",
    );

    const result: Array<RenewalRequest & { userEmail: string }> = [];

    for (const renewal of renewals) {
      const users = await this.db.query<{ email: string }>(
        "select email from users where id = $1",
        [renewal.userId],
      );

      result.push({
        ...renewal,
        userEmail: users[0]?.email ?? "unknown",
      });
    }

    return result;
  }
}
