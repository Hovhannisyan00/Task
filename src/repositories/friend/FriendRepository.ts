import { Injectable } from '@nestjs/common';
import { db } from 'src/database/database.provider';
import { IUser, IUserWithPassword } from 'src/interfaces/user/IUserInterface';

@Injectable()
export class FriendsRepository {
  async isUserExists(userId: number): Promise<boolean> {
    const result = await db.query(`SELECT id FROM users WHERE id = $1`, [
      userId,
    ]);
    return !!result?.rowCount && result.rowCount > 0;
  }

  async isFriendRequestExists(
    senderId: number,
    receiverId: number,
  ): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2`,
      [senderId, receiverId],
    );
    return !!result?.rowCount && result.rowCount > 0;
  }

  async isAlreadyFriends(userId: number, friendId: number): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM friends WHERE user_id = $1 AND friend_id = $2`,
      [userId, friendId],
    );
    return !!result?.rowCount && result.rowCount > 0;
  }

  async createFriendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<void> {
    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [senderId, receiverId],
    );
  }

  async getIncomingRequests(receiverId: number): Promise<IUserWithPassword[]> {
    const result = await db.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email, u.age
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.id
      WHERE fr.receiver_id = $1
      ORDER BY fr.created_at DESC;
      `,
      [receiverId],
    );

    return result.rows as IUserWithPassword[];
  }

  async addFriends(userId: number, friendId: number): Promise<void> {
    await db.query(
      `INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1) ON CONFLICT DO NOTHING`,
      [userId, friendId],
    );
  }

  async deleteFriendRequest(requestId: number): Promise<void> {
    await db.query(`DELETE FROM friend_requests WHERE id = $1`, [requestId]);
  }

  async getFriends(userId: number): Promise<IUser[]> {
    const result = await db.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email, u.age
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = $1
      ORDER BY u.first_name ASC;
      `,
      [userId],
    );

    return result.rows as IUser[];
  }

  async findFriendRequestById(
    requestId: number,
    receiverId: number,
  ): Promise<{ sender_id: number; receiver_id: number } | null> {
    const result = await db.query(
      `
      SELECT sender_id, receiver_id
      FROM friend_requests
      WHERE id = $1 AND receiver_id = $2
      `,
      [requestId, receiverId],
    );
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async deleteFriendRequestByIdAndReceiver(
    requestId: number,
    receiverId: number,
  ): Promise<boolean> {
    console.log(receiverId, requestId);
    const result = await db.query(
      `DELETE FROM friend_requests WHERE id = $1 AND receiver_id = $2 RETURNING id`,
      [requestId, receiverId],
    );
    console.log(1212, result);

    return true;
  }
}
