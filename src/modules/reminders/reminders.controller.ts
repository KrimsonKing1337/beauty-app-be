import type { Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

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
  const { userId } = requireUser(req);

  const reminders = await getAllRemindersService(userId);

  res.json(reminders);
};

export const getReminderByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id напоминания',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

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
    throw new AppError(
      400,
      'Неверный payload напоминания',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);

  req.log.info(
    {
      userId,
      reminderName: bodyResult.data.name,
      dateTime: bodyResult.data.dateTime,
      repeatUnit: bodyResult.data.repeat?.unit,
      daysBefore: bodyResult.data.notifications.daysBefore,
      hoursBefore: bodyResult.data.notifications.hoursBefore,
      minutesBefore: bodyResult.data.notifications.minutesBefore,
      procedureId: bodyResult.data.procedureId ?? null,
    },
    'Creating reminder',
  );

  const reminder = await createReminderService(userId, bodyResult.data);

  req.log.info(
    {
      userId,
      reminderId: reminder.id,
      procedureId: reminder.procedureId,
    },
    'Reminder created',
  );

  res.status(201).json(reminder);
};

export const patchReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id напоминания',
      z.treeifyError(paramsResult.error),
    );
  }

  const bodyResult = updateReminderSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(
      400,
      'Неверный payload напоминания',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);
  const reminderId = paramsResult.data.id;

  req.log.info(
    {
      userId,
      reminderId,
      updatedFields: Object.keys(bodyResult.data),
      procedureId: bodyResult.data.procedureId,
    },
    'Updating reminder',
  );

  const updatedReminder = await updateReminderService(
    userId,
    reminderId,
    bodyResult.data,
  );

  if (!updatedReminder) {
    throw new AppError(404, 'Напоминание не найдено');
  }

  req.log.info(
    {
      userId,
      reminderId,
      procedureId: updatedReminder.procedureId,
    },
    'Reminder updated',
  );

  res.json(updatedReminder);
};

export const deleteReminderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = reminderIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id напоминания',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);
  const reminderId = paramsResult.data.id;

  req.log.info(
    {
      userId,
      reminderId,
    },
    'Deleting reminder',
  );

  const isDeleted = await deleteReminderService(userId, reminderId);

  if (!isDeleted) {
    throw new AppError(404, 'Напоминание не найдено');
  }

  req.log.info(
    {
      userId,
      reminderId,
    },
    'Reminder deleted',
  );

  res.status(204).send();
};
