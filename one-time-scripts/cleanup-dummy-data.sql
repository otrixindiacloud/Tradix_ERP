-- Cleanup Script: Remove Dummy/Test Data from Database
-- This script identifies and removes test data, dummy data, and sample data
-- Run this script carefully and review the data before deletion

BEGIN;

-- 1. Remove test users (identified by test patterns)
DELETE FROM users 
WHERE username IN ('test', 'admin', 'client', 'testadmin')
   OR email LIKE '%@example.com'
   OR email LIKE '%@demo.com'
   OR name LIKE '%Test%'
   OR name LIKE '%Admin%';

-- 2. Remove test customers (identified by test patterns)
DELETE FROM customers 
WHERE name LIKE '%Test%'
   OR name LIKE '%PDF Test%'
   OR email LIKE '%@example.com'
   OR email LIKE '%@demo.com'
   OR phone LIKE '%000000000%'
   OR address LIKE '%Test%';

-- 3. Remove test suppliers (identified by test patterns)
DELETE FROM suppliers 
WHERE name LIKE '%Test%'
   OR email LIKE '%@example.com'
   OR email LIKE '%@demo.com'
   OR address LIKE '%Test%'
   OR address LIKE '%Supplier Ave%';

-- 4. Remove test items (identified by test patterns)
DELETE FROM items 
WHERE description LIKE '%Test%'
   OR description LIKE '%test item%'
   OR description LIKE '%Sample%'
   OR barcode LIKE '%123456789%'
   OR supplier_code LIKE '%AUTO%'
   OR name LIKE '%Test%';

-- 5. Remove test quotations (identified by test patterns)
DELETE FROM quotations 
WHERE quote_number LIKE '%QT-PDF-%'
   OR quote_number LIKE '%QUO-001%'
   OR notes LIKE '%Test%'
   OR notes LIKE '%test quotation%';

-- 6. Remove test quotation items (identified by test patterns)
DELETE FROM quotation_items 
WHERE description LIKE '%Sample Quoted Item%'
   OR description LIKE '%Test%';

-- 7. Remove test invoices (identified by test patterns)
DELETE FROM invoices 
WHERE invoice_number LIKE '%INV-PDF-%'
   OR notes LIKE '%Test%';

-- 8. Remove test invoice items (identified by test patterns)
DELETE FROM invoice_items 
WHERE description LIKE '%Sample Invoiced Item%'
   OR description LIKE '%Test%';

-- 9. Remove test enquiries (identified by test patterns)
DELETE FROM enquiries 
WHERE enquiry_number LIKE '%ENQ-001%'
   OR notes LIKE '%Test%'
   OR notes LIKE '%test enquiry%';

-- 10. Remove test sales orders (identified by test patterns)
DELETE FROM sales_orders 
WHERE order_number LIKE '%SO-TEST-%'
   OR notes LIKE '%Test%';

-- 11. Remove test sales order items (identified by test patterns)
DELETE FROM sales_order_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 12. Remove test deliveries (identified by test patterns)
DELETE FROM deliveries 
WHERE delivery_number LIKE '%TEST-%'
   OR delivery_notes LIKE '%Test%';

-- 13. Remove test delivery items (identified by test patterns)
DELETE FROM delivery_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Delivery Item%'
   OR barcode LIKE '%AUTO-%'
   OR supplier_code LIKE '%AUTO-SUP%';

-- 14. Remove test purchase orders (identified by test patterns)
DELETE FROM purchase_orders 
WHERE po_number LIKE '%PO-2024-001%'
   OR customer_reference LIKE '%CUST-REF-001%'
   OR document_name LIKE '%po-document-2024-001%'
   OR special_instructions LIKE '%Test%';

-- 15. Remove test goods receipts (identified by test patterns)
DELETE FROM goods_receipt_headers 
WHERE receipt_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 16. Remove test goods receipt items (identified by test patterns)
DELETE FROM goods_receipt_items 
WHERE item_description LIKE '%Test%'
   OR item_description LIKE '%Sample%';

