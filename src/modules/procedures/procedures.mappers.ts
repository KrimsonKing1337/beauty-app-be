import { Procedure, ProcedureEntity } from './procedures.types';

export const mapProcedureToDto = (row: ProcedureEntity): Procedure => ({
  id: row.id,
  procedureName: row.procedure_name,
  date: new Date(row.date).toISOString(),
  place: row.place,
  duration: row.duration,
  price: row.price,
  beforeAfter: row.before_after,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
