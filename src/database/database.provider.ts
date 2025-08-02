import { Pool } from 'pg';
import { SERVER_CONFIG } from '../configuration/.env_configurations/env.config';

const db_name: string = SERVER_CONFIG.DB_NAME;

const defaultPool = new Pool({
  host: SERVER_CONFIG.DB_HOST,
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

export let db: Pool;

export async function initDb() {
  const dbCheck = await defaultPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1;`,
    [db_name],
  );

  if (dbCheck.rowCount === 0) {
    await defaultPool.query(`CREATE DATABASE ${db_name};`);
    console.log(`Database "${db_name}" created`);
  }

  await defaultPool.end();

  db = new Pool({
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: db_name,
  });

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
  console.log('Table "users" ensured');

  await db.query(`
    CREATE TABLE IF NOT EXISTS friend_requests (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(sender_id, receiver_id)
    );
  `);
  console.log('Table "friend_requests" ensured');

  await db.query(`
    CREATE TABLE IF NOT EXISTS friends (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      friend_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, friend_id)
    );
  `);
  console.log('Table "friends" ensured');
}
