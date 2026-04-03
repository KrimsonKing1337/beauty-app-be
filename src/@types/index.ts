import type { Request } from 'express';

export type RequestWithUser<T = void> = Request & T & {
  user?: {
    userId: string;
    login: string;
  };
};
