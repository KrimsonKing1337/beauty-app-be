import { z } from 'zod';

const nullableString = z.string().trim().nullable();
const nullableNumber = z.number().nullable();

const queryStringArraySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => String(item).split(','));
  }

  return String(value).split(',');
}, z.array(z.uuid()));

const nullableUuidFromQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return value;
}, z.uuid().nullable());

export const getProceduresQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum([
      'dateTime',
      'createdAt',
      'updatedAt',
      'procedureName',
      'price',
      'duration',
    ])
    .default('dateTime'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().default(''),
  typeId: nullableUuidFromQuerySchema.default(null),
  tagIds: queryStringArraySchema.default([]),
});

export const createProcedureSchema = z.object({
  procedureName: z.string().trim().min(1, 'Название процедуры обязательно'),
  dateTime: z.string(),
  place: nullableString,
  durationHours: nullableNumber,
  durationMinutes: nullableNumber,
  price: nullableNumber,
  beforeImagePaths: z.array(z.string().trim()).default([]),
  afterImagePaths: z.array(z.string().trim()).default([]),
  notes: nullableString,
  typeId: nullableString,
  tagIds: z.array(z.uuid()).default([]),
});

export const updateProcedureSchema = createProcedureSchema.partial();

export const procedureIdParamsSchema = z.object({
  id: z.uuid(),
});

export type GetProceduresQueryInput = z.infer<typeof getProceduresQuerySchema>;
export type CreateProcedureInput = z.infer<typeof createProcedureSchema>;
export type UpdateProcedureInput = z.infer<typeof updateProcedureSchema>;
export type ProcedureIdParamsInput = z.infer<typeof procedureIdParamsSchema>;
