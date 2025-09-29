import { pgTable, uuid, varchar, jsonb, timestamp, sql } from "./common";
import { users } from "./users-customers";

// Audit Log
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  userId: uuid("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Types
export type AuditLog = typeof auditLog.$inferSelect;
