import { Pool } from 'pg';
import { SERVER_CONFIG } from '../configuration/.env_configurations/env.config';

const db_name: string = SERVER_CONFIG.DB_NAME;
const defaultPool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: db_name,
});

export const db = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: SERVER_CONFIG.DB_NAME,
});

export async function initDb() {
  const dbCheck = await defaultPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1;`,
    [db_name],
  );

  if (dbCheck.rowCount === 0) {
    await defaultPool.query(`CREATE DATABASE ${db_name};`);
  }

  await defaultPool.end();

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
                                       id SERIAL PRIMARY KEY,
                                       first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INTEGER CHECK (age >= 13),
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `);
}
