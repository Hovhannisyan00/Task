import { Pool } from 'pg';
import { DB_CONFIG } from '../configuration/.env_configurations/env.config';

const db_name: string = DB_CONFIG.DB_NAME;

const defaultPool = new Pool({
  host: DB_CONFIG.DB_DEFAULT_HOST,
  port: DB_CONFIG.DB_DEFAULT_PORT,
  user: DB_CONFIG.DB_DEFAULT_USER_NAME,
  password: DB_CONFIG.DB_DEFAULT_PASSWORD,
  database: DB_CONFIG.DB_DEFAULT_NAME,
});

export let db: Pool;

export async function initDb() {
  try {
    const dbCheck = await defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [db_name],
    );

    if (dbCheck.rowCount === 0) {
      await defaultPool.query(`CREATE DATABASE ${db_name};`);
      console.log(`Database "${db_name}" created`);
    } else {
      console.log(`Database "${db_name}" already exists`);
    }

    await defaultPool.end();

    db = new Pool({
      host: DB_CONFIG.DB_HOST,
      port: DB_CONFIG.DB_PORT,
      user: DB_CONFIG.DB_DEFAULT_NAME,
      password: DB_CONFIG.DB_PASSWORD,
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
  } catch (err: any) {
    console.error('Could not connect to PostgreSQL:', err);
    process.exit();
  }
}
