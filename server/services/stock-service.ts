import { storage } from '../storage.js';
import { randomUUID } from 'crypto';

/**
 * StockService centralizes stock movement + inventory level synchronization.
 * Goals:
 *  - Single point for quantity before/after computation
 *  - Automatic inventory level upsert
 *  - Audit-friendly movement records
 */
export interface RecordMovementInput {
  itemId: string;
  quantity: number;            // Positive for IN, negative for OUT
  referenceType?: string;      // e.g., GoodsReceipt, Adjustment, ScanFinalize
  referenceId?: string;
  location?: string;
  reason?: string;
  notes?: string;
  createdBy?: string;
  movementType?: 'IN' | 'OUT'; // Optional override; inferred from sign if omitted
}

export async function recordMovement(input: RecordMovementInput) {
  const {
    itemId,
    quantity,
    referenceType,
    referenceId,
    location = 'MAIN',
    reason,
    notes,
    createdBy = 'system'
  } = input;

  if (!quantity || quantity === 0) {
    throw new Error('Movement quantity must be non-zero');
  }

  const movementType = input.movementType || (quantity > 0 ? 'IN' : 'OUT');
  const qtyAbs = Math.abs(quantity);

  // Fetch current level if exists
  let level = await storage.getInventoryLevelByItem(itemId, location).catch(() => undefined);
  const beforeQty = level ? (level as any).quantityAvailable ?? 0 : 0;
  const afterQty = beforeQty + quantity;
  if (afterQty < 0) {
    throw new Error(`Resulting stock would be negative (item=${itemId}, before=${beforeQty}, change=${quantity})`);
  }

  // Upsert inventory level
  if (!level) {
    level = await storage.createInventoryLevel({
      inventoryItemId: itemId,
      storageLocation: location,
      quantityAvailable: afterQty,
      quantityReserved: 0,
      reorderLevel: 0,
      maxStockLevel: 0
    } as any);
  } else {
    level = await storage.updateInventoryLevel(level.id, { quantityAvailable: afterQty } as any);
  }

  // Create stock movement record
  const movement = await storage.createStockMovement({
    id: randomUUID(),
    itemId,
    movementType,
    quantityMoved: qtyAbs,
    quantityBefore: beforeQty,
    quantityAfter: afterQty,
    storageLocation: location,
    referenceType,
    referenceId,
    reason,
    notes,
    createdBy
  } as any);

  return { movement, level };
}

/** Convenience wrapper for receiving stock */
export function receiveStock(params: Omit<RecordMovementInput, 'movementType'>) {
  return recordMovement({ ...params, movementType: 'IN' });
}

/** Convenience wrapper for issuing stock */
export function issueStock(params: Omit<RecordMovementInput, 'movementType'>) {
  return recordMovement({ ...params, movementType: 'OUT' });
}
