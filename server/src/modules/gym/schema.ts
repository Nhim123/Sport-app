import { z } from 'zod';

export const createDayPassBody = z.object({
  kind: z.enum(['personal', 'club']).default('personal'),
  brand: z.string().min(1),
  priceLabel: z.string().min(1),
  validDate: z.string().min(1),
  branch: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
});
export type CreateDayPassBody = z.infer<typeof createDayPassBody>;
