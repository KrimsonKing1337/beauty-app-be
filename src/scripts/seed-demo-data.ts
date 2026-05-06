import { randomUUID } from 'node:crypto';

import { pool } from '@/db';

const USER_ID = 'dffdf6b6-8dfe-4a7e-a722-0c63f6feb0ae';

const procedureNames = [
  'Маникюр',
  'Педикюр',
  'Стрижка',
  'Окрашивание',
  'Брови',
  'Массаж',
  'Чистка лица',
  'Укладка',
];

const reminderNames = [
  'Записаться на процедуру',
  'Купить средство',
  'Сделать маску',
  'Обновить уход',
  'Проверить запись',
];

const randomItem = <T>(items: T[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const randomFutureDate = () => {
  const date = new Date();

  date.setFullYear(date.getFullYear() + 1);
  date.setDate(date.getDate() + Math.floor(Math.random() * 365));

  date.setHours(Math.floor(Math.random() * 12) + 8);
  date.setMinutes(Math.random() > 0.5 ? 0 : 30);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

const seed = async () => {
  for (let i = 0; i < 300; i += 1) {
    await pool.query(
      `
        insert into procedures (
          id,
          user_id,
          procedure_name,
          date_time,
          place,
          duration_hours,
          duration_minutes,
          price,
          before_image_paths,
          after_image_paths,
          notes
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        randomUUID(),
        USER_ID,
        randomItem(procedureNames),
        randomFutureDate().toISOString(),
        randomItem(['Дом', 'Салон', 'Клиника', 'Мастер']),
        Math.floor(Math.random() * 3),
        randomItem([0, 15, 30, 45]),
        Math.floor(Math.random() * 8000) + 1000,
        [],
        [],
        'Тестовая процедура',
      ],
    );
  }

  for (let i = 0; i < 300; i += 1) {
    await pool.query(
      `
        insert into reminders (
          id,
          user_id,
          name,
          description,
          date_time,
          repeat,
          notifications,
          is_completed
        )
        values ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        randomUUID(),
        USER_ID,
        randomItem(reminderNames),
        'Тестовое напоминание',
        randomFutureDate().toISOString(),
        JSON.stringify({
          unit: 'none',
          interval: 1,
          daysOfWeek: [],
        }),
        JSON.stringify({
          daysBefore: Math.floor(Math.random() * 3),
          hoursBefore: Math.floor(Math.random() * 12),
          minutesBefore: randomItem([0, 5, 10, 15, 30]),
        }),
        false,
      ],
    );
  }

  await pool.end();
};

seed();
