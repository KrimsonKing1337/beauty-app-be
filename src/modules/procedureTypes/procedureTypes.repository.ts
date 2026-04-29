import { pool } from '@/db';

import { mapProcedureTypeRowToEntity } from './procedureTypes.mappers';

import type {
  CreateProcedureTypeInput,
  ProcedureType,
  ProcedureTypeRow,
} from './procedureTypes.types';

export const getAllProcedureTypesByUserId = async (
  userId: string,
): Promise<ProcedureType[]> => {
  const result = await pool.query<ProcedureTypeRow>(
    `
      select *
      from procedure_types
      where user_id is null
         or user_id = $1
      order by name asc
    `,
    [userId],
  );

  return result.rows.map(mapProcedureTypeRowToEntity);
};

export const getProcedureTypeById = async (
  userId: string,
  procedureTypeId: string,
): Promise<ProcedureType | null> => {
  const result = await pool.query<ProcedureTypeRow>(
    `
      select *
      from procedure_types
      where id = $1
        and (user_id is null or user_id = $2)
      limit 1
    `,
    [procedureTypeId, userId],
  );

  const row = result.rows[0];

  return row ? mapProcedureTypeRowToEntity(row) : null;
};

export const createProcedureType = async (
  userId: string,
  input: CreateProcedureTypeInput,
): Promise<ProcedureType> => {
  const normalizedName = input.name.trim().replace(/\s+/g, ' ');

  const result = await pool.query<ProcedureTypeRow>(
    `
        insert into procedure_types (
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

  return mapProcedureTypeRowToEntity(result.rows[0]);
};

export const deleteProcedureType = async (
  userId: string,
  procedureTypeId: string,
): Promise<boolean> => {
  const result = await pool.query(
    `
      delete from procedure_types
      where id = $1
        and user_id = $2
    `,
    [procedureTypeId, userId],
  );

  return (result.rowCount ?? 0) > 0;
};
