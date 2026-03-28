import { z } from 'zod';

export const ProcedureDtoSchema = z.object({
  id: z.string(),
  procedureName: z.string(),
  date: z.string(),
  place: z.string().nullable(),
  duration: z.string().nullable(),
  price: z.number().nullable(),
  beforeAfter: z.array(z.string()),
  notes: z.string().nullable(),
  createdAt: z.string(),
});
