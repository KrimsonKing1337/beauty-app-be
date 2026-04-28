import type { ProcedureType, ProcedureTypeRow } from './procedureTypes.types';

export const mapProcedureTypeRowToEntity = (
  row: ProcedureTypeRow,
): ProcedureType => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});
