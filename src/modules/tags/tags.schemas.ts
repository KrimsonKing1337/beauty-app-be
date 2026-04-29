import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().trim().min(1, 'Название тэга обязательно'),
});

export const tagIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type TagIdParamsInput = z.infer<typeof tagIdParamsSchema>;
