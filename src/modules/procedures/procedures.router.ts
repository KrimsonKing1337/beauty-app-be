import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';

import {
  createProcedureController,
  deleteProcedureController,
  getProcedureByIdController,
  getProceduresController,
  patchProcedureController,
} from './procedures.controller';

export const proceduresRouter = Router();

proceduresRouter.use(authMiddleware);

proceduresRouter.get('/', getProceduresController);
proceduresRouter.get('/:id', getProcedureByIdController);
proceduresRouter.post('/', createProcedureController);
proceduresRouter.patch('/:id', patchProcedureController);
proceduresRouter.delete('/:id', deleteProcedureController);
