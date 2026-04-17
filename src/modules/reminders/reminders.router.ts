import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import {
  createReminderController,
  deleteReminderController,
  getReminderByIdController,
  getRemindersController,
  patchReminderController,
} from './reminders.controller';

export const remindersRouter = Router();

remindersRouter.use(authMiddleware);

remindersRouter.get('/', asyncHandler(getRemindersController));
remindersRouter.get('/:id', asyncHandler(getReminderByIdController));
remindersRouter.post('/', asyncHandler(createReminderController));
remindersRouter.patch('/:id', asyncHandler(patchReminderController));
remindersRouter.delete('/:id', asyncHandler(deleteReminderController));
