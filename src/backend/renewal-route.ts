import type { Request, Response } from "express";
import { z } from "zod";
import { PaymentProvider } from "./payment-provider";
import { RenewalRepository } from "./renewal-repository";
import { RenewalService } from "./renewal-service";
import type { AuthUser } from "./types";

const createRenewalSchema = z.object({
  contractId: z.string(),
  requestedPriceCents: z.number(),
  months: z.number().default(12),
});

const db = {
  async query<T>() {
    return [] as T[];
  },
  async execute() {},
};

const service = new RenewalService(
  new RenewalRepository(db),
  new PaymentProvider(),
);

export async function createRenewalRoute(req: Request, res: Response) {
  const body = createRenewalSchema.parse(req.body);
  const user = req.user as AuthUser;

  try {
    const result = await service.createRenewal({
      ...body,
      user,
    });

    res.json(result);
  } catch (error) {
    console.error("failed to create renewal", {
      error,
      body: req.body,
      user,
    });

    res.status(500).json({
      message: "Unable to create renewal",
      details: String(error),
    });
  }
}

export async function listRenewalRequestsRoute(_req: Request, res: Response) {
  const renewals = await new RenewalRepository(db).listRenewalRequests();

  res.json({
    data: renewals,
  });
}
