import { z } from 'zod';

// Zod schemas cho domain "users" — điền theo docs/openapi.yaml.
export const usersQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type UsersQuery = z.infer<typeof usersQuery>;
