import { Router } from "express";
import { db } from "../db";
import { pgTable, varchar, text, jsonb, timestamp, sql } from "drizzle-orm/pg-core";

// System settings table
const systemSettings = pgTable("system_settings", {
  id: varchar("id", { length: 100 }).primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  key: varchar("key", { length: 100 }).notNull(),
  value: text("value"),
  jsonValue: jsonb("json_value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by", { length: 100 })
});

const router = Router();

// Get all settings
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    
    let whereCondition = {};
    if (category) {
      whereCondition = { category: category as string };
    }

    const settings = await db
      .select()
      .from(systemSettings)
      .where(category ? eq(systemSettings.category, category as string) : undefined)
      .orderBy(systemSettings.category, systemSettings.key);

    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Get setting by key
router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key))
      .limit(1);

    if (setting.length === 0) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json(setting[0]);
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

// Update setting
router.put("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { value, jsonValue, description, updatedBy } = req.body;

    const updatedSetting = await db
      .update(systemSettings)
      .set({
        value,
        jsonValue,
        description,
        updatedAt: new Date(),
        updatedBy
      })
      .where(eq(systemSettings.key, key))
      .returning();

    if (updatedSetting.length === 0) {
      // Create new setting if it doesn't exist
      const newSetting = await db
        .insert(systemSettings)
        .values({
          id: key,
          key,
          value,
          jsonValue,
          description,
          updatedBy
        })
        .returning();

      return res.json(newSetting[0]);
    }

    res.json(updatedSetting[0]);
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

// Get settings by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    
    const settings = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.category, category))
      .orderBy(systemSettings.key);

    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings by category:", error);
    res.status(500).json({ error: "Failed to fetch settings by category" });
  }
});

// Bulk update settings
router.put("/bulk", async (req, res) => {
  try {
    const { settings, updatedBy } = req.body;

    if (!Array.isArray(settings)) {
      return res.status(400).json({ error: "Settings must be an array" });
    }

    const results = [];
    
    for (const setting of settings) {
      const { key, value, jsonValue, description, category } = setting;
      
      const updatedSetting = await db
        .update(systemSettings)
        .set({
          value,
          jsonValue,
          description,
          category,
          updatedAt: new Date(),
          updatedBy
        })
        .where(eq(systemSettings.key, key))
        .returning();

      if (updatedSetting.length === 0) {
        // Create new setting if it doesn't exist
        const newSetting = await db
          .insert(systemSettings)
          .values({
            id: key,
            key,
            value,
            jsonValue,
            description,
            category,
            updatedBy
          })
          .returning();
        
        results.push(newSetting[0]);
      } else {
        results.push(updatedSetting[0]);
      }
    }

    res.json(results);
  } catch (error) {
    console.error("Error bulk updating settings:", error);
    res.status(500).json({ error: "Failed to bulk update settings" });
  }
});

// Get system configuration
router.get("/config/system", async (req, res) => {
  try {
    const config = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.category, "system"));

    const configObject = {};
    config.forEach(setting => {
      configObject[setting.key] = setting.jsonValue || setting.value;
    });

    res.json(configObject);
  } catch (error) {
    console.error("Error fetching system config:", error);
    res.status(500).json({ error: "Failed to fetch system config" });
  }
});

export default router;
