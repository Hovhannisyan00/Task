import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { IFriendsRepository } from 'src/interfaces/repo/friend-repo/IFriendsRepositoryInterface';
import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';

@Injectable()
export class FriendsRepository implements IFriendsRepository {
  constructor(private readonly db: DatabaseService) {}

  async isUserExists(userId: number): Promise<boolean> {
    return this.db.exists(`SELECT id FROM users WHERE id = $1`, [userId]);
  }

  async isFriendRequestExists(
    senderId: number,
    receiverId: number,
  ): Promise<boolean> {
    return this.db.exists(
      `SELECT 1 FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2`,
      [senderId, receiverId],
    );
  }

  async isAlreadyFriends(userId: number, friendId: number): Promise<boolean> {
    return this.db.exists(
      `SELECT 1 FROM friends WHERE user_id = $1 AND friend_id = $2`,
      [userId, friendId],
    );
  }

  async createFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [senderId, receiverId],
    );
  }

  async getIncomingRequests(receiverId: number): Promise<IUserWithPassword[]> {
    return this.db.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email, u.age
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.id
      WHERE fr.receiver_id = $1
      ORDER BY fr.created_at DESC;
      `,
      [receiverId],
    );
  }

  async addFriends(userId: number, friendId: number): Promise<void> {
    await this.db.query(
      `INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1) ON CONFLICT DO NOTHING`,
      [userId, friendId],
    );
  }

  async deleteFriendRequest(requestId: number): Promise<void> {
    await this.db.query(`DELETE FROM friend_requests WHERE sender_id = $1`, [
      requestId,
    ]);
  }

  async getFriends(userId: number): Promise<IUser[]> {
    return this.db.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email, u.age
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = $1
      ORDER BY u.first_name ASC;
      `,
      [userId],
    );
  }

  async findFriendRequestById(
    requestId: number,
    receiverId: number,
  ): Promise<{ sender_id: number; receiver_id: number } | null> {
    return this.db.queryOne(
      `
      SELECT sender_id, receiver_id
      FROM friend_requests
      WHERE sender_id = $1 AND receiver_id = $2
      `,
      [requestId, receiverId],
    );
  }

  async deleteFriendRequestByIdAndReceiver(
    requestId: number,
    receiverId: number,
  ): Promise<boolean> {
    const rows = await this.db.query(
      `DELETE FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2 RETURNING id`,
      [requestId, receiverId],
    );
    return rows.length > 0;
  }
}
