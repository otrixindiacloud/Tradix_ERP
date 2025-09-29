import { drizzleDb } from "../db";
import { BaseStorage } from "./base-storage";
import { materialRequest } from "../../shared/schema";
import { eq } from "drizzle-orm";

export class MaterialRequestStorage extends BaseStorage {
  async getAll() {
  return await drizzleDb.select().from(materialRequest);
  }

  async getById(id: string) {
  const result = await drizzleDb.select().from(materialRequest).where(eq(materialRequest.id, id));
  return result[0];
  }

  async create(data: any) {
  const result = await drizzleDb.insert(materialRequest).values(data).returning();
    this.logAuditEvent("create", data);
    return result[0];
  }

  async update(id: string, data: any) {
  const result = await drizzleDb.update(materialRequest).set(data).where(eq(materialRequest.id, id)).returning();
    this.logAuditEvent("update", { id, ...data });
    return result[0];
  }

  async delete(id: string) {
  await drizzleDb.delete(materialRequest).where(eq(materialRequest.id, id));
    this.logAuditEvent("delete", { id });
    return { success: true };
  }
}

export const materialRequestStorage = new MaterialRequestStorage();
