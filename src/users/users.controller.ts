import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  aaa(@Body() userData: RegisterUserDto) {
    console.log(userData);
    return this.usersService.registerUser(userData);
  }
}
