import type { ProcedurePlace, ProcedurePlaceRow } from './procedurePlaces.types';

export const mapProcedurePlaceRowToEntity = (
  row: ProcedurePlaceRow,
): ProcedurePlace => {
  const createAtValue = row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString();
  const updateAtValue = row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString();

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    createdAt: createAtValue,
    updatedAt: updateAtValue,
  }
};
