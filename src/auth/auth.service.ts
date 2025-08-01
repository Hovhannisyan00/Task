import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/User/UserRepository';
import { LoginDto } from '../users/dto/lolgin-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(data: RegisterUserDto) {
    data.password = await bcrypt.hash(data.password, 10);
    const isExist: boolean = await this.userRepository.checkUserExists(
      data.email,
    );
    if (!isExist) {
      return this.userRepository.createUser(data);
    }
    return new BadRequestException('User already exists');
  }

  async signIn(loginData: LoginDto) {
    const isExist  = await this.userRepository.findByEmail(
      loginData.email,
    );
    if (!isExist) {
      return new BadRequestException('User does not exist');
    }
    console.log(loginData);
  }
}
