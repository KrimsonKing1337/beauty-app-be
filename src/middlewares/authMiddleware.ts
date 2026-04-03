import type { Response, NextFunction } from 'express';

import type { RequestWithUser } from '@/@types';

import { verifyAccessToken } from '@/modules/auth/utils/tokens';

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const BEARER = 'Bearer ';

  if (!authHeader?.startsWith(BEARER)) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
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
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};
