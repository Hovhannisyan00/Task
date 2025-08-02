import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserWithPassword } from 'src/interfaces/user/IUserInterface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  async search(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('age') age?: string,
  ): Promise<IUserWithPassword[]> {
    const ageNumber = age ? parseInt(age, 10) : undefined;
    return await this.usersService.searchUsers({
      firstName,
      lastName,
      age: ageNumber,
    });
  }
}
