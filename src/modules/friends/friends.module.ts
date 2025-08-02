import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from 'src/repositories/friend/FriendRepository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository],
})
export class FriendsModule {}
