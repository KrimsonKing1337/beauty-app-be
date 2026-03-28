import { pool } from '../db';

export type Procedure = {
  id: string;
  procedure_name: string;
  date: string;
  place: string | null;
  duration: string | null;
  price: number | null;
  before_after: string[];
  notes: string | null;
  created_at: string;
};

export const getAllProcedures = async (): Promise<Procedure[]> => {
  const result = await pool.query<Procedure>(
    'SELECT * FROM public.procedures ORDER BY date DESC',
  );

  return result.rows;
};
