import { z } from 'zod';

export const listMatchesQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListMatchesQuery = z.infer<typeof listMatchesQuery>;

export const createMatchBody = z.object({
  title: z.string().min(1),
  venue: z.string().min(1),
  level: z.enum(['Trung cap', 'Moi trinh do', 'Nang cao']),
  capacity: z.coerce.number().int().positive(),
  note: z.string().optional(),
});
export type CreateMatchBody = z.infer<typeof createMatchBody>;
