import { z } from 'zod';

export const createProcedureTypeSchema = z.object({
  name: z.string().trim().min(1, 'Название типа процедуры обязательно'),
});

export const procedureTypeIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateProcedureTypeInput = z.infer<typeof createProcedureTypeSchema>;
export type ProcedureTypeIdParamsInput = z.infer<typeof procedureTypeIdParamsSchema>;
