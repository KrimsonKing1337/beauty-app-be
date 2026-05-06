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

const nullableUuidFromQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return value;
}, z.uuid().nullable());

const nullableBooleanFromQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}, z.boolean().nullable());

const booleanFromQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
}, z.boolean());

export const getRemindersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum([
      'dateTime',
      'createdAt',
      'updatedAt',
      'name',
    ])
    .default('dateTime'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().trim().default(''),
  isCompleted: nullableBooleanFromQuerySchema.default(null),
  procedureId: nullableUuidFromQuerySchema.default(null),
  includeProcedureReminders: booleanFromQuerySchema.default(true),
});

export const createReminderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().max(5000).default(''),
  dateTime: dateFromUnknownSchema,
  repeat: reminderRepeatSchema,
  notifications: reminderNotificationsSchema,
  procedureId: z.uuid().nullable().optional(),
  isCompleted: z.boolean().optional(),
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
});

export const updateReminderSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  dateTime: dateFromUnknownSchema.optional(),
  repeat: reminderRepeatSchema.optional(),
  notifications: updateReminderNotificationsSchema.optional(),
  procedureId: z.uuid().nullable().optional(),
  isCompleted: z.boolean().optional(),
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
});

export const reminderIdParamsSchema = z.object({
  id: z.uuid(),
});

export type GetRemindersQueryDto = z.infer<typeof getRemindersQuerySchema>;
export type CreateReminderDto = z.infer<typeof createReminderSchema>;
export type UpdateReminderDto = z.infer<typeof updateReminderSchema>;
export type ReminderIdParamsDto = z.infer<typeof reminderIdParamsSchema>;
