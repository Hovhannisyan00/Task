import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../../configuration/.env_configurations/env.config';
import { JwtPayload } from 'src/interfaces/jwt/IJwtInterface';
import { isErrorWithMessage } from 'src/utils/error/is-error-with-message.util';

@Injectable()
export class JwtService {
  private readonly accessTokenSecret = JWT_CONFIG.JWT_ACCESS_SECRET as string;
  private readonly refreshTokenSecret = JWT_CONFIG.JWT_REFRESH_SECRET as string;
  private readonly accessTokenExpiresIn = JWT_CONFIG.A_TOKEN_EXPIRES as string;
  private readonly refreshTokenExpiresIn = JWT_CONFIG.R_TOKEN_EXPIRES as string;

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  verifyAccessToken(token: string): string | jwt.JwtPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (err) {
      if (isErrorWithMessage(err)) {
        throw new BadRequestException(err.message);
      }

      throw new BadRequestException('Something went wrong');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret);

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid refresh token format');
      }

      return decoded as JwtPayload;
    } catch (err) {
      if (isErrorWithMessage(err)) {
        throw new BadRequestException(err.message);
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
