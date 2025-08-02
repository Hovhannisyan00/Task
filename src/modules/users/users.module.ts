import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from '../../repositories/user/UserRepository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, DatabaseService],
  exports: [UserRepository],
})
export class UsersModule {}
