-- Fix duplicate blood inventory records
-- This script identifies and merges duplicate blood inventory records

-- First, let's see what duplicates exist
SELECT blood_type, COUNT(*) as count, SUM(quantity) as total_quantity
FROM blood_inventory 
GROUP BY blood_type 
HAVING COUNT(*) > 1;

-- Create a temporary table to store the merged records
CREATE TEMPORARY TABLE temp_merged_inventory AS
SELECT 
    blood_type,
    SUM(quantity) as total_quantity,
    MIN(updated_by_id) as updated_by_id  -- Keep the first updated_by_id
FROM blood_inventory 
GROUP BY blood_type;

-- Delete all existing records
DELETE FROM blood_inventory;

-- Insert the merged records back
INSERT INTO blood_inventory (blood_type, quantity, updated_by_id)
SELECT blood_type, total_quantity, updated_by_id
FROM temp_merged_inventory;

-- Drop the temporary table
DROP TEMPORARY TABLE temp_merged_inventory;

-- Verify the fix
SELECT blood_type, COUNT(*) as count
FROM blood_inventory 
GROUP BY blood_type 
HAVING COUNT(*) > 1; 