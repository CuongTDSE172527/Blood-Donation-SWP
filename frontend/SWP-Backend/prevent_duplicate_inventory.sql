-- Add unique constraint to prevent duplicate blood inventory records
-- This ensures only one record per blood type

-- Add unique constraint on blood_type column
ALTER TABLE blood_inventory ADD CONSTRAINT uk_blood_inventory_blood_type UNIQUE (blood_type);

-- If the above fails due to existing duplicates, first run the fix_duplicate_inventory.sql script
-- Then run this constraint addition 