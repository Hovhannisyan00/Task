import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from 'src/repositories/friend/FriendRepository';
import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository, DatabaseService],
  exports: [FriendsRepository],
})
export class FriendsModule {}
