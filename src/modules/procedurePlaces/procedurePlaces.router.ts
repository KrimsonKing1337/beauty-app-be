import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import {
  createProcedurePlaceController,
  deleteProcedurePlaceController,
  getProcedurePlaceByIdController,
  getProcedurePlacesController,
} from './procedurePlaces.controller';

export const procedurePlacesRouter = Router();

procedurePlacesRouter.use(authMiddleware);

procedurePlacesRouter.get('/', asyncHandler(getProcedurePlacesController));
procedurePlacesRouter.get('/:id', asyncHandler(getProcedurePlaceByIdController));
procedurePlacesRouter.post('/', asyncHandler(createProcedurePlaceController));
procedurePlacesRouter.delete('/:id', asyncHandler(deleteProcedurePlaceController));
