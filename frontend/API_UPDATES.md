# API Updates Documentation

## Overview
The frontend has been updated to match the new backend API structure. This document outlines the key changes and how to use the updated services.

## Key Changes

### 1. User Model Updates
The backend User entity now has the following structure:
```javascript
{
  id: Long,
  fullName: String,
  dob: LocalDate,
  phone: String,
  email: String,
  password: String,
  role: Role (ADMIN, DONOR, STAFF, MEDICALCENTER)
}
```

### 2. New Role System
- `ADMIN`: System administrator
- `DONOR`: Blood donor
- `STAFF`: Hospital staff
- `MEDICALCENTER`: Medical center representative

### 3. Blood Request Status
- `PENDING`: Default when created
- `WAITING`: Being processed by staff
- `PRIORITY`: High priority request
- `OUT_OF_STOCK`: No blood available

### 4. Blood Urgency Levels
- `LOW`: Low urgency
- `MEDIUM`: Medium urgency
- `HIGH`: High urgency
- `CRITICAL`: Critical urgency

### 5. Registration Status
- `PENDING`: Awaiting confirmation
- `CONFIRMED`: Confirmed by staff
- `CANCELLED`: Cancelled

## New Services

### 1. Staff Service (`staffService.js`)
Handles all staff-related operations:

```javascript
import { staffService } from '../services/staffService';

// Donation Locations
await staffService.createLocation(locationData);

// Donation Schedules
await staffService.createSchedule(scheduleData);
await staffService.updateSchedule(id, scheduleData);
await staffService.deleteSchedule(id);
await staffService.getAllSchedules();

// Donation Registrations
await staffService.getPendingRegistrations();
await staffService.confirmRegistration(id);
await staffService.cancelRegistration(id);

// Blood Inventory
await staffService.getBloodInventory();

// Users
await staffService.getAllDonors();
await staffService.getAllMedicalCenters();
await staffService.getDonorById(id);
await staffService.getMedicalCenterById(id);

// Blood Requests
await staffService.getAllBloodRequests();
await staffService.confirmBloodRequest(id);
await staffService.markPriority(id);
await staffService.markOutOfStock(id);
```

### 2. Medical Center Service (`medicalCenterService.js`)
Handles medical center operations:

```javascript
import { medicalCenterService } from '../services/medicalCenterService';

// Blood Recipients
await medicalCenterService.createRecipient(recipientData);
await medicalCenterService.getAllRecipients();

// Blood Requests
await medicalCenterService.createBloodRequest(requestData, medicalCenterId);
await medicalCenterService.getRequestsByMedicalCenter(medicalCenterId);
```

### 3. Admin Service (`adminService.js`)
Handles admin operations:

```javascript
import { adminService } from '../services/adminService';

// User Management
await adminService.getAdmins();
await adminService.getDonors();
await adminService.getStaffs();
await adminService.getMedicalCenters();
await adminService.getUserById(id);
await adminService.getMedicalCenterById(id);

// Schedule Management
await adminService.createSchedule(scheduleData);
await adminService.updateSchedule(id, scheduleData);
await adminService.deleteSchedule(id);
await adminService.getAllSchedules();
```

## Updated Services

### 1. Auth Service
Updated to match backend API:
- `register`: Uses `fullName` instead of `name`
- Removed `updateProfile` method (not in backend)

### 2. Donor Service
Updated to match backend API structure:
- `registerDonation`: Uses query parameter for userId
- `getDonationHistory`: Uses query parameter for userId

## Redux Store Updates

### 1. New Slices
- `bloodRequestSlice`: Handles blood request operations
- `donorSlice`: Handles donation registration operations

### 2. Updated Slices
- `authSlice`: Removed profile update actions

### 3. Available Actions

#### Blood Request Actions:
```javascript
import { 
  createBloodRequest,
  getRequestsByMedicalCenter,
  getAllBloodRequests,
  confirmBloodRequest,
  markPriority,
  markOutOfStock
} from '../store/slices/bloodRequestSlice';
```

#### Donor Actions:
```javascript
import { 
  registerDonation,
  getDonationHistory
} from '../store/slices/donorSlice';
```

## Constants and Enums

New constants file (`constants/enums.js`) provides:
- `ROLES`: User role constants
- `BLOOD_REQUEST_STATUS`: Request status constants
- `BLOOD_URGENCY_LEVEL`: Urgency level constants
- `REGISTRATION_STATUS`: Registration status constants
- `BLOOD_TYPES`: Blood type options
- `STATUS_LABELS`: Vietnamese labels for statuses
- `URGENCY_LABELS`: Vietnamese labels for urgency levels
- `ROLE_LABELS`: Vietnamese labels for roles

## Usage Examples

### Creating a Blood Request (Medical Center)
```javascript
import { useDispatch } from 'react-redux';
import { createBloodRequest } from '../store/slices/bloodRequestSlice';

const dispatch = useDispatch();

const handleCreateRequest = async (requestData) => {
  try {
    await dispatch(createBloodRequest({
      requestData: {
        recipientName: "John Doe",
        recipientBloodType: "A+",
        requestedAmount: 500,
        urgencyLevel: "HIGH"
      },
      medicalCenterId: user.id
    })).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Staff Confirming a Registration
```javascript
import { useDispatch } from 'react-redux';
import { confirmRegistration } from '../store/slices/staffSlice';

const dispatch = useDispatch();

const handleConfirmRegistration = async (registrationId) => {
  try {
    await dispatch(confirmRegistration(registrationId)).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Getting Donation History (Donor)
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { getDonationHistory } from '../store/slices/donorSlice';

const dispatch = useDispatch();
const { donationHistory, loading } = useSelector(state => state.donor);

useEffect(() => {
  if (user?.id) {
    dispatch(getDonationHistory(user.id));
  }
}, [dispatch, user]);
```

## Migration Notes

1. **User Registration**: Update forms to use `fullName` instead of `name`
2. **Role-based Routing**: Update route guards to use new role constants
3. **Status Display**: Use new status constants and labels
4. **API Calls**: Update existing API calls to use new service methods
5. **Error Handling**: Update error handling to match new API responses

## Backend API Base URL
The API is configured to run on `http://localhost:8080/api` by default. Update the base URL in `services/api.js` if needed. 