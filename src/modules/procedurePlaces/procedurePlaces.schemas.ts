import { z } from 'zod';

export const createProcedurePlaceSchema = z.object({
  name: z.string().trim().min(1, 'Название места обязательно'),
});

export const procedurePlaceIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateProcedurePlaceInput = z.infer<typeof createProcedurePlaceSchema>;
export type ProcedurePlaceIdParamsInput = z.infer<typeof procedurePlaceIdParamsSchema>;
