import crypto from 'node:crypto';
import path from 'path';

import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';

import { env } from './config/env';
import { pool } from './db';

import { authRouter } from './modules/auth/auth.router';
import { procedureTypesRouter } from './modules/procedureTypes/procedureTypes.router';
import { proceduresRouter } from './modules/procedures/procedures.router';
import { remindersRouter } from './modules/reminders/reminders.router';
import { tagsRouter } from './modules/tags/tags.router';
import { uploadsRouter } from './modules/uploads/uploads.router';

import {
  apiRateLimiter,
  authRateLimiter,
  helmetMiddleware,
  refreshRateLimiter
} from './middlewares/securityMiddleware';

import { errorMiddleware } from './middlewares/errorMiddleware';

import { pinoLogger } from './utils/pinoLogger';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  pinoHttp({
    logger: pinoLogger,
    genReqId: () => crypto.randomUUID(),
  }),
);

app.use(helmetMiddleware);
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', apiRateLimiter);

app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/refresh', refreshRateLimiter);

app.use('/api/procedures', proceduresRouter);
app.use('/api/procedure-types', procedureTypesRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/auth', authRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/uploads', uploadsRouter);

app.use(express.static(path.resolve('../beauty-app-fe/dist')));
app.use('/uploads', express.static('uploads'));

app.use(errorMiddleware);

app.listen(env.port, async () => {
  pinoLogger.info({ port: env.port }, 'Server is running');

  try {
    await pool.query('SELECT NOW()');

    pinoLogger.info('PostgreSQL connected successfully');
  } catch (error) {
    pinoLogger.error({ err: error }, 'PostgreSQL connection failed');
  }
});
