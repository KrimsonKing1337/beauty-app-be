import type { Request, Response } from 'express';

import { authService } from './auth.service';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({
          message: 'login and password are required',
        });
      }

      const result = await authService.login(login, password);

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
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          message: 'refreshToken is required',
        });
      }

      const result = await authService.refresh(refreshToken);

      return res.json(result);
    } catch {
      return res.status(401).json({
        message: 'Invalid refresh token',
      });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          message: 'refreshToken is required',
        });
      }

      await authService.logout(refreshToken);

      return res.status(204).send();
    } catch {
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  },

  async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    return res.json({
      userId: req.user.userId,
      login: req.user.login,
    });
  },
};
