-- Identification Script: Find Test Data in Database
-- This script identifies test data patterns without removing them
-- Run this first to see what test data exists before cleanup

-- 1. Identify test users
SELECT 'users' as table_name, 'test_users' as category, COUNT(*) as count
FROM users 
WHERE username IN ('test', 'admin', 'client', 'testadmin')
   OR email LIKE '%@example.com'
   OR email LIKE '%@demo.com'
   OR name LIKE '%Test%'
   OR name LIKE '%Admin%';

-- 2. Identify test customers
SELECT 'customers' as table_name, 'test_customers' as category, COUNT(*) as count
FROM customers 
WHERE name LIKE '%Test%'
   OR name LIKE '%PDF Test%'
   OR email LIKE '%@example.com'
   OR email LIKE '%@demo.com'
   OR phone LIKE '%000000000%'
   OR address LIKE '%Test%';

-- 3. Identify test suppliers
SELECT 'suppliers' as table_name, 'test_suppliers' as category, COUNT(*) as count
FROM suppliers 
WHERE name LIKE '%Test%'
   OR email LIKE '%@example.com'
   OR email LIKE '%@demo.com'
   OR address LIKE '%Test%'
   OR address LIKE '%Supplier Ave%';

-- 4. Identify test items
SELECT 'items' as table_name, 'test_items' as category, COUNT(*) as count
FROM items 
WHERE description LIKE '%Test%'
   OR description LIKE '%test item%'
   OR description LIKE '%Sample%'
   OR barcode LIKE '%123456789%'
   OR supplier_code LIKE '%AUTO%'
   OR name LIKE '%Test%';

-- 5. Identify test quotations
SELECT 'quotations' as table_name, 'test_quotations' as category, COUNT(*) as count
FROM quotations 
WHERE quote_number LIKE '%QT-PDF-%'
   OR quote_number LIKE '%QUO-001%'
   OR notes LIKE '%Test%'
   OR notes LIKE '%test quotation%';

-- 6. Identify test quotation items
SELECT 'quotation_items' as table_name, 'test_quotation_items' as category, COUNT(*) as count
FROM quotation_items 
WHERE description LIKE '%Sample Quoted Item%'
   OR description LIKE '%Test%';

-- 7. Identify test invoices
SELECT 'invoices' as table_name, 'test_invoices' as category, COUNT(*) as count
FROM invoices 
WHERE invoice_number LIKE '%INV-PDF-%'
   OR notes LIKE '%Test%';

-- 8. Identify test invoice items
SELECT 'invoice_items' as table_name, 'test_invoice_items' as category, COUNT(*) as count
FROM invoice_items 
WHERE description LIKE '%Sample Invoiced Item%'
   OR description LIKE '%Test%';

-- 9. Identify test enquiries
SELECT 'enquiries' as table_name, 'test_enquiries' as category, COUNT(*) as count
FROM enquiries 
WHERE enquiry_number LIKE '%ENQ-001%'
   OR notes LIKE '%Test%'
   OR notes LIKE '%test enquiry%';

-- 10. Identify test sales orders
SELECT 'sales_orders' as table_name, 'test_sales_orders' as category, COUNT(*) as count
FROM sales_orders 
WHERE order_number LIKE '%SO-TEST-%'
   OR notes LIKE '%Test%';

-- 11. Identify test sales order items
SELECT 'sales_order_items' as table_name, 'test_sales_order_items' as category, COUNT(*) as count
FROM sales_order_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 12. Identify test deliveries
SELECT 'deliveries' as table_name, 'test_deliveries' as category, COUNT(*) as count
FROM deliveries 
WHERE delivery_number LIKE '%TEST-%'
   OR delivery_notes LIKE '%Test%';

-- 13. Identify test delivery items
SELECT 'delivery_items' as table_name, 'test_delivery_items' as category, COUNT(*) as count
FROM delivery_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Delivery Item%'
   OR barcode LIKE '%AUTO-%'
   OR supplier_code LIKE '%AUTO-SUP%';

