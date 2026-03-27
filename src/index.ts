import express from 'express';
import cors from 'cors';

import { env } from './config/env';
import { pool } from './db';
import { router } from './routes/test';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', router);

app.listen(env.port, async () => {
  console.log(`Server is running on port ${env.port}`);

  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
  }
});
