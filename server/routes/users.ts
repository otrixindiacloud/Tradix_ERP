import { Router } from "express";
import { db } from "../db";
import { users } from "../../shared/schemas/users-customers";
import { eq, desc, and, like, sql } from "drizzle-orm";

const router = Router();

// Get all users with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      role,
      search
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereConditions = [];
    
    if (role) {
      whereConditions.push(eq(users.role, role as string));
    }
    
    if (search) {
      whereConditions.push(
        sql`(${users.firstName} ILIKE ${`%${search}%`} OR ${users.lastName} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`} OR ${users.username} ILIKE ${`%${search}%`})`
      );
    }

    const userList = await db
      .select()
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(Number(limit))
      .offset(offset);

    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    res.json({
      users: userList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(totalCount[0]?.count || 0),
        pages: Math.ceil(Number(totalCount[0]?.count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { username, email, firstName, lastName, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({ error: "Username and role are required" });
    }

    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        firstName,
        lastName,
        role
      })
      .returning();

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, role, profileImageUrl } = req.body;

    const updatedUser = await db
      .update(users)
      .set({
        username,
        email,
        firstName,
        lastName,
        role,
        profileImageUrl,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deletedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Get user roles and statistics
router.get("/stats/roles", async (req, res) => {
  try {
    const roleStats = await db
      .select({
        role: users.role,
        count: sql`count(*)`
      })
      .from(users)
      .groupBy(users.role);

    const totalUsers = await db
      .select({ count: sql`count(*)` })
      .from(users);

    res.json({
      roleStats,
      totalUsers: Number(totalUsers[0]?.count || 0)
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

export default router;
