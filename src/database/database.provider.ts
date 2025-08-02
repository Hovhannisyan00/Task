import { Pool } from 'pg';
import { SERVER_CONFIG } from '../configuration/.env_configurations/env.config';

const db_name: string = SERVER_CONFIG.DB_NAME;

// 1. Подключение к дефолтной БД postgres
const defaultPool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres', // ✅ всегда существует
});

// 2. Позже создадим подключение к нашей базе
export let db: Pool;

export async function initDb() {
  // 3. Проверяем: существует ли БД
  const dbCheck = await defaultPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1;`,
    [db_name],
  );

  // 4. Если не существует — создаём
  if (dbCheck.rowCount === 0) {
    await defaultPool.query(`CREATE DATABASE ${db_name};`);
    console.log(`✅ Database "${db_name}" created`);
  }

  // 5. Закрываем соединение с postgres
  await defaultPool.end();

  // 6. Подключаемся к нашей новой базе
  db = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: db_name,
  });

  // 7. Создаём таблицу users, если нет
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

  console.log('✅ Table "users" ensured');
}
