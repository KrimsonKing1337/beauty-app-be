import { pool } from '@/db';

import type {
  AddProcedureImagesArgs,
  AddProcedureImagesResult,
  CreateProcedureDto,
  GetProceduresQuery,
  PaginatedResponse,
  Procedure,
  ProcedureImage,
  UpdateProcedureDto,
} from './procedures.types';

import { mapProcedureToDto } from './procedures.mappers';

const MAX_PROCEDURE_IMAGES = 10;

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

const procedureSortColumns: Record<GetProceduresQuery['sortBy'], string> = {
  dateTime: 'p.date_time',
  createdAt: 'p.created_at',
  updatedAt: 'p.updated_at',
  procedureName: 'p.procedure_name',
  price: 'p.price',
  duration: '(coalesce(p.duration_hours, 0) * 60 + coalesce(p.duration_minutes, 0))',
};

const buildProceduresWhere = (
  userId: string,
  query: GetProceduresQuery,
) => {
  const values: unknown[] = [userId];
  const where: string[] = ['p.user_id = $1'];

  if (query.search) {
    values.push(`%${query.search}%`);

    where.push(`
      (
        p.procedure_name ilike $${values.length}
        or p.place ilike $${values.length}
        or p.notes ilike $${values.length}
      )
    `);
  }

  if (query.typeId) {
    values.push(query.typeId);
    where.push(`p.type_id = $${values.length}`);
  }

  if (query.tagIds.length > 0) {
    values.push(query.tagIds);

    where.push(`
      exists (
        select 1
        from procedure_tags filter_pt
        where filter_pt.procedure_id = p.id
          and filter_pt.tag_id = any($${values.length}::uuid[])
      )
    `);
  }

  if (query.dateFrom) {
    values.push(query.dateFrom);
    where.push(`p.date_time >= $${values.length}`);
  }

  if (query.dateTo) {
    values.push(query.dateTo);
    where.push(`p.date_time < $${values.length}`);
  }

  return {
    values,
    whereSql: where.join(' and '),
  };
};

export const getAllProceduresByUserId = async (
  userId: string,
  query: GetProceduresQuery,
): Promise<PaginatedResponse<Procedure>> => {
  const { values, whereSql } = buildProceduresWhere(userId, query);

  const countResult = await pool.query(
    `
      select count(*)::int as total
      from procedures p
      where ${whereSql}
    `,
    values,
  );

  const total = countResult.rows[0]?.total ?? 0;
  const totalPages = Math.ceil(total / query.limit);
  const offset = (query.page - 1) * query.limit;

  const sortColumn = procedureSortColumns[query.sortBy];
  const sortDirection = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const dataValues = [...values, query.limit, offset];

  const result = await pool.query(
    `
      ${PROCEDURES_SELECT}
      where ${whereSql}
      group by p.id
      order by ${sortColumn} ${sortDirection} nulls last, p.id desc
      limit $${dataValues.length - 1}
      offset $${dataValues.length}
    `,
    dataValues,
  );

  return {
    items: result.rows.map(mapProcedureToDto),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
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
              images,
              notes,
              type_id
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10)
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
        JSON.stringify(data.images),
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

    const currentProcedure = await getProcedureById(userId, procedureId);

    if (!currentProcedure) {
      await client.query('rollback');

      return null;
    }

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
          images = $9::jsonb,
          notes = $10,
          type_id = $11,
          updated_at = now()
        where id = $1
          and user_id = $2
        returning *
      `,
      [
        procedureId,
        userId,
        data.procedureName ?? currentProcedure.procedureName,
        data.dateTime ?? currentProcedure.dateTime,
        data.place ?? currentProcedure.place,
        data.durationHours ?? currentProcedure.durationHours,
        data.durationMinutes ?? currentProcedure.durationMinutes,
        data.price ?? currentProcedure.price,
        JSON.stringify(data.images ?? currentProcedure.images),
        data.notes ?? currentProcedure.notes,
        data.typeId ?? currentProcedure.typeId,
      ],
    );

    const row = result.rows[0];

    if (!row) {
      await client.query('rollback');

      return null;
    }

    if (data.tagIds) {
      await client.query(
        `
          delete from procedure_tags
          where procedure_id = $1
        `,
        [procedureId],
      );

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

export const addProcedureImages = async ({
   userId,
   procedureId,
   images,
}: AddProcedureImagesArgs): Promise<AddProcedureImagesResult> => {
  const currentProcedure = await getProcedureById(userId, procedureId);

  if (!currentProcedure) {
    return null;
  }

  const nextImages: ProcedureImage[] = [
    ...currentProcedure.images,
    ...images,
  ];

  if (nextImages.length > MAX_PROCEDURE_IMAGES) {
    return {
      error: 'MAX_IMAGES_EXCEEDED',
      maxImages: MAX_PROCEDURE_IMAGES,
    };
  }

  const result = await pool.query(
    `
      update procedures
      set images = $3::jsonb,
          updated_at = now()
      where id = $1
        and user_id = $2
      returning *
    `,
    [procedureId, userId, JSON.stringify(nextImages)],
  );

  const row = result.rows[0];

  return row ? getProcedureById(userId, procedureId) : null;
};
