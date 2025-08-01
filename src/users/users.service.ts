import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRepository } from '../repositories/User/UserRepository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(data: RegisterUserDto) {
    data.password = await bcrypt.hash(data.password, 10);
    // return this.userRepository.register(data);
  }
}
