import { z } from 'zod';

// Zod schemas cho domain "auth" — điền theo docs/openapi.yaml.
export const authQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type AuthQuery = z.infer<typeof authQuery>;
