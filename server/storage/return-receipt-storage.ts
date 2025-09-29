import { db } from "../db.js";
import { supplierReturns, supplierReturnItems } from "@shared/schema";
import { eq } from "drizzle-orm";
import { BaseStorage } from "./base-storage";

export class ReturnReceiptStorage extends BaseStorage {
	async getAllReturns() {
		return await db.select().from(supplierReturns);
	}

	async getReturnById(id: string) {
		const [ret] = await db.select().from(supplierReturns).where(eq(supplierReturns.id, id));
		return ret || null;
	}

	async createReturn(data: any) {
		const [newReturn] = await db.insert(supplierReturns).values(data).returning();
		return newReturn;
	}

	async updateReturn(id: string, data: any) {
		const [updated] = await db.update(supplierReturns).set(data).where(eq(supplierReturns.id, id)).returning();
		return updated || null;
	}

	async deleteReturn(id: string) {
		await db.delete(supplierReturns).where(eq(supplierReturns.id, id));
	}

	async getReturnItems(returnId: string) {
		return await db.select().from(supplierReturnItems).where(eq(supplierReturnItems.supplierReturnId, returnId));
	}

	async createReturnItem(data: any) {
		const [newItem] = await db.insert(supplierReturnItems).values(data).returning();
		return newItem;
	}

	async updateReturnItem(id: string, data: any) {
		const [updated] = await db.update(supplierReturnItems).set(data).where(eq(supplierReturnItems.id, id)).returning();
		return updated || null;
	}

	async deleteReturnItem(id: string) {
		await db.delete(supplierReturnItems).where(eq(supplierReturnItems.id, id));
	}
}
