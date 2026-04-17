import type { Request, Response } from 'express';

import { findUserById } from '@/modules/users/users.repository';
import { AppError } from '@/utils/appError';

import {
  loginUser,
  logoutUser,
  refreshAuthSession,
} from './auth.service';

export const loginController = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    throw new AppError(400, 'Логин и пароль обязательны');
  }

  const result = await loginUser(login, password);

  return res.json(result);
};

export const refreshController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError(400, 'refreshToken обязателен');
  }

  const result = await refreshAuthSession(refreshToken);

  return res.json(result);
};

export const logoutController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError(400, 'refreshToken обязателен');
  }

  await logoutUser(refreshToken);

  return res.status(204).send();
};

export const meController = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Не авторизован');
  }

  const user = await findUserById(req.user.userId);

  if (!user) {
    throw new AppError(401, 'Пользователь не найден');
  }

  return res.json({
    user: {
      id: user.id,
      login: user.login,
      name: user.name,
    },
  });
};
