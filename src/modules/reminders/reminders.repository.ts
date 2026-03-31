import { pool } from '@/db';

import { mapReminderRowToEntity } from './reminders.mapper';

import type {
  Reminder,
  ReminderRow,
  CreateReminderInput,
  UpdateReminderInput,
} from './reminders.types';

export const getAllRemindersRepository = async (): Promise<Reminder[]> => {
  const result = await pool.query<ReminderRow>(
    `
        SELECT
            id,
            name,
            description,
            date_time,
            repeat,
            notifications,
            is_completed,
            created_at,
            updated_at
        FROM reminders
        ORDER BY date_time ASC
    `,
  );

  return result.rows.map(mapReminderRowToEntity);
};

export const getReminderByIdRepository = async (
  id: string,
): Promise<Reminder | null> => {
  const result = await pool.query<ReminderRow>(
    `
        SELECT
            id,
            name,
            description,
            date_time,
            repeat,
            notifications,
            is_completed,
            created_at,
            updated_at
        FROM reminders
        WHERE id = $1
        LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];

  return row ? mapReminderRowToEntity(row) : null;
};

export const createReminderRepository = async (
  input: CreateReminderInput,
): Promise<Reminder> => {
  const result = await pool.query<ReminderRow>(
    `
        INSERT INTO reminders (
            id,
            name,
            description,
            date_time,
            repeat,
            notifications,
            is_completed
        )
        VALUES (
             gen_random_uuid(),
             $1,
             $2,
             $3,
             $4::jsonb,
             $5::jsonb,
             $6
        )
        RETURNING
            id,
            name,
            description,
            date_time,
            repeat,
            notifications,
            is_completed,
            created_at,
            updated_at
    `,
    [
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

export const updateReminderRepository = async (
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
      WHERE id = $1
      RETURNING
        id,
        name,
        description,
        date_time,
        repeat,
        notifications,
        is_completed,
        created_at,
        updated_at
    `,
    [
      id,
      input.name,
      input.description,
      input.dateTime,
      JSON.stringify(input.repeat),
      JSON.stringify(input.notifications),
      input.isCompleted,
    ],
  );

  const row = result.rows[0];

  return row ? mapReminderRowToEntity(row) : null;
};

export const deleteReminderRepository = async (
  id: string,
): Promise<boolean> => {
  const result = await pool.query(
    `
        DELETE FROM reminders
        WHERE id = $1
    `,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
};
