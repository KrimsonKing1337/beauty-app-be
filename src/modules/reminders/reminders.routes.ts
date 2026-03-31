import { Router } from 'express';

import {
  getRemindersController,
  getReminderByIdController,
  createReminderController,
  updateReminderController,
  deleteReminderController,
} from './reminders.controller';

export const remindersRouter = Router();

remindersRouter.get('/', getRemindersController);
remindersRouter.get('/:id', getReminderByIdController);
remindersRouter.post('/', createReminderController);
remindersRouter.put('/:id', updateReminderController);
remindersRouter.delete('/:id', deleteReminderController);
