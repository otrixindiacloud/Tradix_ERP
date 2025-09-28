import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const suppliers = pgTable("suppliers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
});

export const insertSupplierSchema = createInsertSchema(suppliers);
export const selectSupplierSchema = createSelectSchema(suppliers);
export const updateSupplierSchema = insertSupplierSchema.partial();

export type Supplier = z.infer<typeof selectSupplierSchema>;
export type NewSupplier = z.infer<typeof insertSupplierSchema>;
