import { users, type User } from "@shared/schema";
import { db } from "../db.js";
import { eq } from "drizzle-orm";
import { BaseStorage } from './base.js';
import { IUserStorage } from './interfaces.js';

export class UserStorage extends BaseStorage implements IUserStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async logAuditEvent(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    oldData?: any,
    newData?: any
  ): Promise<void> {
    // User storage doesn't implement audit logging directly
    // This will be handled by the main storage class
    console.log(`Audit: ${action} on ${entityType} ${entityId} by ${userId}`);
  }
}
