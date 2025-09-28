-- Fix Delivery Number and Status Issues
-- This script addresses the problems with delivery numbers showing as "N/A" and status showing as "Unknown"

BEGIN;

-- 1. First, let's check what data we have
SELECT 
    'Current Data Check' as step,
    COUNT(*) as total_deliveries,
    COUNT(delivery_number) as deliveries_with_number,
    COUNT(CASE WHEN delivery_number IS NULL OR delivery_number = '' THEN 1 END) as deliveries_without_number,
    COUNT(CASE WHEN status IS NULL THEN 1 END) as deliveries_without_status
FROM deliveries;

-- 2. Update deliveries that have NULL or empty delivery_number
UPDATE deliveries 
SET delivery_number = 'DN-' || LPAD(EXTRACT(EPOCH FROM created_at)::text, 10, '0')
WHERE delivery_number IS NULL OR delivery_number = '';

-- 3. Update deliveries that have NULL status to 'Pending'
UPDATE deliveries 
SET status = 'Pending'
WHERE status IS NULL;

-- 4. Ensure delivery_number is unique by adding a suffix if needed
WITH duplicate_numbers AS (
    SELECT delivery_number, COUNT(*) as count
    FROM deliveries 
    WHERE delivery_number IS NOT NULL
    GROUP BY delivery_number
    HAVING COUNT(*) > 1
),
numbered_duplicates AS (
    SELECT 
        id,
        delivery_number,
        ROW_NUMBER() OVER (PARTITION BY delivery_number ORDER BY created_at) as rn
    FROM deliveries d
    WHERE d.delivery_number IN (SELECT delivery_number FROM duplicate_numbers)
)
UPDATE deliveries 
SET delivery_number = delivery_number || '-' || (rn - 1)
FROM numbered_duplicates nd
WHERE deliveries.id = nd.id AND nd.rn > 1;

-- 5. Add constraints to prevent future issues
ALTER TABLE deliveries 
ALTER COLUMN delivery_number SET NOT NULL;

-- 6. Create a sequence for generating delivery numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS delivery_number_seq START 1;

-- 7. Create a function to generate unique delivery numbers
CREATE OR REPLACE FUNCTION generate_delivery_number()
RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    delivery_num TEXT;
BEGIN
    SELECT nextval('delivery_number_seq') INTO next_num;
    delivery_num := 'DN-' || LPAD(next_num::text, 6, '0');
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM deliveries WHERE delivery_number = delivery_num) LOOP
        SELECT nextval('delivery_number_seq') INTO next_num;
        delivery_num := 'DN-' || LPAD(next_num::text, 6, '0');
    END LOOP;
    
    RETURN delivery_num;
END;
$$ LANGUAGE plpgsql;

-- 8. Update the default value for delivery_number to use the function
ALTER TABLE deliveries 
ALTER COLUMN delivery_number SET DEFAULT generate_delivery_number();

-- 9. Verify the fixes
SELECT 
    'After Fix' as step,
    COUNT(*) as total_deliveries,
    COUNT(delivery_number) as deliveries_with_number,
    COUNT(CASE WHEN delivery_number IS NULL OR delivery_number = '' THEN 1 END) as deliveries_without_number,
    COUNT(CASE WHEN status IS NULL THEN 1 END) as deliveries_without_status
FROM deliveries;

-- 10. Show sample data to verify
SELECT 
    id,
    delivery_number,
    status,
    delivery_type,
    created_at
FROM deliveries 
ORDER BY created_at DESC 
LIMIT 10;

COMMIT;

-- Additional verification queries
-- Check for any remaining issues
SELECT 
    'Verification' as check_type,
    COUNT(*) as count
FROM deliveries 
WHERE delivery_number IS NULL OR delivery_number = '' OR status IS NULL;

-- Check delivery number format
SELECT 
    'Delivery Number Format Check' as check_type,
    delivery_number,
    CASE 
        WHEN delivery_number ~ '^DN-[0-9]+$' THEN 'Valid Format'
        ELSE 'Invalid Format'
    END as format_status
FROM deliveries 
LIMIT 10;
