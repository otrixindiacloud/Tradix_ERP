-- Migration to add 'Approved' status to goods_receipt_status enum
-- This migration adds the 'Approved' status to the existing goods_receipt_status enum

-- Add 'Approved' to the goods_receipt_status enum
ALTER TYPE goods_receipt_status ADD VALUE 'Approved';

-- Update any existing 'Complete' status receipts to 'Approved' if needed
-- (This is optional - you can uncomment if you want to migrate existing data)
-- UPDATE goods_receipt_headers SET status = 'Approved' WHERE status = 'Complete';
-- UPDATE goods_receipts SET status = 'Approved' WHERE status = 'Complete';
