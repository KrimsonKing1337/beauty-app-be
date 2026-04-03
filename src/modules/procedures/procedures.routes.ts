import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';

import { ProceduresRepository } from './procedures.repository';
import { ProceduresService } from './procedures.service';
import { ProceduresController } from './procedures.controller';

const proceduresRepository = new ProceduresRepository();
const proceduresService = new ProceduresService(proceduresRepository);
const proceduresController = new ProceduresController(proceduresService);

export const proceduresRouter = Router();

proceduresRouter.use(authMiddleware);

proceduresRouter.get('/', proceduresController.getAll);
proceduresRouter.get('/:id', proceduresController.getById);
proceduresRouter.post('/', proceduresController.create);
proceduresRouter.patch('/:id', proceduresController.update);
proceduresRouter.delete('/:id', proceduresController.delete);
