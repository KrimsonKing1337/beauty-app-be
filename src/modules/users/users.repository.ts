import { pool } from '@/db';

export type User = {
  id: string;
  login: string;
  passwordHash: string;
  name: string;
};

export const usersRepository = {
  async findByLogin(login: string): Promise<User | null> {
    const result = await pool.query(
      `
      select id, login, password_hash as "passwordHash", name
      from users
      where login = $1
      `,
      [login],
    );

    return result.rows[0] ?? null;
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `
      select id, login, password_hash as "passwordHash", name
      from users
      where id = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  },
};
