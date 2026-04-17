import express from 'express';
import cors from 'cors';

import { env } from './config/env';
import { pool } from './db';

import { proceduresRouter } from './modules/procedures/procedures.router';
import { remindersRouter } from './modules/reminders/reminders.router';
import { authRouter } from './modules/auth/auth.router';
import { uploadsRouter } from './modules/uploads/uploads.router';

import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/procedures', proceduresRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/auth', authRouter);
app.use('/api/uploads', uploadsRouter);

app.use('/uploads', express.static('uploads'));

app.use(errorMiddleware);

app.listen(env.port, async () => {
  console.log(`Server is running on port ${env.port}`);

  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
  }
});
