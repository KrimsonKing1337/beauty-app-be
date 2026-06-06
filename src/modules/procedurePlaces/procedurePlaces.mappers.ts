import type { ProcedurePlace, ProcedurePlaceRow } from './procedurePlaces.types';

export const mapProcedurePlaceRowToEntity = (
  row: ProcedurePlaceRow,
): ProcedurePlace => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});
