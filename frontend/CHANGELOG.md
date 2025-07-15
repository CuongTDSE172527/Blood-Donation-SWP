# Changelog - Backend API Integration

## Summary
Updated the frontend project to match the new backend API structure. This includes new services, updated data models, and revised Redux store configuration.

## Changes Made

### New Files Created

#### Services
- `src/services/staffService.js` - Staff-related API operations
- `src/services/medicalCenterService.js` - Medical center API operations  
- `src/services/adminService.js` - Admin API operations

#### Constants
- `src/constants/enums.js` - New enum constants matching backend
- `frontend/API_UPDATES.md` - Comprehensive API documentation
- `frontend/CHANGELOG.md` - This changelog file

### Files Updated

#### Services
- `src/services/authService.js`
  - Updated `register` method to use `fullName` instead of `name`
  - Removed `updateProfile` method (not in backend API)

- `src/services/donorService.js`
  - Updated to match backend API structure
  - Methods now use query parameters for userId

#### Constants
- `src/constants/index.js`
  - Added export for new enums
  - Maintained backward compatibility with legacy constants

#### Redux Store
- `src/store/slices/authSlice.js`
  - Removed profile update actions
  - Updated action exports

- `src/store/slices/bloodRequestSlice.js`
  - Complete rewrite to match backend API
  - Added async thunks for all blood request operations
  - Updated state structure

- `src/store/slices/donorSlice.js`
  - Complete rewrite for donation registrations
  - Added async thunks for donor operations
  - Updated state structure

- `src/store/thunks/authThunks.js`
  - Removed `updateUserProfile` thunk
  - Updated imports

## Key API Changes

### User Model
- Field `name` → `fullName`
- Added `dob` (date of birth)
- Added `role` enum (ADMIN, DONOR, STAFF, MEDICALCENTER)

### Blood Request
- New status values: PENDING, WAITING, PRIORITY, OUT_OF_STOCK
- Added urgency levels: LOW, MEDIUM, HIGH, CRITICAL
- New API endpoints for staff operations

### Donation Registration
- New status values: PENDING, CONFIRMED, CANCELLED
- Updated API structure with query parameters

### New Role System
- ADMIN: System administrator
- DONOR: Blood donor  
- STAFF: Hospital staff
- MEDICALCENTER: Medical center representative

## Breaking Changes

1. **User Registration**: Forms must use `fullName` instead of `name`
2. **Profile Updates**: Profile update functionality removed (not in backend)
3. **API Endpoints**: Many endpoints have changed structure
4. **Role Constants**: Updated role values and added new roles
5. **Status Values**: Updated status enums across the application

## Migration Required

### Components
- Update user registration forms to use `fullName`
- Update role-based routing to use new role constants
- Update status displays to use new status constants
- Update API calls to use new service methods

### Forms
- Blood request forms need urgency level field
- Donation registration forms need updated field structure
- User forms need date of birth field

### Routing
- Update route guards for new role system
- Add routes for medical center functionality
- Update admin routes for new user management

## Testing Required

1. **Authentication**: Test login/register with new user model
2. **Role-based Access**: Test routing with new role system
3. **Blood Requests**: Test creation and management flows
4. **Donation Registrations**: Test registration and confirmation flows
5. **Staff Operations**: Test all staff-related functionality
6. **Medical Center Operations**: Test medical center functionality
7. **Admin Operations**: Test admin user management

## Next Steps

1. Update React components to use new services
2. Update forms to match new data models
3. Update routing for new role system
4. Test all functionality with backend
5. Update UI to display new status values
6. Add error handling for new API responses

## Backend Requirements

- Backend must be running on `http://localhost:8080`
- Database must be configured (SQL Server)
- All required entities must be created
- API endpoints must be accessible

## Notes

- All new services follow consistent error handling patterns
- Redux store uses modern async thunks for API operations
- Constants provide both English and Vietnamese labels
- Backward compatibility maintained where possible
- Comprehensive documentation provided in API_UPDATES.md 