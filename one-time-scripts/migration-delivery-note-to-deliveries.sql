-- Migration: Convert delivery_note table to deliveries table
-- This script handles the transition from the old delivery_note table to the new deliveries table structure

BEGIN;

-- 1. Create the deliveries table if it doesn't exist
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_number VARCHAR(50) UNIQUE NOT NULL,
    sales_order_id UUID,
    delivery_date TIMESTAMP,
    status delivery_status DEFAULT 'Pending',
    delivery_type VARCHAR(50) DEFAULT 'Full',
    delivery_address TEXT,
    delivery_notes TEXT,
    delivery_document VARCHAR(500),
    delivery_document_name VARCHAR(255),
    delivery_document_size INTEGER,
    picking_started_by UUID,
    picking_started_at TIMESTAMP,
    picking_completed_by UUID,
    picking_completed_at TIMESTAMP,
    picking_notes TEXT,
    delivery_confirmed_by VARCHAR(255),
    delivery_confirmed_at TIMESTAMP,
    delivery_signature TEXT,
    tracking_number VARCHAR(100),
    carrier_name VARCHAR(100),
    estimated_delivery_date TIMESTAMP,
    actual_delivery_date TIMESTAMP,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create the delivery_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS delivery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
    sales_order_item_id UUID,
    item_id UUID,
    barcode VARCHAR(100) NOT NULL,
    supplier_code VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ordered_quantity INTEGER NOT NULL,
    picked_quantity INTEGER NOT NULL DEFAULT 0,
    delivered_quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    picked_by UUID,
    picked_at TIMESTAMP,
    storage_location VARCHAR(100),
    picking_notes TEXT,
    quality_checked BOOLEAN DEFAULT FALSE,
    quality_checked_by UUID,
    quality_checked_at TIMESTAMP,
    quality_notes TEXT
);

-- 3. Migrate data from delivery_note to deliveries if delivery_note exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'delivery_note') THEN
        -- Insert data from delivery_note to deliveries
        INSERT INTO deliveries (
            id, delivery_number, sales_order_id, delivery_date, status, delivery_type,
            delivery_address, delivery_notes, delivery_document, delivery_document_name,
            delivery_document_size, picking_started_by, picking_started_at,
            picking_completed_by, picking_completed_at, picking_notes,
            delivery_confirmed_by, delivery_confirmed_at, delivery_signature,
            tracking_number, carrier_name, estimated_delivery_date, actual_delivery_date,
            created_by, created_at, updated_at
        )
        SELECT 
            id, delivery_number, sales_order_id, delivery_date, 
            CASE 
                WHEN status = 'Pending' THEN 'Pending'::delivery_status
                WHEN status = 'Partial' THEN 'Partial'::delivery_status
                WHEN status = 'Complete' THEN 'Complete'::delivery_status
                WHEN status = 'Cancelled' THEN 'Cancelled'::delivery_status
                ELSE 'Pending'::delivery_status
            END,
            delivery_type, delivery_address, delivery_notes, delivery_document,
            delivery_document_name, delivery_document_size, picking_started_by,
            picking_started_at, picking_completed_by, picking_completed_at,
            picking_notes, delivery_confirmed_by, delivery_confirmed_at,
            delivery_signature, tracking_number, carrier_name, estimated_delivery_date,
            actual_delivery_date, created_by, created_at, updated_at
        FROM delivery_note
        ON CONFLICT (id) DO NOTHING;
        
        -- Migrate delivery items if delivery_item table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'delivery_item') THEN
            INSERT INTO delivery_items (
                id, delivery_id, sales_order_item_id, item_id, barcode, supplier_code,
                description, ordered_quantity, picked_quantity, delivered_quantity,
                unit_price, total_price, picked_by, picked_at, storage_location,
                picking_notes, quality_checked, quality_checked_by, quality_checked_at, quality_notes
            )
            SELECT 
                id, delivery_id, sales_order_item_id, item_id,
                COALESCE(barcode, ''), COALESCE(supplier_code, ''), COALESCE(description, ''),
                ordered_quantity, picked_quantity, delivered_quantity,
                COALESCE(unit_price::DECIMAL, 0), COALESCE(total_price::DECIMAL, 0),
                picked_by, picked_at, storage_location, picking_notes,
                COALESCE(quality_checked, FALSE), quality_checked_by, quality_checked_at, quality_notes
            FROM delivery_item
            ON CONFLICT (id) DO NOTHING;
        END IF;
    END IF;
END $$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deliveries_sales_order_id ON deliveries(sales_order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_delivery_date ON deliveries(delivery_date);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at);
CREATE INDEX IF NOT EXISTS idx_delivery_items_delivery_id ON delivery_items(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_items_item_id ON delivery_items(item_id);

-- 5. Drop old tables after successful migration (commented out for safety)
-- Uncomment these lines only after verifying the migration was successful
-- DROP TABLE IF EXISTS delivery_item CASCADE;
-- DROP TABLE IF EXISTS delivery_note CASCADE;

COMMIT;

-- Verification queries
-- SELECT 'deliveries' as table_name, COUNT(*) as record_count FROM deliveries
-- UNION ALL
-- SELECT 'delivery_items' as table_name, COUNT(*) as record_count FROM delivery_items;
