import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';
import { FriendsRepository } from 'src/repositories/friend/FriendRepository';

@Injectable()
export class FriendsService {
  constructor(private readonly repo: FriendsRepository) {}

  async sendFriendRequest(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new BadRequestException("You can't send request to yourself");
    }

    const userExists = await this.repo.isUserExists(receiverId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const requestExists = await this.repo.isFriendRequestExists(
      senderId,
      receiverId,
    );
    if (requestExists) {
      throw new BadRequestException('Friend request already sent');
    }

    const areAlreadyFriends = await this.repo.isAlreadyFriends(
      senderId,
      receiverId,
    );
    if (areAlreadyFriends) {
      throw new BadRequestException('You are already friends');
    }

    await this.repo.createFriendRequest(senderId, receiverId);
    return { message: 'Friend request sent' };
  }

  async getIncomingFriendRequests(
    receiverId: number,
  ): Promise<IUserWithPassword[]> {
    const requests = await this.repo.getIncomingRequests(receiverId);

    if (requests.length === 0) {
      throw new NotFoundException('No incoming friend requests');
    }

    return requests;
  }

  async acceptRequest(requestId: number, currentUserId: number) {
    const request = await this.repo.findFriendRequestById(
      requestId,
      currentUserId,
    );

    if (!request) {
      throw new NotFoundException('Friend request not found or not authorized');
    }

    await this.repo.addFriends(request.receiver_id, request.sender_id);
    await this.repo.deleteFriendRequest(requestId);

    return { message: 'Friend request accepted' };
  }

  async getFriends(userId: number): Promise<IUser[]> {
    return await this.repo.getFriends(userId);
  }

  async declineRequest(
    requestId: number,
    receiverId: number,
  ): Promise<{ message: string }> {
    const success = await this.repo.deleteFriendRequestByIdAndReceiver(
      requestId,
      receiverId,
    );

    if (!success) {
      throw new NotFoundException(
        'Friend request not found or already handled',
      );
    }

    return { message: 'Friend request declined' };
  }
}