-- 14. Identify test purchase orders
SELECT 'purchase_orders' as table_name, 'test_purchase_orders' as category, COUNT(*) as count
FROM purchase_orders 
WHERE po_number LIKE '%PO-2024-001%'
   OR customer_reference LIKE '%CUST-REF-001%'
   OR document_name LIKE '%po-document-2024-001%'
   OR special_instructions LIKE '%Test%';

-- 15. Identify test goods receipts
SELECT 'goods_receipt_headers' as table_name, 'test_goods_receipts' as category, COUNT(*) as count
FROM goods_receipt_headers 
WHERE receipt_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 16. Identify test goods receipt items
SELECT 'goods_receipt_items' as table_name, 'test_goods_receipt_items' as category, COUNT(*) as count
FROM goods_receipt_items 
WHERE item_description LIKE '%Test%'
   OR item_description LIKE '%Sample%';

-- 17. Identify test supplier LPOs
SELECT 'supplier_lpos' as table_name, 'test_supplier_lpos' as category, COUNT(*) as count
FROM supplier_lpos 
WHERE lpo_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 18. Identify test supplier LPO items
SELECT 'supplier_lpo_items' as table_name, 'test_supplier_lpo_items' as category, COUNT(*) as count
FROM supplier_lpo_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 19. Identify test shipments
SELECT 'shipments' as table_name, 'test_shipments' as category, COUNT(*) as count
FROM shipments 
WHERE tracking_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 20. Identify test physical stock records
SELECT 'physical_stock' as table_name, 'test_physical_stock' as category, COUNT(*) as count
FROM physical_stock 
WHERE notes LIKE '%Test%'
   OR location LIKE '%Test%';

-- 21. Identify test physical stock counts
SELECT 'physical_stock_counts' as table_name, 'test_physical_stock_counts' as category, COUNT(*) as count
FROM physical_stock_counts 
WHERE notes LIKE '%Test%'
   OR location LIKE '%Test%';

-- 22. Identify test physical stock count items
SELECT 'physical_stock_count_items' as table_name, 'test_physical_stock_count_items' as category, COUNT(*) as count
FROM physical_stock_count_items 
WHERE notes LIKE '%Test%';

-- 23. Identify test requisitions
SELECT 'requisitions' as table_name, 'test_requisitions' as category, COUNT(*) as count
FROM requisitions 
WHERE requisition_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 24. Identify test requisition items
SELECT 'requisition_items' as table_name, 'test_requisition_items' as category, COUNT(*) as count
FROM requisition_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 25. Identify test inventory items
SELECT 'inventory_items' as table_name, 'test_inventory_items' as category, COUNT(*) as count
FROM inventory_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%test item%'
   OR barcode LIKE '%123456789%';

-- 26. Identify test stock movements
SELECT 'stock_movements' as table_name, 'test_stock_movements' as category, COUNT(*) as count
FROM stock_movements 
WHERE reference LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 27. Identify test audit logs
SELECT 'audit_logs' as table_name, 'test_audit_logs' as category, COUNT(*) as count
FROM audit_logs 
WHERE action LIKE '%Test%'
   OR details LIKE '%Test%'
   OR details LIKE '%test%';

-- 28. Identify test pricing data
SELECT 'margin_analysis' as table_name, 'test_margin_analysis' as category, COUNT(*) as count
FROM margin_analysis 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 29. Identify test competitor pricing
SELECT 'competitor_pricing' as table_name, 'test_competitor_pricing' as category, COUNT(*) as count
FROM competitor_pricing 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 30. Identify test contract pricing
SELECT 'contract_pricing' as table_name, 'test_contract_pricing' as category, COUNT(*) as count
FROM contract_pricing 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 31. Identify test volume pricing tiers
SELECT 'volume_pricing_tiers' as table_name, 'test_volume_pricing_tiers' as category, COUNT(*) as count
FROM volume_pricing_tiers 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 32. Identify test currency exchange rates
SELECT 'currency_exchange_rates' as table_name, 'test_currency_exchange_rates' as category, COUNT(*) as count
FROM currency_exchange_rates 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 33. Identify test pricing calculations
SELECT 'pricing_calculations' as table_name, 'test_pricing_calculations' as category, COUNT(*) as count
FROM pricing_calculations 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 34. Identify test dynamic pricing config
SELECT 'dynamic_pricing_config' as table_name, 'test_dynamic_pricing_config' as category, COUNT(*) as count
FROM dynamic_pricing_config 
WHERE notes LIKE '%Test%'
   OR notes LIKE '%Mock%';

