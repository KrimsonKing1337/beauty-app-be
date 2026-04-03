import { Router } from 'express';

import {
  getReminders,
  getReminderByIdController,
  createReminderController,
  updateReminderController,
  deleteReminderController,
} from './reminders.controller';
import { authMiddleware } from '@/middlewares/authMiddleware';

export const remindersRouter = Router();

remindersRouter.use(authMiddleware);

remindersRouter.get('/', getReminders);
remindersRouter.get('/:id', getReminderByIdController);
remindersRouter.post('/', createReminderController);
remindersRouter.put('/:id', updateReminderController);
remindersRouter.delete('/:id', deleteReminderController);
