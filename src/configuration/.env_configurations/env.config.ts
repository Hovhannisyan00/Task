import * as process from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

export const SERVER_CONFIG = Object.freeze({
  APP_PORT: parseInt(process.env.APP_PORT || '3000', 10),
});

export const JWT_CONFIG = Object.freeze({
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  A_TOKEN_EXPIRES: process.env.A_TOKEN_EXPIRES,
  R_TOKEN_EXPIRES: process.env.R_TOKEN_EXPIRES,
});

export const DB_CONFIG = Object.freeze({
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/test',
  DB_NAME: process.env.DB_NAME || 'test',
  DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,

  DB_DEFAULT_PASSWORD: process.env.DB_DEFAULT_PASSWORD,
  DB_DEFAULT_USER_NAME: process.env.DB_DEFAULT_USER_NAME,
  DB_DEFAULT_NAME: process.env.DB_DEFAULT_NAME,
  DB_DEFAULT_PORT: process.env.DB_DEFAULT_PORT
    ? Number(process.env.DB_DEFAULT_PORT)
    : 5432,
  DB_DEFAULT_HOST: process.env.DB_DEFAULT_HOST,
});
