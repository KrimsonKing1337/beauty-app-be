import { pool } from '@/db';

import { mapProcedureToDto } from './procedures.mappers';

import { UpdateImageArgs, CreateProcedureDto, ImageType, UpdateProcedureDto } from './procedures.types';

export class ProceduresRepository {
  async findAllByUserId(userId: string) {
    const result = await pool.query(
      `
          select *
          from procedures
          where user_id = $1
          order by date desc
      `,
      [userId],
    );

    return result.rows.map(mapProcedureToDto);
  }

  async findById(userId: string, procedureId: string) {
    const result = await pool.query(
      `
          select *
          from procedures
          where id = $1
            and user_id = $2
          limit 1
      `,
      [procedureId, userId],
    );

    const row = result.rows[0];

    return row ? mapProcedureToDto(row) : null;
  }

  async create(userId: string, data: CreateProcedureDto) {
    const result = await pool.query(
      `
          insert into procedures (
              user_id,
              procedure_name,
              date,
              place,
              duration,
              price,
              before_after,
              notes
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8)
          returning *
      `,
      [
        userId,
        data.procedureName,
        data.date,
        data.place,
        data.duration,
        data.price,
        data.beforeAfter,
        data.notes,
      ],
    );

    return mapProcedureToDto(result.rows[0]);
  }

  async update(userId: string, procedureId: string, data: UpdateProcedureDto) {
    const result = await pool.query(
      `
          update procedures
          set
              procedure_name = $3,
              date = $4,
              place = $5,
              duration = $6,
              price = $7,
              before_after = $8,
              notes = $9,
              updated_at = now()
          where id = $1
            and user_id = $2
          returning *
      `,
      [
        procedureId,
        userId,
        data.procedureName,
        data.date,
        data.place,
        data.duration,
        data.price,
        data.beforeAfter,
        data.notes,
      ],
    );

    const row = result.rows[0];

    return row ? mapProcedureToDto(row) : null;
  }

  async delete(userId: string, procedureId: string): Promise<boolean> {
    const result = await pool.query(
      `
          delete from procedures
          where id = $1
            and user_id = $2
      `,
      [procedureId, userId],
    );

    return (result.rowCount ?? 0) > 0;
  }

  async updateImage({ userId, procedureId, type, imagePath }: UpdateImageArgs) {
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
  }
}
