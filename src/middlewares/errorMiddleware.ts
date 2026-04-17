import type { NextFunction, Request, Response } from 'express';

import { sendErrorResponse } from '@/utils/errorResponse';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  sendErrorResponse(res, error);
};
