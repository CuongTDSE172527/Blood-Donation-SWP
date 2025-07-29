# Database Constraint Fix

## Issue
The application is encountering a CHECK constraint error when trying to update blood request status to 'CONFIRM'. This happens because the database was created with an older version of the `BloodRequestStatus` enum that didn't include the 'CONFIRM' value.

## Error Message
```
Internal error: could not execute statement [The UPDATE statement conflicted with the CHECK constraint "CK__blood_req__statu__3B75D760". The conflict occurred in database "blood_donation_system", table "dbo.blood_request", column 'status'.]
```

## Solution

### Option 1: Run the SQL Script (Recommended)
1. Open SQL Server Management Studio or your preferred SQL client
2. Connect to your database server
3. Run the script `fix_database_constraints.sql` in this directory
4. This will automatically drop the old constraint and create a new one with all valid enum values

### Option 2: Manual Fix
If the script doesn't work, you can manually fix it:

1. Find the constraint name:
```sql
SELECT 
    cc.CONSTRAINT_NAME,
    cc.CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON cc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'blood_request';
```

2. Drop the constraint (replace CONSTRAINT_NAME with the actual name):
```sql
ALTER TABLE blood_request DROP CONSTRAINT [CONSTRAINT_NAME];
```

3. Create new constraint:
```sql
ALTER TABLE blood_request 
ADD CONSTRAINT CK_blood_request_status 
CHECK (status IN ('PENDING', 'WAITING', 'PRIORITY', 'OUT_OF_STOCK', 'CONFIRM'));
```

### Option 3: Recreate Database (Nuclear Option)
If you don't have important data in the database:
1. Stop the application
2. Drop the database: `DROP DATABASE blood_donation_system;`
3. Restart the application - it will create a new database with the correct schema

## Valid Enum Values
After the fix, the following status values are valid:
- `PENDING` - Default when created
- `WAITING` - Waiting for processing (Staff placed)
- `PRIORITY` - Priority processing
- `OUT_OF_STOCK` - Out of stock
- `CONFIRM` - Confirmed

## Verification
After applying the fix, you can verify it works by:
1. Restarting the application
2. Trying to update a blood request status to 'CONFIRM'
3. The operation should succeed without constraint errors 