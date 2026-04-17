import type { Request } from 'express';

import { AppError } from '@/utils/AppError';

type AuthUser = {
  userId: string;
  login: string;
};

export const requireUser = (req: Request): AuthUser => {
  if (!req.user) {
    throw new AppError(401, 'Неавторизован');
  }

  return req.user;
};
