import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginDto } from '../users/dto/lolgin-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(201)
  @Post('register')
  async signUp(@Body() userDto: RegisterUserDto) {
    try {
      return await this.authService.signUp(userDto);
    } catch (err) {
      throw new BadRequestException(err.message || 'Something went wrong');
    }
  }

  @HttpCode(200)
  @Post('login')
  async sigIn(
    @Body() userDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { token, user } = await this.authService.signIn(userDto);

      const nodeEnv =
        this.configService.get<string>('NODE_ENV') ?? 'development';

      res.cookie('token', token, {
        httpOnly: true,
        secure: nodeEnv === 'production',
        maxAge: 360000,
        sameSite: 'strict',
      });

      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message || 'Something went wrong');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  signOut(@Res() res: Response) {
    const nodeEnv = this.configService.get<string>('nodeEnv');

    res.clearCookie('token', {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Successfully logged out' });
  }
}
