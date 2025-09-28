-- 0001_add_sales_order_amendment_sequence.sql
-- Adds amendment_sequence column, index for (parent_order_id, version), and backfills existing data.
-- Idempotent guards included.

BEGIN;

-- 1. Add column if not exists
ALTER TABLE sales_orders
  ADD COLUMN IF NOT EXISTS amendment_sequence integer;

-- 2. Backfill amendment_sequence based on order_number suffix pattern '-A{n}' where n is integer
--    Only set when NULL to allow re-runs.
UPDATE sales_orders so
SET amendment_sequence = CAST(regexp_replace(so.order_number, '.*-A(\\d+)$', '\\1') AS integer)
WHERE so.amendment_sequence IS NULL
  AND so.order_number ~ '-A\\d+$';

-- 3. Ensure root orders (no parent and no -A suffix) keep NULL (explicit for clarity)
-- (No action needed; we leave them NULL.)

-- 4. Create supporting index for parent/version lookups (unique sequence per parent may be enforced later if desired)
CREATE INDEX IF NOT EXISTS idx_sales_orders_parent_version ON sales_orders(parent_order_id, version);

-- 5. Optional: index on parent_order_id + amendment_sequence for lineage ordering
CREATE INDEX IF NOT EXISTS idx_sales_orders_parent_amend_seq ON sales_orders(parent_order_id, amendment_sequence);

COMMIT;
