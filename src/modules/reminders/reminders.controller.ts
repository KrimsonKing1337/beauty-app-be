import type { Request, Response } from 'express';
import { z } from 'zod';

import {
  createReminderSchema,
  reminderIdParamsSchema,
  updateReminderSchema,
} from './reminders.schemas';

import {
  createReminderService,
  deleteReminderService,
  getAllRemindersService,
  getReminderByIdService,
  updateReminderService,
} from './reminders.service';

export const getRemindersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;

  const reminders = await getAllRemindersService(userId);

  res.json(reminders);
};

export const getReminderByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    res.status(400).json({
      message: 'Invalid reminder id',
      errors: z.treeifyError(paramsResult.error),
    });

    return;
  }

  const userId = req.user!.userId;

  const reminder = await getReminderByIdService(userId, paramsResult.data.id);

  if (!reminder) {
    res.status(404).json({ message: 'Reminder not found' });
    return;
  }

  res.json(reminder);
};

export const createReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createReminderSchema.safeParse(req.body);

  if (!bodyResult.success) {
    res.status(400).json({
      message: 'Invalid reminder payload',
      errors: z.treeifyError(bodyResult.error),
    });

    return;
  }

  const userId = req.user!.userId;

  const reminder = await createReminderService(userId, bodyResult.data);

  res.status(201).json(reminder);
};

export const patchReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    res.status(400).json({
      message: 'Invalid reminder id',
      errors: z.treeifyError(paramsResult.error),
    });

    return;
  }

  const bodyResult = updateReminderSchema.safeParse(req.body);

  if (!bodyResult.success) {
    res.status(400).json({
      message: 'Invalid reminder payload',
      errors: z.treeifyError(bodyResult.error),
    });

    return;
  }

  const userId = req.user!.userId;

  const updatedReminder = await updateReminderService(
    userId,
    paramsResult.data.id,
    bodyResult.data,
  );

  if (!updatedReminder) {
    res.status(404).json({ message: 'Reminder not found' });
    return;
  }

  res.json(updatedReminder);
};

export const deleteReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    res.status(400).json({
      message: 'Invalid reminder id',
      errors: z.treeifyError(paramsResult.error),
    });

    return;
  }

  const userId = req.user!.userId;

  const isDeleted = await deleteReminderService(userId, paramsResult.data.id);

  if (!isDeleted) {
    res.status(404).json({ message: 'Reminder not found' });
    return;
  }

  res.status(204).send();
};
