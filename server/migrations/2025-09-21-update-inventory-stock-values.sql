-- Update existing inventory items to set initial stock values
UPDATE inventory_items
SET quantity = 100,
    reserved_quantity = 10,
    available_quantity = quantity - reserved_quantity,
    total_stock = quantity
WHERE quantity = 0 OR reserved_quantity = 0 OR available_quantity = 0 OR total_stock = 0;
