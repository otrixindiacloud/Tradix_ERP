-- Migration: Convert goods_receipt_headers.id (text) -> uuid with default gen_random_uuid()
-- Also convert goods_receipt_items.receipt_header_id (text) -> uuid FK
-- Keeps legacy text ids in *_text_old columns for audit / rollback.
-- Idempotent-ish: guarded additions; renames only if original columns still present & new columns not yet promoted.

BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- 1. Add new UUID columns if not already present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='goods_receipt_headers' AND column_name='id_uuid') THEN
    ALTER TABLE goods_receipt_headers ADD COLUMN id_uuid uuid;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='goods_receipt_items' AND column_name='receipt_header_id_uuid') THEN
    ALTER TABLE goods_receipt_items ADD COLUMN receipt_header_id_uuid uuid;
  END IF;
END $$;

-- 2. Populate new UUIDs for headers where null
UPDATE goods_receipt_headers 
   SET id_uuid = gen_random_uuid()
 WHERE id_uuid IS NULL;

-- 3. Map items to new header UUIDs where not yet populated
UPDATE goods_receipt_items gi
   SET receipt_header_id_uuid = gh.id_uuid
  FROM goods_receipt_headers gh
 WHERE gi.receipt_header_id_uuid IS NULL
   AND gi.receipt_header_id = gh.id;

-- 4. Drop existing FK referencing old text id (if exists)
ALTER TABLE goods_receipt_items DROP CONSTRAINT IF EXISTS goods_receipt_items_receipt_header_id_goods_receipt_headers_id_;

-- 5. Drop old PK on goods_receipt_headers (if exists)
ALTER TABLE goods_receipt_headers DROP CONSTRAINT IF EXISTS goods_receipt_headers_pkey;

-- 6. Enforce NOT NULL on new columns
ALTER TABLE goods_receipt_headers ALTER COLUMN id_uuid SET NOT NULL;
ALTER TABLE goods_receipt_items ALTER COLUMN receipt_header_id_uuid SET NOT NULL;

-- 7. Add PK & new FK
ALTER TABLE goods_receipt_headers ADD CONSTRAINT goods_receipt_headers_pkey PRIMARY KEY (id_uuid);
ALTER TABLE goods_receipt_items ADD CONSTRAINT goods_receipt_items_receipt_header_id_fk FOREIGN KEY (receipt_header_id_uuid) REFERENCES goods_receipt_headers(id_uuid) ON DELETE CASCADE;

-- 8. Rename old columns to *_text_old if still original names and promote new columns
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goods_receipt_headers' AND column_name='id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goods_receipt_headers' AND column_name='id_uuid') THEN
    ALTER TABLE goods_receipt_headers RENAME COLUMN id TO id_text_old;
    ALTER TABLE goods_receipt_headers RENAME COLUMN id_uuid TO id;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goods_receipt_items' AND column_name='receipt_header_id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goods_receipt_items' AND column_name='receipt_header_id_uuid') THEN
    ALTER TABLE goods_receipt_items RENAME COLUMN receipt_header_id TO receipt_header_id_text_old;
    ALTER TABLE goods_receipt_items RENAME COLUMN receipt_header_id_uuid TO receipt_header_id;
  END IF;
END $$;

-- 9. Set default for new UUID PK
ALTER TABLE goods_receipt_headers ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 10. (Optional) Index legacy id_text_old for reference if kept
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goods_receipt_headers' AND column_name='id_text_old') THEN
    CREATE INDEX IF NOT EXISTS goods_receipt_headers_id_text_old_idx ON goods_receipt_headers(id_text_old);
  END IF;
END $$;

COMMIT;

-- Verification queries (run manually after):
-- SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name='goods_receipt_headers';
-- SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name='goods_receipt_items';
