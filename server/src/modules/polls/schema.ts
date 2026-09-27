import { z } from 'zod';

export const listPollsQuery = z.object({
  clubId: z.string().min(1),
});
export type ListPollsQuery = z.infer<typeof listPollsQuery>;

export const createPollBody = z.object({
  clubId: z.string().min(1),
  title: z.string().min(1),
  note: z.string().optional(),
  dayKey: z.string().optional(),
  options: z.array(z.string().min(1)).min(2),
  allowMultiple: z.boolean().optional(),
  allowAddOption: z.boolean().optional(),
  anonymous: z.boolean().optional(),
  hideResults: z.boolean().optional(),
});
export type CreatePollBody = z.infer<typeof createPollBody>;

export const voteBody = z.object({ optionIds: z.array(z.string().min(1)).min(1) });
export type VoteBody = z.infer<typeof voteBody>;
