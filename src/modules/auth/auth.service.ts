import bcrypt from 'bcrypt';

import { usersRepository } from '@/modules/users/users.repository';
import { authRepository } from './auth.repository';

import {
  getRefreshTokenExpiresAt,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './utils/tokens';

export const authService = {
  async login(login: string, password: string) {
    const user = await usersRepository.findByLogin(login);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshTokenExpiresAt(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
      },
    };
  },

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);

    const storedToken = await authRepository.findValidRefreshToken(tokenHash);

    if (!storedToken) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    await authRepository.revokeRefreshToken(tokenHash);

    const newPayload = {
      userId: payload.userId,
      login: payload.login,
    };

    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    await authRepository.createRefreshToken({
      userId: payload.userId,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: getRefreshTokenExpiresAt(),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(refreshToken: string) {
    await authRepository.revokeRefreshToken(hashToken(refreshToken));
  },
};
