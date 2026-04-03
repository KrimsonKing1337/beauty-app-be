import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT),
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
};