-- 17. Remove test supplier LPOs (identified by test patterns)
DELETE FROM supplier_lpos 
WHERE lpo_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 18. Remove test supplier LPO items (identified by test patterns)
DELETE FROM supplier_lpo_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 19. Remove test shipments (identified by test patterns)
DELETE FROM shipments 
WHERE tracking_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 20. Remove test physical stock records (identified by test patterns)
DELETE FROM physical_stock 
WHERE notes LIKE '%Test%'
   OR location LIKE '%Test%';

-- 21. Remove test physical stock counts (identified by test patterns)
DELETE FROM physical_stock_counts 
WHERE notes LIKE '%Test%'
   OR location LIKE '%Test%';

-- 22. Remove test physical stock count items (identified by test patterns)
DELETE FROM physical_stock_count_items 
WHERE notes LIKE '%Test%';

-- 23. Remove test requisitions (identified by test patterns)
DELETE FROM requisitions 
WHERE requisition_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 24. Remove test requisition items (identified by test patterns)
DELETE FROM requisition_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 25. Remove test inventory items (identified by test patterns)
DELETE FROM inventory_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%test item%'
   OR barcode LIKE '%123456789%';

-- 26. Remove test stock movements (identified by test patterns)
DELETE FROM stock_movements 
WHERE reference LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 27. Remove test audit logs (identified by test patterns)
DELETE FROM audit_logs 
WHERE action LIKE '%Test%'
   OR details LIKE '%Test%'
   OR details LIKE '%test%';

-- 28. Remove test pricing data (identified by test patterns)
DELETE FROM margin_analysis 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 29. Remove test competitor pricing (identified by test patterns)
DELETE FROM competitor_pricing 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 30. Remove test contract pricing (identified by test patterns)
DELETE FROM contract_pricing 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 31. Remove test volume pricing tiers (identified by test patterns)
DELETE FROM volume_pricing_tiers 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 32. Remove test currency exchange rates (identified by test patterns)
DELETE FROM currency_exchange_rates 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 33. Remove test pricing calculations (identified by test patterns)
DELETE FROM pricing_calculations 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 34. Remove test dynamic pricing config (identified by test patterns)
DELETE FROM dynamic_pricing_config 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 35. Remove test customer acceptances (identified by test patterns)
DELETE FROM customer_acceptances 
WHERE notes LIKE '%Test%';

-- 36. Remove test quotation item acceptances (identified by test patterns)
DELETE FROM quotation_item_acceptances 
WHERE notes LIKE '%Test%';

-- 37. Remove test acceptance confirmations (identified by test patterns)
DELETE FROM acceptance_confirmations 
WHERE notes LIKE '%Test%';

-- 38. Remove test delivery picking sessions (identified by test patterns)
DELETE FROM delivery_picking_sessions 
WHERE notes LIKE '%Test%';

-- 39. Remove test delivery picked items (identified by test patterns)
DELETE FROM delivery_picked_items 
WHERE notes LIKE '%Test%';

-- 40. Remove test shipment tracking events (identified by test patterns)
DELETE FROM shipment_tracking_events 
WHERE event_description LIKE '%Test%'
   OR location LIKE '%Test%';

-- 41. Remove test physical stock scanning sessions (identified by test patterns)
DELETE FROM physical_stock_scanning_sessions 
WHERE notes LIKE '%Test%';

-- 42. Remove test physical stock scanned items (identified by test patterns)
DELETE FROM physical_stock_scanned_items 
WHERE notes LIKE '%Test%';

-- 43. Remove test physical stock adjustments (identified by test patterns)
DELETE FROM physical_stock_adjustments 
WHERE notes LIKE '%Test%';

-- 44. Remove test physical stock adjustment items (identified by test patterns)
DELETE FROM physical_stock_adjustment_items 
WHERE notes LIKE '%Test%';

-- 45. Remove test supplier quotes (identified by test patterns)
DELETE FROM supplier_quotes 
WHERE notes LIKE '%Test%';

-- 46. Remove test supplier quote items (identified by test patterns)
DELETE FROM supplier_quote_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 47. Remove test quotation approvals (identified by test patterns)
DELETE FROM quotation_approvals 
WHERE notes LIKE '%Test%';

-- 48. Remove test po line items (identified by test patterns)
DELETE FROM po_line_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 49. Remove test credit notes (identified by test patterns)
DELETE FROM credit_notes 
WHERE credit_note_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 50. Remove test credit note items (identified by test patterns)
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
