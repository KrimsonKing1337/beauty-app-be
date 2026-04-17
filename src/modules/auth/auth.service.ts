import bcrypt from 'bcrypt';

import { findUserByLogin } from '@/modules/users/users.repository';
import { AppError } from '@/utils/appError';

import {
  createRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
} from './auth.repository';

import {
  getRefreshTokenExpiresAt,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './utils/tokens';

export const loginUser = async (login: string, password: string) => {
  const user = await findUserByLogin(login);

  if (!user) {
    throw new AppError(401, 'Неверные данные');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, 'Неверный refresh token');
  }

  const payload = {
    userId: user.id,
    login: user.login,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await createRefreshToken({
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
};

export const refreshAuthSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const storedToken = await findValidRefreshToken(tokenHash);

  if (!storedToken) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }

  await revokeRefreshToken(tokenHash);

  const newPayload = {
    userId: payload.userId,
    login: payload.login,
  };

  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await createRefreshToken({
    userId: payload.userId,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: getRefreshTokenExpiresAt(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  await revokeRefreshToken(hashToken(refreshToken));
};
