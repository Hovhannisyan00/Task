import {
  BadRequestException,
  Request,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { LoginDto } from '../users/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IUserWithPassword } from 'src/interfaces/user/IUserInterface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtService } from 'src/services/jwt/jwt.service';
import { IAuthenticatedRequestInterface } from 'src/interfaces/auth/IAuthenticatedRequestInterface';
import { isErrorWithMessage } from 'src/utils/error/is-error-with-message.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(201)
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or user already exists',
  })
  async signUp(@Body() userDto: RegisterUserDto) {
    try {
      return await this.authService.signUp(userDto);
    } catch (err) {
      if (isErrorWithMessage(err)) {
        throw new BadRequestException(err.message);
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful, cookie set' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async sigIn(
    @Body() userDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserWithPassword> {
    try {
      const { accessToken, refreshToken, user } =
        await this.authService.signIn(userDto);

      const nodeEnv =
        this.configService.get<string>('NODE_ENV') ?? 'development';

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: nodeEnv === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: nodeEnv === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      return user;
    } catch (err) {
      if (isErrorWithMessage(err)) {
        throw new BadRequestException(err.message);
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  signOut(@Res() res: Response) {
    const nodeEnv = this.configService.get<string>('NODE_ENV') ?? 'development';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Successfully logged out' });
  }

  @Post('refresh')
  refresh(@Req() req: IAuthenticatedRequestInterface, @Res() res: Response) {
    const nodeEnv = this.configService.get<string>('NODE_ENV') ?? 'development';

    const { accessToken } = this.authService.createToken(req);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      maxAge: 15 * 60 * 1000,
      sameSite: 'strict',
    });

    return res.status(200).json({ accessToken });
  }
}
