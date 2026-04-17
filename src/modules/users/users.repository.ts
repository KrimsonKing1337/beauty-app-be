import { pool } from '@/db';

export type User = {
  id: string;
  login: string;
  passwordHash: string;
  name: string;
};

export const findUserByLogin = async (login: string): Promise<User | null> => {
  const result = await pool.query(
    `
      select id, login, password_hash as "passwordHash", name
      from users
      where login = $1
      limit 1
    `,
    [login],
  );

  return result.rows[0] ?? null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await pool.query(
    `
      select id, login, password_hash as "passwordHash", name
      from users
      where id = $1
      limit 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
};
