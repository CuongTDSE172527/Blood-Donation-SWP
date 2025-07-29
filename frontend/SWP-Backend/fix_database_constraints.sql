-- Database constraint fix for blood_request status column
-- Run this script in SQL Server Management Studio or your SQL client

USE blood_donation_system;

-- First, let's see what constraints exist on the blood_request table
SELECT 
    cc.CONSTRAINT_NAME,
    cc.CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'blood_request';

-- Drop all existing check constraints on the status column
DECLARE @sql NVARCHAR(MAX) = '';

SELECT @sql = @sql + 'ALTER TABLE blood_request DROP CONSTRAINT ' + QUOTENAME(CONSTRAINT_NAME) + ';' + CHAR(13)
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'blood_request' 
AND cc.CHECK_CLAUSE LIKE '%status%';

IF LEN(@sql) > 0
BEGIN
    EXEC sp_executesql @sql;
    PRINT 'Dropped existing constraints on status column';
END

-- Create new constraint with all valid enum values
ALTER TABLE blood_request 
ADD CONSTRAINT CK_blood_request_status 
CHECK (status IN ('PENDING', 'WAITING', 'PRIORITY', 'OUT_OF_STOCK', 'CONFIRM'));

PRINT 'Created new constraint with all valid enum values';

-- Verify the constraint was created
SELECT 
    cc.CONSTRAINT_NAME,
    cc.CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'blood_request' AND tc.CONSTRAINT_TYPE = 'CHECK'; 