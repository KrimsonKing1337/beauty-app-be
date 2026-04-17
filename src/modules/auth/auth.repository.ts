import { pool } from '@/db';

import { mapRefreshToken } from './auth.mappers';

export type CreateRefreshTokenParams = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export const createRefreshToken = async (
  params: CreateRefreshTokenParams,
): Promise<void> => {
  const { userId, tokenHash, expiresAt } = params;

  await pool.query(
    `
      insert into refresh_tokens (user_id, token_hash, expires_at)
      values ($1, $2, $3)
    `,
    [userId, tokenHash, expiresAt],
  );
};

export const findValidRefreshToken = async (tokenHash: string) => {
  const result = await pool.query(
    `
      select *
      from refresh_tokens
      where token_hash = $1
        and revoked_at is null
        and expires_at > now()
      limit 1
    `,
    [tokenHash],
  );

  const row = result.rows[0];

  return row ? mapRefreshToken(row) : null;
};

export const revokeRefreshToken = async (tokenHash: string): Promise<void> => {
  await pool.query(
    `
      update refresh_tokens
      set revoked_at = now()
      where token_hash = $1
        and revoked_at is null
    `,
    [tokenHash],
  );
};

export const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
  await pool.query(
    `
      update refresh_tokens
      set revoked_at = now()
      where user_id = $1
        and revoked_at is null
    `,
    [userId],
  );
};
