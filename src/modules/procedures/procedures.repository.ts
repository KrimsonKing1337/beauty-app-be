import { pool } from '@/db';
import { mapProcedureToDto } from './procedures.mappers';

import type {
  CreateProcedureDto,
  Procedure,
  ProcedureEntity,
  UpdateProcedureDto,
} from './procedures.types';

export class ProceduresRepository {
  async findAll(): Promise<Procedure[]> {
    const result = await pool.query<ProcedureEntity>(`
      SELECT
        id,
        procedure_name,
        date,
        place,
        duration,
        price,
        before_after,
        notes,
        created_at
      FROM procedures
      ORDER BY date DESC NULLS LAST, created_at DESC
    `);

    return result.rows.map(mapProcedureToDto);
  }

  async findById(id: string): Promise<Procedure | null> {
    const result = await pool.query<ProcedureEntity>(
      `
        SELECT
          id,
          procedure_name,
          date,
          place,
          duration,
          price,
          before_after,
          notes,
          created_at
        FROM procedures
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    const entity = result.rows[0];

    if (!entity) {
      return null;
    }

    return mapProcedureToDto(entity);
  }

  async create(payload: CreateProcedureDto): Promise<Procedure> {
    const result = await pool.query<ProcedureEntity>(
      `
        INSERT INTO procedures (
          procedure_name,
          date,
          place,
          duration,
          price,
          before_after,
          notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          procedure_name,
          date,
          place,
          duration,
          price,
          before_after,
          notes,
          created_at
      `,
      [
        payload.procedureName,
        payload.date,
        payload.place,
        payload.duration,
        payload.price,
        payload.beforeAfter,
        payload.notes,
      ],
    );

    return mapProcedureToDto(result.rows[0]);
  }

  async update(id: string, payload: UpdateProcedureDto): Promise<Procedure | null> {
    const existing = await pool.query<ProcedureEntity>(
      `
        SELECT
          id,
          procedure_name,
          date,
          place,
          duration,
          price,
          before_after,
          notes,
          created_at
        FROM procedures
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    const current = existing.rows[0];

    if (!current) {
      return null;
    }

    const result = await pool.query<ProcedureEntity>(
      `
        UPDATE procedures
        SET
          updated_at = now(),
          procedure_name = $2,
          date = $3,
          place = $4,
          duration = $5,
          price = $6,
          before_after = $7,
          notes = $8
        WHERE id = $1
        RETURNING
          id,
          procedure_name,
          date,
          place,
          duration,
          price,
          before_after,
          notes,
          created_at
      `,
      [
        id,
        payload.procedureName ?? current.procedure_name,
        payload.date ?? current.date,
        payload.place ?? current.place,
        payload.duration ?? current.duration,
        payload.price ?? current.price,
        payload.beforeAfter ?? current.before_after,
        payload.notes ?? current.notes,
      ],
    );

    return mapProcedureToDto(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await pool.query(
      `
        DELETE FROM procedures
        WHERE id = $1
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
