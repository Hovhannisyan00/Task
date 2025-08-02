import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user/UserRepository';
import { LoginDto } from '../users/dto/lolgin-user.dto';
import type { IUserWithPassword } from '../interfaces/user/IUserInterface';
import { JwtService } from '../services/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: RegisterUserDto): Promise<IUserWithPassword> {
    data.password = await bcrypt.hash(data.password, 10);
    const isExist: boolean = await this.userRepository.checkUserExists(
      data.email,
    );
    if (!isExist) {
      return this.userRepository.createUser(data);
    }
    throw new BadRequestException('User already exists');
  }

  async signIn(loginData: LoginDto) {
    const user = (await this.userRepository.findByEmail(
      loginData.email,
    )) as IUserWithPassword;

    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const match = await bcrypt.compare(loginData.password, user.password);

    if (!match) {
      throw new BadRequestException('Password is invalide');
    }

    const token = this.jwtService.generateToken({
      id: user.id,
      email: user.email,
    });

    return { token, user };
  }
}
