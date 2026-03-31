import type { Reminder, ReminderRow } from './reminders.types';

export const mapReminderRowToEntity = (row: ReminderRow): Reminder => ({
  id: row.id,
  name: row.name,
  description: row.description,
  dateTime: new Date(row.date_time),
  repeat: row.repeat as Reminder['repeat'],
  notifications: row.notifications as Reminder['notifications'],
  isCompleted: row.is_completed,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});
