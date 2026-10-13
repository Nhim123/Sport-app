import { z } from 'zod';

// Zod schemas cho "venues" (docs/openapi.yaml: GET /venues, /venues/{id}/schedule).
export const listVenuesQuery = z.object({
  sport: z.enum(['pickle', 'gym', 'football']).optional(),
  q: z.string().trim().min(1).optional(),
  district: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListVenuesQuery = z.infer<typeof listVenuesQuery>;

export const scheduleQuery = z.object({
  date: z.string().trim().min(1).optional(),
});
export type ScheduleQuery = z.infer<typeof scheduleQuery>;
