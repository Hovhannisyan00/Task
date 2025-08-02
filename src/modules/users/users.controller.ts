import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users by first name, last name or age' })
  async search(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('age') age?: string,
  ) {
    const ageNumber = age ? parseInt(age, 10) : undefined;
    return await this.usersService.searchUsers({
      firstName,
      lastName,
      age: ageNumber,
    });
  }
}
