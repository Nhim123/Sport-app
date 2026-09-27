import { z } from 'zod';

export const scheduleQuery = z.object({
  week: z.string().trim().min(1).optional(),
});
export type ScheduleQuery = z.infer<typeof scheduleQuery>;
