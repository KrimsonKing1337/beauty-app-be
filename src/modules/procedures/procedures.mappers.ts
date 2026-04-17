import type { Procedure, ProcedureEntity } from './procedures.types';

export const mapProcedureToDto = (row: ProcedureEntity): Procedure => ({
  id: row.id,
  procedureName: row.procedure_name,
  date: new Date(row.date).toISOString(),
  place: row.place,
  duration: row.duration,
  price: row.price,
  beforeAfter: row.before_after,
  beforeImagePaths: row.before_image_paths ?? [],
  afterImagePaths: row.after_image_paths ?? [],
  notes: row.notes,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});
