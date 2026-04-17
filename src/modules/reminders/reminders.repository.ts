import { pool } from '@/db';

import { mapReminderRowToEntity } from './reminders.mappers';

import type {
  Reminder,
  ReminderRow,
  CreateReminderInput,
  UpdateReminderInput,
} from './reminders.types';

export const getAllRemindersByUserId = async (
  userId: string,
): Promise<Reminder[]> => {
  const result = await pool.query(
    `
      select *
      from reminders
      where user_id = $1
      order by date_time desc nulls last
    `,
    [userId],
  );

  return result.rows.map(mapReminderRowToEntity);
};

export const getReminderById = async (
  userId: string,
  reminderId: string,
): Promise<Reminder | null> => {
  const result = await pool.query(
    `
      select *
      from reminders
      where id = $1
        and user_id = $2
      limit 1
    `,
    [reminderId, userId],
  );

  const row = result.rows[0];

  return row ? mapReminderRowToEntity(row) : null;
};

export const createReminder = async (
  userId: string,
  input: CreateReminderInput,
): Promise<Reminder> => {
  const result = await pool.query<ReminderRow>(
    `
      insert into reminders (
        user_id,
        id,
        name,
        description,
        date_time,
        repeat,
        notifications,
        is_completed
      )
      values (
         $1,
         gen_random_uuid(),
         $2,
         $3,
         $4,
         $5::jsonb,
         $6::jsonb,
         $7
            )
      returning *
    `,
    [
      userId,
      input.name,
      input.description,
      input.dateTime,
      JSON.stringify(input.repeat),
      JSON.stringify(input.notifications),
      input.isCompleted ?? false,
    ],
  );

  return mapReminderRowToEntity(result.rows[0]);
};

export const updateReminder = async (
  userId: string,
  id: string,
  input: UpdateReminderInput,
): Promise<Reminder | null> => {
  const result = await pool.query<ReminderRow>(
    `
      update reminders
      set
        name = $2,
        description = $3,
        date_time = $4,
        repeat = $5::jsonb,
        notifications = $6::jsonb,
        is_completed = $7,
        updated_at = now()
      where id = $1
        and user_id = $8
      returning *
    `,
    [
      id,
      input.name,
      input.description,
      input.dateTime,
      JSON.stringify(input.repeat),
      JSON.stringify(input.notifications),
      input.isCompleted,
      userId,
    ],
  );

  const row = result.rows[0];

  return row ? mapReminderRowToEntity(row) : null;
};

export const deleteReminder = async (
  userId: string,
  id: string,
): Promise<boolean> => {
  const result = await pool.query(
    `
      delete from reminders
      where id = $1
        and user_id = $2
    `,
    [id, userId],
  );

  return (result.rowCount ?? 0) > 0;
};
