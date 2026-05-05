import { z } from 'zod';

const repeatUnitSchema = z.enum([
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
]);

const repeatPresetSchema = z.enum([
  'none',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'daysOfWeek',
  'custom',
]);

export const reminderRepeatSchema = z.object({
  unit: repeatUnitSchema,
  interval: z.number().int().min(0),
  daysOfWeek: z.array(z.number().int().min(0).max(6)),
  preset: repeatPresetSchema,
});

const beforeValueSchema = z.number().int().min(0).default(0);

export const reminderNotificationsSchema = z.object({
  daysBefore: beforeValueSchema,
  hoursBefore: beforeValueSchema,
  minutesBefore: beforeValueSchema,
});

const updateReminderNotificationsSchema = z.object({
  daysBefore: z.number().int().min(0).optional(),
  hoursBefore: z.number().int().min(0).optional(),
  minutesBefore: z.number().int().min(0).optional(),
});

const dateFromUnknownSchema = z.coerce.date();

export const createReminderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().max(5000).default(''),
  dateTime: dateFromUnknownSchema,
  repeat: reminderRepeatSchema,
  notifications: reminderNotificationsSchema,
  procedureId: z.uuid().nullable().optional(),
  isCompleted: z.boolean().optional(),
});

export const updateReminderSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  dateTime: dateFromUnknownSchema.optional(),
  repeat: reminderRepeatSchema.optional(),
  notifications: updateReminderNotificationsSchema.optional(),
  procedureId: z.uuid().nullable().optional(),
  isCompleted: z.boolean().optional(),
});

export const reminderIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateReminderDto = z.infer<typeof createReminderSchema>;
export type UpdateReminderDto = z.infer<typeof updateReminderSchema>;
export type ReminderIdParamsDto = z.infer<typeof reminderIdParamsSchema>;
