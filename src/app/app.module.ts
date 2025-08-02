import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SERVER_CONFIG } from '../configuration/.env_configurations/env.config';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PassportModule,
    FriendsModule,
    JwtModule.register({
      secret: String(SERVER_CONFIG.JWT_SECRET),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
