import { pool } from '@/db';

import { mapTagRowToEntity } from './tags.mappers';

import type {
  CreateTagInput,
  Tag,
  TagRow,
} from './tags.types';

export const getAllTagsByUserId = async (
  userId: string,
): Promise<Tag[]> => {
  const result = await pool.query<TagRow>(
    `
      select *
      from tags
      where user_id is null
         or user_id = $1
      order by name asc
    `,
    [userId],
  );

  return result.rows.map(mapTagRowToEntity);
};

export const getTagById = async (
  userId: string,
  tagId: string,
): Promise<Tag | null> => {
  const result = await pool.query<TagRow>(
    `
      select *
      from tags
      where id = $1
        and (user_id is null or user_id = $2)
      limit 1
    `,
    [tagId, userId],
  );

  const row = result.rows[0];

  return row ? mapTagRowToEntity(row) : null;
};

export const createTag = async (
  userId: string,
  input: CreateTagInput,
): Promise<Tag> => {
  const normalizedName = input.name.trim().replace(/\s+/g, ' ');

  const result = await pool.query<TagRow>(
    `
        insert into tags (
            user_id,
            name
        )
        values ($1, $2)
        on conflict (user_id, lower(name))
            do update set name = excluded.name
        returning *
    `,
    [userId, normalizedName],
  );

  return mapTagRowToEntity(result.rows[0]);
};

export const deleteTag = async (
  userId: string,
  tagId: string,
): Promise<boolean> => {
  const result = await pool.query(
    `
      delete from tags
      where id = $1
        and user_id = $2
    `,
    [tagId, userId],
  );

  return (result.rowCount ?? 0) > 0;
};
