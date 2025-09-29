-- Migration: Convert goods_receipt_headers & goods_receipt_items IDs from text(nanoid) to UUID
-- Strategy: Add new UUID columns, backfill, rewire FKs, rename, preserve legacy columns for audit (can be dropped later)
-- NOTE: Run this BEFORE deploying code that expects UUID ids.

-- Revised Migration (v2): adds CASCADE on PK drop and broader FK constraint drops for robustness.
-- Safe to re-run if prior attempt failed before COMMIT (transaction rollback would have preserved state).

BEGIN;

-- 1. Add new UUID columns
ALTER TABLE goods_receipt_headers ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
ALTER TABLE goods_receipt_items   ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
ALTER TABLE goods_receipt_items   ADD COLUMN new_receipt_header_id uuid;

-- 2. Backfill receipt header FK mapping
UPDATE goods_receipt_items gi
SET new_receipt_header_id = gh.new_id
FROM goods_receipt_headers gh
WHERE gi.receipt_header_id = gh.id;

-- 3. Enforce not null after backfill
ALTER TABLE goods_receipt_items ALTER COLUMN new_receipt_header_id SET NOT NULL;

-- 4. Drop existing constraints (names may differ if previously auto-generated; adjust if necessary)
-- Attempt to drop FK constraint if it exists (ignore errors)
DO $$ BEGIN
  ALTER TABLE goods_receipt_items DROP CONSTRAINT IF EXISTS goods_receipt_items_receipt_header_id_fkey;
EXCEPTION WHEN others THEN NULL; END $$;

-- Drop item FK variations (defensive: different naming conventions)
ALTER TABLE goods_receipt_items DROP CONSTRAINT IF EXISTS goods_receipt_items_receipt_header_id_fkey;
ALTER TABLE goods_receipt_items DROP CONSTRAINT IF EXISTS goods_receipt_items_receipt_header_id_goods_receipt_headers_id_fk;
ALTER TABLE goods_receipt_items DROP CONSTRAINT IF EXISTS goods_receipt_items_receipt_header_id_goods_receipt_headers_fk;

-- Drop item PK (if not already dropped)
ALTER TABLE goods_receipt_items DROP CONSTRAINT IF EXISTS goods_receipt_items_pkey;

-- Drop header PK with CASCADE to remove any lingering dependent constraints
ALTER TABLE goods_receipt_headers DROP CONSTRAINT IF EXISTS goods_receipt_headers_pkey CASCADE;

-- 5. Rename legacy columns
ALTER TABLE goods_receipt_headers RENAME COLUMN id TO old_id;
ALTER TABLE goods_receipt_headers RENAME COLUMN new_id TO id;

ALTER TABLE goods_receipt_items RENAME COLUMN id TO old_id;
ALTER TABLE goods_receipt_items RENAME COLUMN new_id TO id;
ALTER TABLE goods_receipt_items RENAME COLUMN receipt_header_id TO old_receipt_header_id;
ALTER TABLE goods_receipt_items RENAME COLUMN new_receipt_header_id TO receipt_header_id;

-- 6. Recreate primary keys & new FK
ALTER TABLE goods_receipt_headers ADD PRIMARY KEY (id);
ALTER TABLE goods_receipt_items   ADD PRIMARY KEY (id);
ALTER TABLE goods_receipt_items   ADD CONSTRAINT goods_receipt_items_receipt_header_id_fkey FOREIGN KEY (receipt_header_id) REFERENCES goods_receipt_headers(id) ON DELETE CASCADE;

-- 7. (Optional) Create index on legacy columns for traceability (comment out if not needed)
-- CREATE INDEX IF NOT EXISTS idx_goods_receipt_headers_old_id ON goods_receipt_headers(old_id);
-- CREATE INDEX IF NOT EXISTS idx_goods_receipt_items_old_id ON goods_receipt_items(old_id);

-- 8. (Optional) Drop legacy columns once confident no rollback required
-- ALTER TABLE goods_receipt_items   DROP COLUMN old_receipt_header_id;
-- ALTER TABLE goods_receipt_items   DROP COLUMN old_id;
-- ALTER TABLE goods_receipt_headers DROP COLUMN old_id;

COMMIT;

-- If you reach here without errors the migration succeeded.

-- ROLLBACK STRATEGY (manual):
-- If failure occurs before COMMIT, transaction abort restores prior state.
-- If after deployment issues arise and legacy columns retained, you can reverse by:
--   BEGIN; ALTER TABLE goods_receipt_headers DROP CONSTRAINT goods_receipt_headers_pkey; ... (reverse renames) ... COMMIT;

-- POST-MIGRATION VERIFICATION QUERIES:
-- SELECT count(*) FROM goods_receipt_headers WHERE id IS NULL;            -- expect 0
-- SELECT count(*) FROM goods_receipt_items   WHERE id IS NULL;            -- expect 0
-- SELECT count(*) FROM goods_receipt_items gi WHERE NOT EXISTS (SELECT 1 FROM goods_receipt_headers gh WHERE gh.id = gi.receipt_header_id); -- expect 0
-- SELECT old_id, id FROM goods_receipt_headers LIMIT 5;                  -- spot check mapping
-- SELECT old_id, id, old_receipt_header_id, receipt_header_id FROM goods_receipt_items LIMIT 5; -- spot check mapping
