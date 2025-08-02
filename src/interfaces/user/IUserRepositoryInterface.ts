import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { IUser } from './IUserInterface';

export interface IUserRepository {
  register(user: RegisterUserDto): Promise<IUser>;

  // findByEmail(email: string): Promise<IUser | null>;
}
