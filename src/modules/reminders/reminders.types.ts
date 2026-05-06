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
  daysBefore: number;
  hoursBefore: number;
  minutesBefore: number;
};

export type Reminder = {
  id: string;
  name: string;
  description: string;
  dateTime: Date;
  repeat: ReminderRepeat;
  notifications: ReminderNotifications;
  procedureId: string | null;
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
  procedureId?: string | null;
  isCompleted?: boolean;
};

export type UpdateReminderInput = {
  name?: string;
  description?: string;
  dateTime?: Date;
  repeat?: ReminderRepeat;
  notifications?: Partial<ReminderNotifications>;
  procedureId?: string | null;
  isCompleted?: boolean;
};

export type ReminderRow = {
  id: string;
  name: string;
  description: string;
  date_time: Date | string;
  repeat: unknown;
  notifications: unknown;
  procedure_id: string | null;
  is_completed: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

export type ReminderSortBy =
  | 'dateTime'
  | 'createdAt'
  | 'updatedAt'
  | 'name';

export type SortOrder = 'asc' | 'desc';

export type GetRemindersQuery = {
  page: number;
  limit: number;
  sortBy: ReminderSortBy;
  sortOrder: SortOrder;
  search: string;
  isCompleted: boolean | null;
  procedureId: string | null;
  includeProcedureReminders: boolean;
  dateFrom?: string;
  dateTo?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};
