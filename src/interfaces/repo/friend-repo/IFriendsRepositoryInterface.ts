import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';

export interface IFriendsRepository {
  isUserExists(userId: number): Promise<boolean>;

  isFriendRequestExists(senderId: number, receiverId: number): Promise<boolean>;

  isAlreadyFriends(userId: number, friendId: number): Promise<boolean>;

  createFriendRequest(senderId: number, receiverId: number): Promise<void>;

  getIncomingRequests(receiverId: number): Promise<IUserWithPassword[]>;

  addFriends(userId: number, friendId: number): Promise<void>;

  deleteFriendRequest(requestId: number): Promise<void>;

  getFriends(userId: number): Promise<IUser[]>;

  findFriendRequestById(
    requestId: number,
    receiverId: number,
  ): Promise<{ sender_id: number; receiver_id: number } | null>;

  deleteFriendRequestByIdAndReceiver(
    requestId: number,
    receiverId: number,
  ): Promise<boolean>;
}
