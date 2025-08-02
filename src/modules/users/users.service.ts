import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/UserRepository';
import { ISearchUserParams } from 'src/interfaces/user/IUserSearch';
import { IUserWithPassword } from 'src/interfaces/user/IUserInterface';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async searchUsers(params: ISearchUserParams): Promise<IUserWithPassword[]> {
    return await this.userRepository.searchUsers(params);
  }
}
