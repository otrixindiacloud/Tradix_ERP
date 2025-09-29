-- Consolidated migration: finalize goods receipt UUID migration and drop legacy artifacts
-- Safety: run in transaction
BEGIN;

-- 1. Drop legacy columns if they still exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='goods_receipt_headers' AND column_name='id_text_old'
  ) THEN
    ALTER TABLE goods_receipt_headers DROP COLUMN id_text_old;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='goods_receipt_items' AND column_name='id_text_old'
  ) THEN
    ALTER TABLE goods_receipt_items DROP COLUMN id_text_old;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='goods_receipt_items' AND column_name='receipt_header_id_text_old'
  ) THEN
    ALTER TABLE goods_receipt_items DROP COLUMN receipt_header_id_text_old;
  END IF;
END$$;

-- 2. Drop legacy tables if present (they were only transitional)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='goods_receipt_items_legacy') THEN
    DROP TABLE goods_receipt_items_legacy CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='goods_receipts') THEN
    DROP TABLE goods_receipts CASCADE; -- older header table name
  END IF;
END$$;

-- 3. Ensure UUID defaults are present (id columns already migrated)
ALTER TABLE goods_receipt_headers ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE goods_receipt_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Re-validate required constraints (ensure not nulls still correct)
ALTER TABLE goods_receipt_headers ALTER COLUMN receipt_number SET NOT NULL;
ALTER TABLE goods_receipt_headers ALTER COLUMN supplier_id SET NOT NULL;
ALTER TABLE goods_receipt_headers ALTER COLUMN receipt_date SET NOT NULL;
ALTER TABLE goods_receipt_items ALTER COLUMN receipt_header_id SET NOT NULL;
ALTER TABLE goods_receipt_items ALTER COLUMN item_description SET NOT NULL;
ALTER TABLE goods_receipt_items ALTER COLUMN quantity_expected SET NOT NULL;

COMMIT;

-- Verification queries (optional)
-- SELECT column_name,data_type,is_nullable FROM information_schema.columns WHERE table_name='goods_receipt_headers';
-- SELECT column_name,data_type,is_nullable FROM information_schema.columns WHERE table_name='goods_receipt_items';
