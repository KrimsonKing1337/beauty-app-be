import type { Procedure, ProcedureEntity } from './procedures.types';

export const mapProcedureToDto = (row: ProcedureEntity): Procedure => {
  return {
    id: row.id,
    procedureName: row.procedure_name,
    date: new Date(row.date).toISOString(),
    place: row.place,
    durationHours: row.duration_hours,
    durationMinutes: row.duration_minutes,
    price: row.price,
    beforeImagePaths: row.before_image_paths ?? [],
    afterImagePaths: row.after_image_paths ?? [],
    notes: row.notes,
    typeId: row.type_id,
    tagIds: row.tag_ids ?? [],
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
};
