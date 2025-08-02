import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../modules/users/dto/register-user.dto';
import { db } from '../../database/database.provider';
import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';
import { ISearchUserParams } from 'src/interfaces/user/IUserSearch';
import { IUserRepository } from 'src/interfaces/repo/user-repo/IUserRepositoryInterface';

@Injectable()
export class UserRepository implements IUserRepository {
  async createUser(dto: RegisterUserDto) {
    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, age, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, age`,
      [dto.first_name, dto.last_name, dto.email, dto.age, dto.password],
    );
    return result.rows[0] as IUserWithPassword;
  }

  async checkUserExists(email: string): Promise<boolean> {
    const result = await db.query(
      `SELECT id FROM users
       WHERE email = $1`,
      [email],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async findByEmail(email: string): Promise<IUser> {
    const result = await db.query<IUser>(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0] || null;
  }

  async searchUsers(params: ISearchUserParams): Promise<IUserWithPassword[]> {
    const { firstName, lastName, age } = params;

    let sql = `
      SELECT id, first_name, last_name, age, email 
      FROM users 
      WHERE 1=1
    `;
    const values: any[] = [];

    if (firstName) {
      sql += ' AND first_name ILIKE $' + (values.length + 1);
      values.push(`%${firstName}%`);
    }

    if (lastName) {
      sql += ' AND last_name ILIKE $' + (values.length + 1);
      values.push(`%${lastName}%`);
    }

    if (age !== undefined) {
      sql += ' AND age = $' + (values.length + 1);
      values.push(age);
    }

    const result = await db.query(sql, values);

    return result.rows as IUserWithPassword[];
  }
}
