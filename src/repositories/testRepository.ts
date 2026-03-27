import { pool } from '../db';

export type TestItem = {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
};

export const getAllTestItems = async (): Promise<TestItem[]> => {
  const result = await pool.query<TestItem>(
    'SELECT id, title, description, created_at FROM test_items ORDER BY id ASC',
  );

  return result.rows;
};
