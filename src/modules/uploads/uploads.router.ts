import express from 'express';
import { authMiddleware } from '@/middlewares/authMiddleware';

import { getUploadMiddleware } from './utils';

export const uploadsRouter = express.Router();

uploadsRouter.use(authMiddleware);
uploadsRouter.use(getUploadMiddleware());

uploadsRouter.post('/', (_req, res) => {
  res.json({ message: 'File uploaded successfully' });
});
