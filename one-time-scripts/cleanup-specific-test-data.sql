-- Targeted Cleanup Script: Remove Specific Test Data Patterns
-- This script removes the specific test data patterns found in the codebase
-- Run this script carefully and review the data before deletion

BEGIN;

-- 1. Remove PDF Test Customer and related data
DELETE FROM customers 
WHERE name = 'PDF Test Customer'
   OR email = 'pdf-test@example.com'
   OR phone = '+000000000';

-- 2. Remove test users with specific patterns
DELETE FROM users 
WHERE username IN ('client', 'testadmin')
   OR email IN ('client@demo.com', 'testadmin@example.com')
   OR name IN ('Test User', 'Admin User', 'Client User');

-- 3. Remove test customers with specific patterns
DELETE FROM customers 
WHERE name IN ('Test Customer', 'PDF Test Customer')
   OR email IN ('customer@example.com', 'pdf-test@example.com')
   OR address LIKE '%Test St%'
   OR phone = '123-456-7890';

-- 4. Remove test suppliers with specific patterns
DELETE FROM suppliers 
WHERE name = 'Test Supplier'
   OR email = 'supplier@example.com'
   OR address = '456 Supplier Ave'
   OR contact_person = 'John Doe';

-- 5. Remove test items with specific patterns
DELETE FROM items 
WHERE name = 'Test Item'
   OR description = 'A test item for development'
   OR barcode = '123456789'
   OR supplier_code LIKE '%AUTO%';

-- 6. Remove test quotations with specific patterns
DELETE FROM quotations 
WHERE quote_number LIKE 'QT-PDF-%'
   OR quote_number = 'QUO-001'
   OR notes = 'Test quotation'
   OR notes = 'test quotation';

-- 7. Remove test quotation items with specific patterns
DELETE FROM quotation_items 
WHERE description = 'Sample Quoted Item'
   OR description LIKE '%Test%';

-- 8. Remove test invoices with specific patterns
DELETE FROM invoices 
WHERE invoice_number LIKE 'INV-PDF-%'
   OR notes LIKE '%Test%';

-- 9. Remove test invoice items with specific patterns
DELETE FROM invoice_items 
WHERE description = 'Sample Invoiced Item'
   OR description LIKE '%Test%';

-- 10. Remove test enquiries with specific patterns
DELETE FROM enquiries 
WHERE enquiry_number = 'ENQ-001'
   OR notes = 'Test enquiry'
   OR notes = 'test enquiry';

-- 11. Remove test sales orders with specific patterns
DELETE FROM sales_orders 
WHERE order_number LIKE '%SO-TEST-%'
   OR notes LIKE '%Test%';

-- 12. Remove test sales order items with specific patterns
DELETE FROM sales_order_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 13. Remove test deliveries with specific patterns
DELETE FROM deliveries 
WHERE delivery_number LIKE '%TEST-%'
   OR delivery_notes LIKE '%Test%';

-- 14. Remove test delivery items with specific patterns
DELETE FROM delivery_items 
WHERE description = 'Delivery Item'
   OR barcode LIKE 'AUTO-%'
   OR supplier_code = 'AUTO-SUP';

-- 15. Remove test purchase orders with specific patterns
DELETE FROM purchase_orders 
WHERE po_number = 'PO-2024-001'
   OR customer_reference = 'CUST-REF-001'
   OR document_name = 'po-document-2024-001.pdf'
   OR special_instructions LIKE '%Test%';

-- 16. Remove test goods receipts with specific patterns
DELETE FROM goods_receipt_headers 
WHERE receipt_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 17. Remove test goods receipt items with specific patterns
DELETE FROM goods_receipt_items 
WHERE item_description LIKE '%Test%'
   OR item_description LIKE '%Sample%';

-- 18. Remove test supplier LPOs with specific patterns
DELETE FROM supplier_lpos 
WHERE lpo_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 19. Remove test supplier LPO items with specific patterns
DELETE FROM supplier_lpo_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 20. Remove test shipments with specific patterns
DELETE FROM shipments 
WHERE tracking_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 21. Remove test physical stock records with specific patterns
DELETE FROM physical_stock 
WHERE notes LIKE '%Test%'
   OR location LIKE '%Test%';

-- 22. Remove test physical stock counts with specific patterns
DELETE FROM physical_stock_counts 
WHERE notes LIKE '%Test%'
   OR location LIKE '%Test%';

-- 23. Remove test physical stock count items with specific patterns
DELETE FROM physical_stock_count_items 
WHERE notes LIKE '%Test%';

-- 24. Remove test requisitions with specific patterns
DELETE FROM requisitions 
WHERE requisition_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 25. Remove test requisition items with specific patterns
DELETE FROM requisition_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 26. Remove test inventory items with specific patterns
DELETE FROM inventory_items 
WHERE description LIKE '%Test%'
   OR description = 'A test item for development'
   OR barcode = '123456789';

