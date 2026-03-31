export type RepeatUnit = 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export type RepeatPreset = 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'daysOfWeek'
  | 'custom';

export type ReminderRepeat = {
  unit: RepeatUnit;
  interval: number;
  daysOfWeek: number[];
  preset: RepeatPreset;
};

export type ReminderNotifications = {
  minutesBefore: number;
};

export type Reminder = {
  id: string;
  name: string;
  description: string;
  dateTime: Date;
  repeat: ReminderRepeat;
  notifications: ReminderNotifications;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateReminderInput = {
  name: string;
  description: string;
  dateTime: Date;
  repeat: ReminderRepeat;
  notifications: ReminderNotifications;
  isCompleted?: boolean;
};

export type UpdateReminderInput = {
  name?: string;
  description?: string;
  dateTime?: Date;
  repeat?: ReminderRepeat;
  notifications?: ReminderNotifications;
  isCompleted?: boolean;
};

export type ReminderRow = {
  id: string;
  name: string;
  description: string;
  date_time: Date | string;
  repeat: unknown;
  notifications: unknown;
  is_completed: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};
