import type { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '@/modules/auth/utils/tokens';

export const authMiddleware = (
  req: Request,
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
