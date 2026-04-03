import { pool } from '@/db';

import { mapReminderRowToEntity } from './reminders.mapper';

import type {
  Reminder,
  ReminderRow,
  CreateReminderInput,
  UpdateReminderInput,
} from './reminders.types';

export const getAllByUserId = async (userId: string): Promise<Reminder[]> => {
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
        INSERT INTO reminders (
            user_id,
            id,
            name,
            description,
            date_time,
            repeat,
            notifications,
            is_completed
        )
        VALUES (
             $1,
             gen_random_uuid(),
             $2,
             $3,
             $4,
             $5::jsonb,
             $6::jsonb,
             $7
        )
        RETURNING *
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
      UPDATE reminders
      SET
        name = $2,
        description = $3,
        date_time = $4,
        repeat = $5::jsonb,
        notifications = $6::jsonb,
        is_completed = $7,
        updated_at = NOW()
      WHERE id = $1 AND user_id = $8
      RETURNING *
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
        DELETE FROM reminders
        WHERE id = $1 AND user_id = $2
    `,
    [id, userId],
  );

  return (result.rowCount ?? 0) > 0;
};
