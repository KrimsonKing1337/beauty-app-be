import { pool } from '@/db';

import { mapReminderRowToEntity } from './reminders.mappers';

import type {
  Reminder,
  ReminderRow,
  CreateReminderInput,
  GetRemindersQuery,
  PaginatedResponse,
  UpdateReminderInput,
} from './reminders.types';

const reminderSortColumns: Record<GetRemindersQuery['sortBy'], string> = {
  dateTime: 'date_time',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  name: 'name',
};

const buildRemindersWhere = (
  userId: string,
  query: GetRemindersQuery,
) => {
  const values: unknown[] = [userId];
  const where: string[] = ['user_id = $1'];

  if (query.search) {
    values.push(`%${query.search}%`);

    where.push(`
      (
        name ilike $${values.length}
        or description ilike $${values.length}
      )
    `);
  }

  if (query.isCompleted !== null) {
    values.push(query.isCompleted);
    where.push(`is_completed = $${values.length}`);
  }

  if (query.procedureId) {
    values.push(query.procedureId);
    where.push(`procedure_id = $${values.length}`);
  }

  if (!query.includeProcedureReminders) {
    where.push('procedure_id is null');
  }

  if (query.dateFrom) {
    values.push(query.dateFrom);
    where.push(`date_time >= $${values.length}`);
  }

  if (query.dateTo) {
    values.push(query.dateTo);
    where.push(`date_time < $${values.length}`);
  }

  return {
    values,
    whereSql: where.join(' and '),
  };
};

export const getAllRemindersByUserId = async (
  userId: string,
  query: GetRemindersQuery,
): Promise<PaginatedResponse<Reminder>> => {
  const { values, whereSql } = buildRemindersWhere(userId, query);

  const countResult = await pool.query(
    `
      select count(*)::int as total
      from reminders
      where ${whereSql}
    `,
    values,
  );

  const total = countResult.rows[0]?.total ?? 0;
  const totalPages = Math.ceil(total / query.limit);
  const offset = (query.page - 1) * query.limit;

  const sortColumn = reminderSortColumns[query.sortBy];
  const sortDirection = query.sortOrder === 'asc' ? 'asc' : 'desc';

  const dataValues = [...values, query.limit, offset];

  const result = await pool.query<ReminderRow>(
    `
      select *
      from reminders
      where ${whereSql}
      order by ${sortColumn} ${sortDirection} nulls last, id desc
      limit $${dataValues.length - 1}
      offset $${dataValues.length}
    `,
    dataValues,
  );

  return {
    items: result.rows.map(mapReminderRowToEntity),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
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
            procedure_id,
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
           $7,
           $8
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
      input.procedureId ?? null,
      input.isCompleted ?? false,
    ],
  );

  return mapReminderRowToEntity(result.rows[0]);
};

export const updateReminder = async (
  userId: string,
  id: string,
  input: Required<Pick<
    UpdateReminderInput,
    'name' | 'description' | 'dateTime' | 'repeat' | 'notifications' | 'isCompleted'
  >> & {
    procedureId: string | null;
  },
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
            procedure_id = $7,
            is_completed = $8,
            updated_at = now()
        where id = $1
          and user_id = $9
        returning *
    `,
    [
      id,
      input.name,
      input.description,
      input.dateTime,
      JSON.stringify(input.repeat),
      JSON.stringify(input.notifications),
      input.procedureId,
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
