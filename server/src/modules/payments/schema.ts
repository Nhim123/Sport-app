import { z } from 'zod';

export const createPaymentBody = z.object({
  purpose: z.enum(['court', 'daypass', 'club']),
  title: z.string().min(1),
  brand: z.string().min(1),
  priceLabel: z.string().min(1),
  refType: z.string().optional(),
  refId: z.string().optional(),
  fixedTime: z.string().optional(),
});
export type CreatePaymentBody = z.infer<typeof createPaymentBody>;
