import { mapReminderRowToEntity } from '@/modules/reminders/reminders.mappers';

import type { ReminderRow } from '@/modules/reminders/reminders.types';

import type {
  Procedure,
  ProcedureEntity,
  ProcedureImage,
} from './procedures.types';

const normalizeImages = (images: ProcedureEntity['images']): ProcedureImage[] => {
  if (!images) {
    return [];
  }

  if (typeof images === 'string') {
    try {
      return JSON.parse(images) as ProcedureImage[];
    } catch {
      return [];
    }
  }

  return images;
};

const normalizeReminder = (
  reminder: ProcedureEntity['reminder'],
): Procedure['reminder'] => {
  if (!reminder || typeof reminder !== 'object') {
    return null;
  }

  return mapReminderRowToEntity(reminder);
};

export const mapProcedureToDto = (row: ProcedureEntity): Procedure => {
  return {
    id: row.id,
    procedureName: row.procedure_name,
    dateTime: new Date(row.date_time).toISOString(),
    placeId: row.place_id,
    durationHours: row.duration_hours,
    durationMinutes: row.duration_minutes,
    price: row.price,
    images: normalizeImages(row.images),
    notes: row.notes,
    typeId: row.type_id,
    tagIds: row.tag_ids ?? [],
    reminder: normalizeReminder(row.reminder),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
};
