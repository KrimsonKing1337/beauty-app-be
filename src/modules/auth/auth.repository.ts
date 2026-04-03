import { pool } from '@/db';

import { mapRefreshToken } from './auth.mappers';

export type AuthRepositoryParams = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export const authRepository = {
  async createRefreshToken(params: AuthRepositoryParams): Promise<void> {
    const { userId, tokenHash, expiresAt } = params;

    await pool.query(
      `
          insert into refresh_tokens (user_id, token_hash, expires_at)
          values ($1, $2, $3)
      `,
      [userId, tokenHash, expiresAt],
    );
  },

  async findValidRefreshToken(tokenHash: string) {
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
  },

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await pool.query(
      `
          update refresh_tokens
          set revoked_at = now()
          where token_hash = $1
            and revoked_at is null
      `,
      [tokenHash],
    );
  },

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await pool.query(
      `
          update refresh_tokens
          set revoked_at = now()
          where user_id = $1
            and revoked_at is null
      `,
      [userId],
    );
  },
};
