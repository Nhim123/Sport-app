import { z } from 'zod';

export const listClubsQuery = z.object({
  sport: z.enum(['pickle', 'gym', 'football']).optional(),
  q: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListClubsQuery = z.infer<typeof listClubsQuery>;

export const createClubBody = z.object({
  name: z.string().min(1),
  sports: z.array(z.enum(['pickle', 'gym', 'football'])).min(1),
  note: z.string().optional(),
});
export type CreateClubBody = z.infer<typeof createClubBody>;

export const joinClubBody = z.object({ code: z.string().min(1) });
export type JoinClubBody = z.infer<typeof joinClubBody>;
