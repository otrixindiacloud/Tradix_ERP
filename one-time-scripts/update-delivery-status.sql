-- Script to update delivery note status
-- Replace the values as needed for your specific requirements

-- 1. Update single delivery note status
UPDATE deliveries 
SET status = 'Complete', 
    updated_at = NOW(),
    actual_delivery_date = NOW(),
    delivery_confirmed_at = NOW(),
    delivery_confirmed_by = 'System Admin'
WHERE id = 'your-delivery-id-here';

-- 2. Update all pending deliveries to complete
UPDATE deliveries 
SET status = 'Complete', 
    updated_at = NOW(),
    actual_delivery_date = NOW()
WHERE status = 'Pending';

-- 3. Update deliveries by date range
UPDATE deliveries 
SET status = 'Complete', 
    updated_at = NOW(),
    actual_delivery_date = NOW()
WHERE delivery_date BETWEEN '2024-01-01' AND '2024-01-31'
  AND status = 'Pending';

-- 4. Update deliveries by sales order
UPDATE deliveries 
SET status = 'Partial', 
    updated_at = NOW()
WHERE sales_order_id = 'your-sales-order-id-here'
  AND status = 'Pending';

-- 5. Cancel specific deliveries
UPDATE deliveries 
SET status = 'Cancelled', 
    updated_at = NOW(),
    delivery_notes = CONCAT(COALESCE(delivery_notes, ''), ' - Cancelled by admin')
WHERE delivery_number IN ('DN-001', 'DN-002', 'DN-003');

-- 6. Update deliveries with specific delivery numbers
UPDATE deliveries 
SET status = 'Complete', 
    updated_at = NOW(),
    actual_delivery_date = NOW(),
    delivery_confirmed_at = NOW(),
    delivery_confirmed_by = 'Delivery Team'
WHERE delivery_number LIKE 'DN-2024-%'
  AND status = 'Pending';

-- 7. Update deliveries by carrier
UPDATE deliveries 
SET status = 'Complete', 
    updated_at = NOW(),
    actual_delivery_date = NOW()
WHERE carrier_name = 'FedEx'
  AND status = 'Pending';

-- 8. Update deliveries with tracking numbers
UPDATE deliveries 
SET status = 'Complete', 
    updated_at = NOW(),
    actual_delivery_date = NOW()
WHERE tracking_number IS NOT NULL
  AND status = 'Pending';

-- Verification queries
-- Check current status distribution
SELECT status, COUNT(*) as count 
FROM deliveries 
GROUP BY status 
ORDER BY status;

-- Check specific delivery status
SELECT id, delivery_number, status, delivery_date, actual_delivery_date, updated_at
FROM deliveries 
WHERE id = 'your-delivery-id-here';

-- Check recent status changes
SELECT id, delivery_number, status, updated_at, delivery_confirmed_by
FROM deliveries 
WHERE updated_at >= NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;
