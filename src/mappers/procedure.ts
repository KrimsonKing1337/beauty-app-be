import { Procedure } from '../repositories/procedures';
import { ProcedureDto } from '../dto/procedure';

export const mapProcedureToDto = (row: Procedure): ProcedureDto => ({
  id: row.id,
  procedureName: row.procedure_name,
  date: row.date,
  place: row.place,
  duration: row.duration,
  price: row.price,
  beforeAfter: row.before_after,
  notes: row.notes,
  createdAt: row.created_at,
});
