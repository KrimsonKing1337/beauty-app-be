import type { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '@/modules/auth/utils/tokens';
import { AppError } from '@/utils/appError';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const BEARER = 'Bearer ';

  if (!authHeader?.startsWith(BEARER)) {
    next(new AppError(401, 'Неавторизован'));

    return;
  }

  const token = authHeader.slice(BEARER.length);

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      login: payload.login,
    };

    next();
  } catch {
    next(new AppError(401, 'Неавторизован'));

    return;
  }
};
