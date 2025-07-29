-- Fix the CHECK constraint for blood_request status column
-- This script drops the existing constraint and creates a new one with the correct enum values

USE blood_donation_system;

-- Drop the existing constraint (you may need to find the exact constraint name)
-- You can find the constraint name by running: SELECT * FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS WHERE TABLE_NAME = 'blood_request'

-- Drop the constraint (replace 'CK__blood_req__statu__3B75D760' with the actual constraint name if different)
IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK__blood_req__statu__3B75D760')
BEGIN
    ALTER TABLE blood_request DROP CONSTRAINT CK__blood_req__statu__3B75D760;
END

-- Create new constraint with all valid enum values
ALTER TABLE blood_request 
ADD CONSTRAINT CK_blood_request_status 
CHECK (status IN ('PENDING', 'WAITING', 'PRIORITY', 'OUT_OF_STOCK', 'CONFIRM'));

PRINT 'Constraint updated successfully!'; 