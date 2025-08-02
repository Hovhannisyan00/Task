import { RegisterUserDto } from '../users/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user/UserRepository';
import { LoginDto } from '../users/dto/login-user.dto';
import type { IUserWithPassword } from '../../interfaces/user/IUserInterface';
import { JwtService } from '../../services/jwt/jwt.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthenticatedRequestInterface } from 'src/interfaces/auth/IAuthenticatedRequestInterface';

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

  async signIn(loginData: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUserWithPassword;
  }> {
    const user = (await this.userRepository.findByEmail(
      loginData.email,
    )) as IUserWithPassword;

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const match = await bcrypt.compare(loginData.password, user.password);

    if (!match) {
      throw new BadRequestException('Password is invalid');
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword as IUserWithPassword,
    };
  }

  createToken(req: IAuthenticatedRequestInterface): { accessToken: string } {
    const refreshToken = req.headers?.['refreshtoken'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in headers');
    }

    const payload = this.jwtService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: payload.id,
      email: payload.email,
    });

    return { accessToken };
  }
}
