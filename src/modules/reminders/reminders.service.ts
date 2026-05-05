import {
  createReminder,
  deleteReminder,
  getAllRemindersByUserId,
  getReminderById,
  updateReminder,
} from './reminders.repository';

import type {
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
} from './reminders.types';

export const getAllRemindersService = async (
  userId: string,
): Promise<Reminder[]> => {
  return getAllRemindersByUserId(userId);
};

export const getReminderByIdService = async (
  userId: string,
  id: string,
): Promise<Reminder | null> => {
  return getReminderById(userId, id);
};

export const createReminderService = async (
  userId: string,
  input: CreateReminderInput,
): Promise<Reminder> => {
  return createReminder(userId, {
    ...input,
    description: input.description ?? '',
    procedureId: input.procedureId ?? null,
    isCompleted: input.isCompleted ?? false,
  });
};

export const updateReminderService = async (
  userId: string,
  id: string,
  input: UpdateReminderInput,
): Promise<Reminder | null> => {
  const existingReminder = await getReminderById(userId, id);

  if (!existingReminder) {
    return null;
  }

  const procedureId = Object.prototype.hasOwnProperty.call(input, 'procedureId')
    ? input.procedureId ?? null
    : existingReminder.procedureId;

  const mergedReminder = {
    name: input.name ?? existingReminder.name,
    description: input.description ?? existingReminder.description,
    dateTime: input.dateTime ?? existingReminder.dateTime,
    repeat: input.repeat ?? existingReminder.repeat,
    notifications: {
      ...existingReminder.notifications,
      ...(input.notifications ?? {}),
    },
    procedureId,
    isCompleted: input.isCompleted ?? existingReminder.isCompleted,
  };

  return updateReminder(userId, id, mergedReminder);
};

export const deleteReminderService = async (
  userId: string,
  id: string,
): Promise<boolean> => {
  return deleteReminder(userId, id);
};
