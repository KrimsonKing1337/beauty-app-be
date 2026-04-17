import type { Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '@/utils/appError';

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
    throw new AppError(400, 'Неверный id напоминания', z.treeifyError(paramsResult.error));
  }

  const userId = req.user!.userId;

  const reminder = await getReminderByIdService(userId, paramsResult.data.id);

  if (!reminder) {
    throw new AppError(404, 'Напоминание не найдено');
  }

  res.json(reminder);
};

export const createReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createReminderSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(400, 'Неверный payload напоминания', z.treeifyError(bodyResult.error));
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
    throw new AppError(400, 'Неверный id напоминания', z.treeifyError(paramsResult.error));
  }

  const bodyResult = updateReminderSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(400, 'Неверный payload напоминания', z.treeifyError(bodyResult.error));
  }

  const userId = req.user!.userId;

  const updatedReminder = await updateReminderService(
    userId,
    paramsResult.data.id,
    bodyResult.data,
  );

  if (!updatedReminder) {
    throw new AppError(404, 'Напоминание не найдено');
  }

  res.json(updatedReminder);
};

export const deleteReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(400, 'Неверный id напоминания', z.treeifyError(paramsResult.error));
  }

  const userId = req.user!.userId;

  const isDeleted = await deleteReminderService(userId, paramsResult.data.id);

  if (!isDeleted) {
    throw new AppError(404, 'Напоминание не найдено');
  }

  res.status(204).send();
};