-- 27. Remove test stock movements with specific patterns
DELETE FROM stock_movements 
WHERE reference LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 28. Remove test audit logs with specific patterns
DELETE FROM audit_logs 
WHERE action LIKE '%Test%'
   OR details LIKE '%Test%'
   OR details LIKE '%test%';

-- 29. Remove test pricing data with specific patterns
DELETE FROM margin_analysis 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 30. Remove test competitor pricing with specific patterns
DELETE FROM competitor_pricing 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 31. Remove test contract pricing with specific patterns
DELETE FROM contract_pricing 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 32. Remove test volume pricing tiers with specific patterns
DELETE FROM volume_pricing_tiers 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 33. Remove test currency exchange rates with specific patterns
DELETE FROM currency_exchange_rates 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 34. Remove test pricing calculations with specific patterns
DELETE FROM pricing_calculations 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 35. Remove test dynamic pricing config with specific patterns
DELETE FROM dynamic_pricing_config 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 36. Remove test customer acceptances with specific patterns
DELETE FROM customer_acceptances 
WHERE notes LIKE '%Test%';

-- 37. Remove test quotation item acceptances with specific patterns
DELETE FROM quotation_item_acceptances 
WHERE notes LIKE '%Test%';

-- 38. Remove test acceptance confirmations with specific patterns
DELETE FROM acceptance_confirmations 
WHERE notes LIKE '%Test%';

-- 39. Remove test delivery picking sessions with specific patterns
DELETE FROM delivery_picking_sessions 
WHERE notes LIKE '%Test%';

-- 40. Remove test delivery picked items with specific patterns
DELETE FROM delivery_picked_items 
WHERE notes LIKE '%Test%';

-- 41. Remove test shipment tracking events with specific patterns
DELETE FROM shipment_tracking_events 
WHERE event_description LIKE '%Test%'
   OR location LIKE '%Test%';

-- 42. Remove test physical stock scanning sessions with specific patterns
DELETE FROM physical_stock_scanning_sessions 
WHERE notes LIKE '%Test%';

-- 43. Remove test physical stock scanned items with specific patterns
DELETE FROM physical_stock_scanned_items 
WHERE notes LIKE '%Test%';

-- 44. Remove test physical stock adjustments with specific patterns
DELETE FROM physical_stock_adjustments 
WHERE notes LIKE '%Test%';

-- 45. Remove test physical stock adjustment items with specific patterns
DELETE FROM physical_stock_adjustment_items 
WHERE notes LIKE '%Test%';

-- 46. Remove test supplier quotes with specific patterns
DELETE FROM supplier_quotes 
WHERE notes LIKE '%Test%';

-- 47. Remove test supplier quote items with specific patterns
DELETE FROM supplier_quote_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 48. Remove test quotation approvals with specific patterns
DELETE FROM quotation_approvals 
WHERE notes LIKE '%Test%';

-- 49. Remove test po line items with specific patterns
DELETE FROM po_line_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 50. Remove test credit notes with specific patterns
DELETE FROM credit_notes 
WHERE credit_note_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 51. Remove test credit note items with specific patterns
DELETE FROM credit_note_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

COMMIT;

-- Verification queries to check what was removed
-- Run these after the cleanup to verify the results

-- Check remaining counts
SELECT 'users' as table_name, COUNT(*) as remaining_count FROM users
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'items', COUNT(*) FROM items
UNION ALL
SELECT 'quotations', COUNT(*) FROM quotations
UNION ALL
SELECT 'quotation_items', COUNT(*) FROM quotation_items
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'invoice_items', COUNT(*) FROM invoice_items
UNION ALL
SELECT 'enquiries', COUNT(*) FROM enquiries
UNION ALL
SELECT 'sales_orders', COUNT(*) FROM sales_orders
UNION ALL
SELECT 'sales_order_items', COUNT(*) FROM sales_order_items
UNION ALL
SELECT 'deliveries', COUNT(*) FROM deliveries
UNION ALL
SELECT 'delivery_items', COUNT(*) FROM delivery_items
UNION ALL
SELECT 'purchase_orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'goods_receipt_headers', COUNT(*) FROM goods_receipt_headers
UNION ALL
SELECT 'goods_receipt_items', COUNT(*) FROM goods_receipt_items
UNION ALL
SELECT 'supplier_lpos', COUNT(*) FROM supplier_lpos
UNION ALL
SELECT 'supplier_lpo_items', COUNT(*) FROM supplier_lpo_items
UNION ALL
SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL
SELECT 'physical_stock', COUNT(*) FROM physical_stock
UNION ALL
SELECT 'physical_stock_counts', COUNT(*) FROM physical_stock_counts
UNION ALL
SELECT 'physical_stock_count_items', COUNT(*) FROM physical_stock_count_items
UNION ALL
SELECT 'requisitions', COUNT(*) FROM requisitions
UNION ALL
SELECT 'requisition_items', COUNT(*) FROM requisition_items
UNION ALL
SELECT 'inventory_items', COUNT(*) FROM inventory_items
UNION ALL
SELECT 'stock_movements', COUNT(*) FROM stock_movements
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs
ORDER BY table_name;
