import type { Response } from 'express';

import { AppError } from './appError';

export const sendErrorResponse = (res: Response, error: unknown) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.details !== undefined ? { details: error.details } : {}),
    });
  }

  console.error(error);

  return res.status(500).json({
    message: 'Internal server error',
  });
};
