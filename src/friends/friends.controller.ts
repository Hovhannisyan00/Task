import { Controller } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Post, Get, Request, Body, Param, UseGuards } from '@nestjs/common';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequestInterface } from 'src/interfaces/auth/IAuthenticatedRequestInterface';
import { IUserWithPassword } from 'src/interfaces/user/IUserInterface';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  async sendRequest(
    @Request() req: IAuthenticatedRequestInterface,
    @Body() dto: SendFriendRequestDto,
  ) {
    return await this.friendsService.sendFriendRequest(
      req.user.userId,
      dto.receiverId,
    );
  }

  @Get('requests')
  async incomingRequests(
    @Request() req: IAuthenticatedRequestInterface,
  ): Promise<IUserWithPassword[]> {
    return await this.friendsService.getIncomingFriendRequests(req.user.userId);
  }

  @Post('accept/:requestId')
  async accept(
    @Request() req: IAuthenticatedRequestInterface,
    @Param('requestId') requestId: string,
  ) {
    return await this.friendsService.acceptRequest(+requestId, req.user.userId);
  }

  @Post('decline/:requestId')
  async decline(
    @Request() req: IAuthenticatedRequestInterface,
    @Param('requestId') requestId: string,
  ) {
    return await this.friendsService.declineRequest(
      +requestId,
      req.user.userId,
    );
  }

  @Get()
  async getFriends(@Request() req: IAuthenticatedRequestInterface) {
    return await this.friendsService.getFriends(req.user.userId);
  }
}