-- 35. Identify test customer acceptances
SELECT 'customer_acceptances' as table_name, 'test_customer_acceptances' as category, COUNT(*) as count
FROM customer_acceptances 
WHERE notes LIKE '%Test%';

-- 36. Identify test quotation item acceptances
SELECT 'quotation_item_acceptances' as table_name, 'test_quotation_item_acceptances' as category, COUNT(*) as count
FROM quotation_item_acceptances 
WHERE notes LIKE '%Test%';

-- 37. Identify test acceptance confirmations
SELECT 'acceptance_confirmations' as table_name, 'test_acceptance_confirmations' as category, COUNT(*) as count
FROM acceptance_confirmations 
WHERE notes LIKE '%Test%';

-- 38. Identify test delivery picking sessions
SELECT 'delivery_picking_sessions' as table_name, 'test_delivery_picking_sessions' as category, COUNT(*) as count
FROM delivery_picking_sessions 
WHERE notes LIKE '%Test%';

-- 39. Identify test delivery picked items
SELECT 'delivery_picked_items' as table_name, 'test_delivery_picked_items' as category, COUNT(*) as count
FROM delivery_picked_items 
WHERE notes LIKE '%Test%';

-- 40. Identify test shipment tracking events
SELECT 'shipment_tracking_events' as table_name, 'test_shipment_tracking_events' as category, COUNT(*) as count
FROM shipment_tracking_events 
WHERE event_description LIKE '%Test%'
   OR location LIKE '%Test%';

-- 41. Identify test physical stock scanning sessions
SELECT 'physical_stock_scanning_sessions' as table_name, 'test_physical_stock_scanning_sessions' as category, COUNT(*) as count
FROM physical_stock_scanning_sessions 
WHERE notes LIKE '%Test%';

-- 42. Identify test physical stock scanned items
SELECT 'physical_stock_scanned_items' as table_name, 'test_physical_stock_scanned_items' as category, COUNT(*) as count
FROM physical_stock_scanned_items 
WHERE notes LIKE '%Test%';

-- 43. Identify test physical stock adjustments
SELECT 'physical_stock_adjustments' as table_name, 'test_physical_stock_adjustments' as category, COUNT(*) as count
FROM physical_stock_adjustments 
WHERE notes LIKE '%Test%';

-- 44. Identify test physical stock adjustment items
SELECT 'physical_stock_adjustment_items' as table_name, 'test_physical_stock_adjustment_items' as category, COUNT(*) as count
FROM physical_stock_adjustment_items 
WHERE notes LIKE '%Test%';

-- 45. Identify test supplier quotes
SELECT 'supplier_quotes' as table_name, 'test_supplier_quotes' as category, COUNT(*) as count
FROM supplier_quotes 
WHERE notes LIKE '%Test%';

-- 46. Identify test supplier quote items
SELECT 'supplier_quote_items' as table_name, 'test_supplier_quote_items' as category, COUNT(*) as count
FROM supplier_quote_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 47. Identify test quotation approvals
SELECT 'quotation_approvals' as table_name, 'test_quotation_approvals' as category, COUNT(*) as count
FROM quotation_approvals 
WHERE notes LIKE '%Test%';

-- 48. Identify test po line items
SELECT 'po_line_items' as table_name, 'test_po_line_items' as category, COUNT(*) as count
FROM po_line_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';

-- 49. Identify test credit notes
SELECT 'credit_notes' as table_name, 'test_credit_notes' as category, COUNT(*) as count
FROM credit_notes 
WHERE credit_note_number LIKE '%TEST-%'
   OR notes LIKE '%Test%';

-- 50. Identify test credit note items
SELECT 'credit_note_items' as table_name, 'test_credit_note_items' as category, COUNT(*) as count
FROM credit_note_items 
WHERE description LIKE '%Test%'
   OR description LIKE '%Sample%';
