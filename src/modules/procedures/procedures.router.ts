import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import {
  createProcedureController,
  deleteProcedureController,
  getProcedureByIdController,
  getProceduresController,
  patchProcedureController,
} from './procedures.controller';

export const proceduresRouter = Router();

proceduresRouter.use(authMiddleware);

proceduresRouter.get('/', asyncHandler(getProceduresController));
proceduresRouter.get('/:id', asyncHandler(getProcedureByIdController));
proceduresRouter.post('/', asyncHandler(createProcedureController));
proceduresRouter.patch('/:id', asyncHandler(patchProcedureController));
proceduresRouter.delete('/:id', asyncHandler(deleteProcedureController));
