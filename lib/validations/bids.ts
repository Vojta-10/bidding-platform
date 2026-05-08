import { z } from 'zod';

export const createBidSchema = (minAmount: number) =>
  z.object({
    amount: z
      .number({ message: 'Please enter a valid amount' })
      .positive('Bid must be positive')
      .gt(minAmount, `Bid must exceed $${minAmount.toLocaleString()}`),
  });

export type BidFormValues = z.infer<ReturnType<typeof createBidSchema>>;
