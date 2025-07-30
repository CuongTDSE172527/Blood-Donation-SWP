# Staff Donor Management Fix

## Tổng quan
Tài liệu này mô tả việc sửa lỗi trong Staff Donor Management, bao gồm lỗi `updateDonor is not a function` và việc hiển thị thông tin không đầy đủ.

## Vấn đề

### 1. Lỗi JavaScript
- **Lỗi**: `(intermediate value).updateDonor is not a function`
- **Nguyên nhân**: `staffService` thiếu các method `updateDonor`, `createDonor`, `deleteDonor`

### 2. Backend API thiếu
- **Vấn đề**: Backend không có API để tạo, cập nhật, xóa donors
- **Chỉ có**: API GET `/staff/users/donors` để lấy danh sách

### 3. Form không khớp với Backend
- **Vấn đề**: Form có các field không tồn tại trong User entity
- **Field dư**: `emergencyContact`, `medicalHistory`, `allergies`, `medications`
- **Field thiếu**: `gender`

## Giải pháp

### 1. Thêm API Backend (StaffController.java)

#### API tạo donor mới:
```java
@PostMapping("/users/donors")
public ResponseEntity<?> createDonor(@RequestBody User donor) {
    try {
        // Set role to DONOR
        donor.setRole(Role.DONOR);
        
        // Check if email already exists
        if (userRepository.findByEmail(donor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        User savedDonor = userRepository.save(donor);
        return ResponseEntity.ok(savedDonor);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error creating donor: " + e.getMessage());
    }
}
```

#### API cập nhật donor:
```java
@PutMapping("/users/donors/{id}")
public ResponseEntity<?> updateDonor(@PathVariable Long id, @RequestBody User updatedDonor) {
    try {
        Optional<User> existingDonorOpt = userRepository.findById(id);
        if (existingDonorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Donor not found");
        }

        User existingDonor = existingDonorOpt.get();
        
        // Update fields except role and email
        if (updatedDonor.getFullName() != null) {
            existingDonor.setFullName(updatedDonor.getFullName());
        }
        if (updatedDonor.getPhone() != null) {
            existingDonor.setPhone(updatedDonor.getPhone());
        }
        if (updatedDonor.getDob() != null) {
            existingDonor.setDob(updatedDonor.getDob());
        }
        if (updatedDonor.getGender() != null) {
            existingDonor.setGender(updatedDonor.getGender());
        }
        if (updatedDonor.getAddress() != null) {
            existingDonor.setAddress(updatedDonor.getAddress());
        }
        if (updatedDonor.getBloodType() != null) {
            existingDonor.setBloodType(updatedDonor.getBloodType());
        }
        if (updatedDonor.getPassword() != null && !updatedDonor.getPassword().trim().isEmpty()) {
            existingDonor.setPassword(updatedDonor.getPassword());
        }

        User savedDonor = userRepository.save(existingDonor);
        return ResponseEntity.ok(savedDonor);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error updating donor: " + e.getMessage());
    }
}
```

#### API xóa donor:
```java
@DeleteMapping("/users/donors/{id}")
public ResponseEntity<?> deleteDonor(@PathVariable Long id) {
    try {
        Optional<User> donorOpt = userRepository.findById(id);
        if (donorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Donor not found");
        }

        User donor = donorOpt.get();
        if (donor.getRole() != Role.DONOR) {
            return ResponseEntity.badRequest().body("User is not a donor");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("Donor deleted successfully");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error deleting donor: " + e.getMessage());
    }
}
```

### 2. Thêm Frontend Service Methods (staffService.js)

```javascript
createDonor: async (donorData) => {
  try {
    const response = await api.post('/staff/users/donors', donorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

updateDonor: async (id, donorData) => {
  try {
    const response = await api.put(`/staff/users/donors/${id}`, donorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

deleteDonor: async (id) => {
  try {
    const response = await api.delete(`/staff/users/donors/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
