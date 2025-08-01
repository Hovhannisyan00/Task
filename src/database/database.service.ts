import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      user: '',
      host: 'localhost',
      database: 'test',
      port: 5432,
    });

    // Optional: Test connection
    const client = await this.pool.connect();
    console.log('Connected to PostgreSQL');
    client.release();
  }

  async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      return res;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
