import type { NextFunction, Request, Response } from 'express';

import { AppError } from '@/utils/AppError';
import { pinoLogger } from '@/utils/pinoLogger';

const isDev = process.env.NODE_ENV !== 'production';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
]);

const sanitizeValue = (value: unknown): unknown => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (SENSITIVE_KEYS.has(key)) {
        return [key, '[HIDDEN]'];
      }

      return [key, sanitizeValue(item)];
    }),
  );
};

export const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const errorId = crypto.randomUUID();

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : 'Internal server error';

  const loggerRequestUser = req.user
    ? {
      userId: req.user.userId,
      login: req.user.login,
    }
    : null;

  pinoLogger.error(
    {
      errorId,
      err: error,
      request: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        body: sanitizeValue(req.body),
        user: loggerRequestUser,
      },
    },
    'Request failed',
  );

  return res.status(statusCode).json({
    message,
    errorId,

    ...(isDev && error instanceof AppError && error.details !== undefined
      ? { details: error.details }
      : {}),

    ...(isDev && error instanceof Error ? { stack: error.stack } : {}),
  });
};
