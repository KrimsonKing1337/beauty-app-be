import { z } from 'zod';

const nullableString = z.string().trim().nullable();
const nullableNumber = z.number().nullable();

export const createProcedureSchema = z.object({
  procedureName: z.string().trim().min(1, 'Название процедуры обязательно'),
  date: z.string(),
  place: nullableString,
  duration: nullableString,
  price: nullableNumber,
  beforeAfter: z.array(z.string().trim()).default([]),
  notes: nullableString,
});

export const updateProcedureSchema = createProcedureSchema.partial();

export const procedureIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateProcedureInput = z.infer<typeof createProcedureSchema>;
export type UpdateProcedureInput = z.infer<typeof updateProcedureSchema>;
export type ProcedureIdParamsInput = z.infer<typeof procedureIdParamsSchema>;
