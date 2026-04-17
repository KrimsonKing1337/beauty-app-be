import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';

import { uploadProcedureImageController } from './uploads.controller';
import { getUploadMiddleware } from './utils';

export const uploadsRouter = Router();

uploadsRouter.use(authMiddleware);

uploadsRouter.post(
  '/:procedureId/:type',
  getUploadMiddleware(),
  uploadProcedureImageController,
);
