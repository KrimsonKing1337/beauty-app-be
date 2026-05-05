import { pool } from '@/db';

import type {
  CreateProcedureDto,
  UpdateImageArgs,
  UpdateProcedureDto,
} from './procedures.types';

import { mapProcedureToDto } from './procedures.mappers';

const PROCEDURES_SELECT = `
  select
    p.*,
    coalesce(
      array_agg(pt.tag_id) filter (where pt.tag_id is not null),
      '{}'
    ) as tag_ids
  from procedures p
  left join procedure_tags pt
    on pt.procedure_id = p.id
`;

const replaceProcedureTags = async (
  procedureId: string,
  tagIds: string[],
) => {
  await pool.query(
    `
      delete from procedure_tags
      where procedure_id = $1
    `,
    [procedureId],
  );

  if (tagIds.length === 0) {
    return;
  }

  await pool.query(
    `
      insert into procedure_tags (
        procedure_id,
        tag_id
      )
      select $1, unnest($2::uuid[])
    `,
    [procedureId, tagIds],
  );
};

export const getAllProceduresByUserId = async (userId: string) => {
  const result = await pool.query(
    `
      ${PROCEDURES_SELECT}
      where p.user_id = $1
      group by p.id
      order by p.date_time desc
    `,
    [userId],
  );

  return result.rows.map(mapProcedureToDto);
};

export const getProcedureById = async (userId: string, procedureId: string) => {
  const result = await pool.query(
    `
      ${PROCEDURES_SELECT}
      where p.id = $1
        and p.user_id = $2
      group by p.id
      limit 1
    `,
    [procedureId, userId],
  );

  const row = result.rows[0];

  return row ? mapProcedureToDto(row) : null;
};

export const createProcedure = async (
  userId: string,
  data: CreateProcedureDto,
) => {
  const client = await pool.connect();

  try {
    await client.query('begin');

    const result = await client.query(
      `
        insert into procedures (
          user_id,
          procedure_name,
          date_time,
          place,
          duration_hours,
          duration_minutes,
          price,
          notes,
          type_id
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning *
      `,
      [
        userId,
        data.procedureName,
        data.dateTime,
        data.place,
        data.durationHours,
        data.durationMinutes,
        data.price,
        data.notes,
        data.typeId,
      ],
    );

    const procedureId = result.rows[0].id;

    if (data.tagIds.length > 0) {
      await client.query(
        `
          insert into procedure_tags (
            procedure_id,
            tag_id
          )
          select $1, unnest($2::uuid[])
        `,
        [procedureId, data.tagIds],
      );
    }

    await client.query('commit');

    return getProcedureById(userId, procedureId);
  } catch (error) {
    await client.query('rollback');

    throw error;
  } finally {
    client.release();
  }
};

export const updateProcedure = async (
  userId: string,
  procedureId: string,
  data: UpdateProcedureDto,
) => {
  const client = await pool.connect();

  try {
    await client.query('begin');

    const result = await client.query(
      `
        update procedures
        set
          procedure_name = $3,
          date_time = $4,
          place = $5,
          duration_hours = $6,
          duration_minutes = $7,
          price = $8,
          notes = $9,
          type_id = $10,
          updated_at = now()
        where id = $1
          and user_id = $2
        returning *
      `,
      [
        procedureId,
        userId,
        data.procedureName,
        data.dateTime,
        data.place,
        data.durationHours,
        data.durationMinutes,
        data.price,
        data.notes,
        data.typeId,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      await client.query('rollback');

      return null;
    }

    await client.query(
      `
        delete from procedure_tags
        where procedure_id = $1
      `,
      [procedureId],
    );

    if (data.tagIds && data.tagIds.length > 0) {
      await client.query(
        `
          insert into procedure_tags (
            procedure_id,
            tag_id
          )
          select $1, unnest($2::uuid[])
        `,
        [procedureId, data.tagIds],
      );
    }

    await client.query('commit');

    return getProcedureById(userId, procedureId);
  } catch (error) {
    await client.query('rollback');

    throw error;
  } finally {
    client.release();
  }
};

export const deleteProcedure = async (
  userId: string,
  procedureId: string,
): Promise<boolean> => {
  const result = await pool.query(
    `
      delete from procedures
      where id = $1
        and user_id = $2
    `,
    [procedureId, userId],
  );

  return (result.rowCount ?? 0) > 0;
};

export const updateProcedureImage = async ({
   userId,
   procedureId,
   type,
   imagePath,
}: UpdateImageArgs) => {
  const column = type === 'before'
    ? 'before_image_paths'
    : 'after_image_paths';

  const result = await pool.query(
    `
      update procedures
      set ${column} = $3,
          updated_at = now()
      where id = $1
        and user_id = $2
      returning *
    `,
    [procedureId, userId, [imagePath]],
  );

  const row = result.rows[0];

  return row ? mapProcedureToDto(row) : null;
};
