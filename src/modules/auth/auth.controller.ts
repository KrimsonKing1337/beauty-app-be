import type { Request, Response } from 'express';

import { findUserById } from '@/modules/users/users.repository';

import {
  loginUser,
  logoutUser,
  refreshAuthSession,
} from './auth.service';

export const loginController = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        message: 'login and password are required',
      });
    }

    const result = await loginUser(login, password);

    return res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'refreshToken is required',
      });
    }

    const result = await refreshAuthSession(refreshToken);

    return res.json(result);
  } catch {
    return res.status(401).json({
      message: 'Invalid refresh token',
    });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: 'refreshToken is required',
      });
    }

    await logoutUser(refreshToken);

    return res.status(204).send();
  } catch {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const meController = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const user = await findUserById(req.user.userId);

  if (!user) {
    return res.status(401).json({
      message: 'User not found',
    });
  }

  return res.json({
    user: {
      id: user.id,
      login: user.login,
      name: user.name,
    },
  });
};
