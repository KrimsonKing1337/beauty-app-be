import express from 'express';
import cors from 'cors';

import { env } from './config/env';
import { pool } from './db';

import { proceduresRouter } from './modules/procedures/procedures.routes';
import { remindersRouter } from './modules/reminders/reminders.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/procedures', proceduresRouter);
app.use('/api/reminders', remindersRouter);

app.listen(env.port, async () => {
  console.log(`Server is running on port ${env.port}`);

  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
  }
});
