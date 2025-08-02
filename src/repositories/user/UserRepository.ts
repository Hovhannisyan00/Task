import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../modules/users/dto/register-user.dto';
import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';
import { ISearchUserParams } from 'src/interfaces/user/IUserSearch';
import { IUserRepository } from 'src/interfaces/repo/user-repo/IUserRepositoryInterface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly db: DatabaseService) {}

  async createUser(dto: RegisterUserDto) {
    const rows = await this.db.query<IUserWithPassword>(
      `INSERT INTO users (first_name, last_name, email, age, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, age`,
      [dto.first_name, dto.last_name, dto.email, dto.age, dto.password],
    );
    return rows[0];
  }

  async checkUserExists(email: string): Promise<boolean> {
    return await this.db.exists(`SELECT 1 FROM users WHERE email = $1`, [
      email,
    ]);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.db.queryOne<IUser>(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
  }

  async searchUsers(params: ISearchUserParams): Promise<IUserWithPassword[]> {
    const { firstName, lastName, age } = params;

    let sql = `SELECT id, first_name, last_name, age, email FROM users WHERE 1=1`;
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

    return await this.db.query<IUserWithPassword>(sql, values);
  }
}
