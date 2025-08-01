import * as process from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

export const SERVER_CONFIG = Object.freeze({
  APP_PORT: parseInt(process.env.APP_PORT || '3000', 10),
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/test',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key',
  DB_NAME: process.env.DB_NAME || 'test',
});
