-- Comprehensive Database Constraint Check and Fix Script
-- Run this script in SQL Server Management Studio to fix all constraint issues

USE blood_donation_system;

-- 1. Check current constraints on blood_request table
PRINT '=== Checking current constraints on blood_request table ===';
SELECT 
    cc.CONSTRAINT_NAME,
    cc.CHECK_CLAUSE,
    tc.CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'blood_request';

-- 2. Check current data in blood_request table
PRINT '=== Checking current blood_request data ===';
SELECT id, status, recipientName, recipientBloodType, requestedAmount, requestDate
FROM blood_request;

-- 3. Drop all existing check constraints on blood_request status column
PRINT '=== Dropping existing constraints on status column ===';
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
ELSE
BEGIN
    PRINT 'No existing constraints found on status column';
END

-- 4. Create new constraint with correct enum values
PRINT '=== Creating new constraint with correct enum values ===';
ALTER TABLE blood_request 
ADD CONSTRAINT CK_blood_request_status 
CHECK (status IN ('PENDING', 'WAITING', 'PRIORITY', 'OUT_OF_STOCK', 'CONFIRM'));

PRINT 'Created new constraint with all valid enum values';

-- 5. Verify the constraint was created
PRINT '=== Verifying new constraint ===';
SELECT 
    cc.CONSTRAINT_NAME,
    cc.CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'blood_request' AND tc.CONSTRAINT_TYPE = 'CHECK';

-- 6. Test the constraint with valid values
PRINT '=== Testing constraint with valid values ===';
BEGIN TRY
    -- This should work
    UPDATE blood_request SET status = 'CONFIRM' WHERE id = (SELECT TOP 1 id FROM blood_request);
    PRINT 'Constraint test PASSED - CONFIRM status accepted';
END TRY
BEGIN CATCH
    PRINT 'Constraint test FAILED: ' + ERROR_MESSAGE();
END CATCH

-- 7. Check if there are any invalid status values in the data
PRINT '=== Checking for invalid status values ===';
SELECT DISTINCT status, COUNT(*) as count
FROM blood_request
GROUP BY status;

PRINT '=== Script completed ==='; 