```

### 3. Cập nhật Form (Donors.jsx)

#### Thay đổi state form:
```javascript
const [form, setForm] = useState({
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  bloodType: '',
  address: '',
  gender: '', // Thêm gender
  password: '' // Chỉ cho donor mới
});
```

#### Loại bỏ các field không tồn tại:
- `emergencyContact`
- `medicalHistory`
- `allergies`
- `medications`

#### Thêm field gender:
```javascript
<FormControl fullWidth margin="dense">
  <InputLabel>{t('staff.gender') || 'Gender'}</InputLabel>
  <Select
    label={t('staff.gender') || 'Gender'}
    name="gender"
    value={form.gender}
    onChange={handleChange}
  >
    <MenuItem value="MALE">Male</MenuItem>
    <MenuItem value="FEMALE">Female</MenuItem>
    <MenuItem value="OTHER">Other</MenuItem>
  </Select>
</FormControl>
```

### 4. Cập nhật Table Display

#### Thêm cột Gender:
```javascript
<TableHead>
  <TableRow>
    <TableCell>{t('staff.fullName') || 'Full Name'}</TableCell>
    <TableCell>{t('staff.email') || 'Email'}</TableCell>
    <TableCell>{t('staff.phone') || 'Phone'}</TableCell>
    <TableCell>{t('staff.bloodType') || 'Blood Type'}</TableCell>
    <TableCell>{t('staff.gender') || 'Gender'}</TableCell> // Thêm cột này
    <TableCell>{t('staff.dob') || 'Date of Birth'}</TableCell>
    <TableCell align="right">{t('staff.actions') || 'Actions'}</TableCell>
  </TableRow>
</TableHead>
```

#### Cập nhật colSpan:
```javascript
<TableCell colSpan={7} align="center"> // Tăng từ 6 lên 7
```

### 5. Thêm Translation Keys

#### English (en.json):
```json
"gender": "Gender"
```

#### Vietnamese (vi.json):
```json
"gender": "Giới tính"
```

## Các API được thêm mới

### 1. Backend APIs
- `POST /api/staff/users/donors` - Tạo donor mới
- `PUT /api/staff/users/donors/{id}` - Cập nhật donor
- `DELETE /api/staff/users/donors/{id}` - Xóa donor

### 2. Frontend Service Methods
- `staffService.createDonor(donorData)`
- `staffService.updateDonor(id, donorData)`
- `staffService.deleteDonor(id)`

## User Entity Fields

Các field hiện có trong User entity:
- `id` (Long)
- `fullName` (String)
- `dob` (LocalDate)
- `phone` (String)
- `email` (String)
- `password` (String)
- `address` (String)
- `bloodType` (String)
- `role` (Role enum)
- `gender` (Gender enum)

## Testing

### 1. Test tạo donor mới
1. Vào Staff Dashboard → Donor Management
2. Click "Add Donor"
3. Điền đầy đủ thông tin (bao gồm gender)
4. Click "Add"
5. **Expected**: Donor được tạo thành công

### 2. Test cập nhật donor
1. Click icon Edit trên một donor
2. Thay đổi thông tin
3. Click "Save"
4. **Expected**: Thông tin được cập nhật

### 3. Test xóa donor
1. Click icon Delete trên một donor
2. **Expected**: Donor bị xóa khỏi danh sách

### 4. Test hiển thị thông tin
1. Kiểm tra bảng hiển thị đầy đủ các cột
2. Kiểm tra form chỉ có các field phù hợp
3. **Expected**: Không có field dư hoặc thiếu

## Lợi ích

### 1. Tính năng hoàn chỉnh
- Có thể tạo, cập nhật, xóa donors
- Hiển thị thông tin đầy đủ và chính xác

### 2. Tính nhất quán
- Form khớp với backend entity
- API đầy đủ và nhất quán

### 3. UX tốt hơn
- Không có lỗi JavaScript
- Form gọn gàng và dễ sử dụng
- Thông báo lỗi rõ ràng

## Kết luận

Sau khi thực hiện các thay đổi:
- Lỗi `updateDonor is not a function` đã được sửa
- Backend có đầy đủ API CRUD cho donors
- Form chỉ hiển thị các field có trong User entity
- Thông tin donors được hiển thị đầy đủ và chính xác
- Hệ thống hoạt động ổn định và nhất quán 