import { RegisterUserDto } from 'src/users/dto/register-user.dto';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  created_at: Date;
}

export interface IUserRepository {
  register(user: RegisterUserDto): Promise<IUser>;

  // findByEmail(email: string): Promise<IUser | null>;
}
