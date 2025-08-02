import { Injectable } from '@nestjs/common';
import { db } from './database.provider';

@Injectable()
export class DatabaseService {
  async query<T = any>(sql: string, values?: any[]): Promise<T[]> {
    const result = await db.query<any>(sql, values);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.rows;
  }

  async queryOne<T = any>(sql: string, values?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, values);
    return rows[0] ?? null;
  }

  async exists(sql: string, values?: any[]): Promise<boolean> {
    const rows = await this.query(sql, values);
    return rows.length > 0;
  }
}
