import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SERVER_CONFIG } from '../../configuration/.env_configurations/env.config';

@Injectable()
export class JwtService {
  private readonly jwtSecret = SERVER_CONFIG.JWT_SECRET;

  generateToken(payload: object): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return error;
    }
  }
}
