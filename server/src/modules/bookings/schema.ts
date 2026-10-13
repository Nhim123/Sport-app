import { z } from 'zod';

export const listBookingsQuery = z.object({
  status: z.enum(['upcoming', 'past']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListBookingsQuery = z.infer<typeof listBookingsQuery>;

export const createBookingBody = z.object({
  sport: z.enum(['pickle', 'gym', 'football']),
  venueName: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  priceLabel: z.string().optional(),
  coach: z.string().optional(),
});
export type CreateBookingBody = z.infer<typeof createBookingBody>;
