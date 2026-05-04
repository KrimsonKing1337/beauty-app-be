import 'express';

import type { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        login: string;
      };

      log: Logger;
    }
  }
}

export {};
