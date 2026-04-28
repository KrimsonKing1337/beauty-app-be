import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import {
  createProcedureTypeController,
  deleteProcedureTypeController,
  getProcedureTypeByIdController,
  getProcedureTypesController,
} from './procedureTypes.controller';

export const procedureTypesRouter = Router();

procedureTypesRouter.use(authMiddleware);

procedureTypesRouter.get('/', asyncHandler(getProcedureTypesController));
procedureTypesRouter.get('/:id', asyncHandler(getProcedureTypeByIdController));
procedureTypesRouter.post('/', asyncHandler(createProcedureTypeController));
procedureTypesRouter.delete('/:id', asyncHandler(deleteProcedureTypeController));
