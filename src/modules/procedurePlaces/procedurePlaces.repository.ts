import { pool } from '@/db';

import { mapProcedurePlaceRowToEntity } from './procedurePlaces.mappers';

import type {
  CreateProcedurePlaceInput,
  ProcedurePlace,
  ProcedurePlaceRow,
} from './procedurePlaces.types';

export const getAllProcedurePlacesByUserId = async (
  userId: string,
): Promise<ProcedurePlace[]> => {
  const result = await pool.query<ProcedurePlaceRow>(
    `
      select *
      from procedure_places
      where user_id is null
         or user_id = $1
      order by name asc
    `,
    [userId],
  );

  return result.rows.map(mapProcedurePlaceRowToEntity);
};

export const getProcedurePlaceById = async (
  userId: string,
  procedurePlaceId: string,
): Promise<ProcedurePlace | null> => {
  const result = await pool.query<ProcedurePlaceRow>(
    `
      select *
      from procedure_places
      where id = $1
        and (user_id is null or user_id = $2)
      limit 1
    `,
    [procedurePlaceId, userId],
  );

  const row = result.rows[0];

  return row ? mapProcedurePlaceRowToEntity(row) : null;
};

export const createProcedurePlace = async (
  userId: string,
  input: CreateProcedurePlaceInput,
): Promise<ProcedurePlace> => {
  const normalizedName = input.name.trim().replace(/\s+/g, ' ');

  const result = await pool.query<ProcedurePlaceRow>(
    `
      insert into procedure_places (
        user_id,
        name
      )
      values ($1, $2)
      on conflict (user_id, lower(name))
        do update set
          name = excluded.name,
          updated_at = now()
      returning *
    `,
    [userId, normalizedName],
  );

  return mapProcedurePlaceRowToEntity(result.rows[0]);
};

export const deleteProcedurePlace = async (
  userId: string,
  procedurePlaceId: string,
): Promise<boolean> => {
  const result = await pool.query(
    `
      delete from procedure_places
      where id = $1
        and user_id = $2
    `,
    [procedurePlaceId, userId],
  );

  return (result.rowCount ?? 0) > 0;
};
