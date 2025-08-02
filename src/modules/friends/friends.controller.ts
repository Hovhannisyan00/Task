import {
  Controller,
  Post,
  Get,
  Request,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequestInterface } from 'src/interfaces/auth/IAuthenticatedRequestInterface';
import { IUserWithPassword } from 'src/interfaces/user/IUserInterface';

@ApiBearerAuth()
@ApiTags('Friends')
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: 201, description: 'Request sent' })
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
  @ApiOperation({ summary: 'Get incoming friend requests' })
  @ApiResponse({ status: 200, type: [Object] })
  async incomingRequests(
    @Request() req: IAuthenticatedRequestInterface,
  ): Promise<IUserWithPassword[]> {
    return await this.friendsService.getIncomingFriendRequests(req.user.userId);
  }

  @Post('accept/:requestId')
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiParam({ name: 'requestId', type: Number })
  async accept(
    @Request() req: IAuthenticatedRequestInterface,
    @Param('requestId') requestId: string,
  ) {
    return await this.friendsService.acceptRequest(+requestId, req.user.userId);
  }

  @Post('decline/:requestId')
  @ApiOperation({ summary: 'Decline a friend request' })
  @ApiParam({ name: 'requestId', type: Number })
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
  @ApiOperation({ summary: 'Get list of friends' })
  async getFriends(@Request() req: IAuthenticatedRequestInterface) {
    return await this.friendsService.getFriends(req.user.userId);
  }
}
