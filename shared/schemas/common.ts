import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  integer,
  jsonb,
  boolean,
  pgEnum,
  uuid,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "nanoid";

// Re-export Drizzle utilities for use in other modules
export { sql, relations } from "drizzle-orm";
export {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  integer,
  jsonb,
  boolean,
  pgEnum,
  uuid,
  date,
} from "drizzle-orm/pg-core";
export { createInsertSchema } from "drizzle-zod";
export { z };
export { nanoid };
