import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from 'src/repositories/friend/FriendRepository';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository],
})
export class FriendsModule {}
