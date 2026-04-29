import type { Tag, TagRow } from './tags.types';

export const mapTagRowToEntity = (row: TagRow): Tag => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});
