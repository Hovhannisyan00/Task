import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';
import { ISearchUserParams } from 'src/interfaces/user/IUserSearch';
import { RegisterUserDto } from 'src/modules/users/dto/register-user.dto';

export interface IUserRepository {
  createUser(dto: RegisterUserDto): Promise<IUserWithPassword>;

  checkUserExists(email: string): Promise<boolean>;

  findByEmail(email: string): Promise<IUser | null>;

  searchUsers(params: ISearchUserParams): Promise<IUserWithPassword[]>;
}
