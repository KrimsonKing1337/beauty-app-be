import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';

import {
  createReminderController,
  deleteReminderController,
  getReminderByIdController,
  getRemindersController,
  patchReminderController,
} from './reminders.controller';

export const remindersRouter = Router();

remindersRouter.use(authMiddleware);

remindersRouter.get('/', getRemindersController);
remindersRouter.get('/:id', getReminderByIdController);
remindersRouter.post('/', createReminderController);
remindersRouter.patch('/:id', patchReminderController);
remindersRouter.delete('/:id', deleteReminderController);
