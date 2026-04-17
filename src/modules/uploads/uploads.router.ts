import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import { uploadProcedureImageController } from './uploads.controller';
import { getUploadMiddleware } from './utils';

export const uploadsRouter = Router();

uploadsRouter.use(authMiddleware);

uploadsRouter.post(
  '/:procedureId/:type',
  getUploadMiddleware(),
  asyncHandler(uploadProcedureImageController),
);
