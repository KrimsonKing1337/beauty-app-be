import type {
  Reminder,
  ReminderNotifications,
  ReminderRow,
} from './reminders.types';

const getNonNegativeIntegerOrZero = (value: unknown): number => {
  if (typeof value !== 'number') {
    return 0;
  }

  if (!Number.isInteger(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  return value;
};

const mapReminderNotifications = (
  notifications: unknown,
): ReminderNotifications => {
  if (!notifications || typeof notifications !== 'object') {
    return {
      daysBefore: 0,
      hoursBefore: 0,
      minutesBefore: 0,
    };
  }

  const value = notifications as Partial<ReminderNotifications>;

  return {
    daysBefore: getNonNegativeIntegerOrZero(value.daysBefore),
    hoursBefore: getNonNegativeIntegerOrZero(value.hoursBefore),
    minutesBefore: getNonNegativeIntegerOrZero(value.minutesBefore),
  };
};

export const mapReminderRowToEntity = (row: ReminderRow): Reminder => ({
  id: row.id,
  name: row.name,
  description: row.description,
  dateTime: new Date(row.date_time),
  repeat: row.repeat as Reminder['repeat'],
  notifications: mapReminderNotifications(row.notifications),
  procedureId: row.procedure_id,
  isCompleted: row.is_completed,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});
