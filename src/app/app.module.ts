import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FriendsModule } from 'src/modules/friends/friends.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PassportModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
