-- Migration: Add quantity, reservedQuantity, availableQuantity, totalStock to inventory_items
ALTER TABLE inventory_items
  ADD COLUMN quantity INTEGER DEFAULT 0,
  ADD COLUMN reserved_quantity INTEGER DEFAULT 0,
  ADD COLUMN available_quantity INTEGER DEFAULT 0,
  ADD COLUMN total_stock INTEGER DEFAULT 0;
