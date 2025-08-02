import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../users/dto/register-user.dto';
import { db } from '../../database/database.provider';

@Injectable()
export class UserRepository {
  async createUser(dto: RegisterUserDto) {
    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, age, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, age`,
      [dto.first_name, dto.last_name, dto.email, dto.age, dto.password],
    );
    return result.rows[0];
  }

  async checkUserExists(email: string): Promise<boolean> {
    const result = await db.query(
      `SELECT id
                                   FROM users
                                   WHERE email = $1`,
      [email],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async findByEmail(email: string) {
    const result = await db.query(
      `SELECT *
                                   FROM users
                                   WHERE email = $1`,
      [email],
    );
    return result.rows[0] || null;
  }

  async checkUserPassword(email: string, hashPassword: string) {
    // const result =
  }
}
