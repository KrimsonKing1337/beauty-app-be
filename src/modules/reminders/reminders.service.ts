import {
  getAllRemindersRepository,
  getReminderByIdRepository,
  createReminderRepository,
  updateReminderRepository,
  deleteReminderRepository,
} from './reminders.repository';

import type {
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
} from './reminders.types';

export const getAllRemindersService = async (): Promise<Reminder[]> => {
  return getAllRemindersRepository();
};

export const getReminderByIdService = async (
  id: string,
): Promise<Reminder | null> => {
  return getReminderByIdRepository(id);
};

export const createReminderService = async (
  input: CreateReminderInput,
): Promise<Reminder> => {
  return createReminderRepository({
    ...input,
    description: input.description ?? '',
    isCompleted: input.isCompleted ?? false,
  });
};

export const updateReminderService = async (
  id: string,
  input: UpdateReminderInput,
): Promise<Reminder | null> => {
  const existingReminder = await getReminderByIdRepository(id);

  if (!existingReminder) {
    return null;
  }

  const mergedReminder: UpdateReminderInput = {
    name: input.name ?? existingReminder.name,
    description: input.description ?? existingReminder.description,
    dateTime: input.dateTime ?? existingReminder.dateTime,
    repeat: input.repeat ?? existingReminder.repeat,
    notifications: input.notifications ?? existingReminder.notifications,
    isCompleted: input.isCompleted ?? existingReminder.isCompleted,
  };

  return updateReminderRepository(id, mergedReminder);
};

export const deleteReminderService = async (
  id: string,
): Promise<boolean> => {
  return deleteReminderRepository(id);
};
