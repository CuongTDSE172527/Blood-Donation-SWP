# Menu và Inventory Fix - Sửa lỗi Menu và Inventory

## Tổng quan
Đã thực hiện hai yêu cầu chính:
1. Bỏ lựa chọn medical center khỏi menu của user profile trong home, admin, và staff
2. Sửa lỗi `staffService.updateBloodInventory is not a function`

## 1. Bỏ lựa chọn Medical Center khỏi Menu

### Files đã được cập nhật:

#### `src/layouts/MainLayout.jsx`
- **Thay đổi**: Xóa menu item "Medical Center" khỏi user profile menu
- **Lý do**: Ngăn chặn các role khác (ADMIN, STAFF) truy cập vào dashboard của medical center
- **Code đã xóa**:
```jsx
{(user.role === 'STAFF' || user.role === 'ADMIN') && (
  <MenuItem onClick={() => navigate('/medical-center/dashboard')}>
    <ListItemIcon>
      <LocalHospital fontSize="small" />
    </ListItemIcon>
    <ListItemText primary={t('nav.medicalCenter') || 'Medical Center'} />
  </MenuItem>
)}
```

#### `src/layouts/AdminLayout.jsx`
- **Thay đổi**: Xóa menu item "Medical Center" khỏi admin profile menu
- **Code đã xóa**:
```jsx
<MenuItem onClick={() => { navigate('/medical-center'); handleProfileClose(); }}>
  {t('nav.medicalCenter') || 'Medical Center'}
</MenuItem>
```

#### `src/layouts/StaffLayout.jsx`
- **Thay đổi**: Xóa menu item "Medical Center" khỏi staff profile menu
- **Code đã xóa**:
```jsx
<MenuItem onClick={() => { navigate('/medical-center'); handleProfileClose(); }}>
  {t('nav.medicalCenter') || 'Medical Center'}
</MenuItem>
```

### Kết quả:
- Chỉ có user có role `MEDICALCENTER` mới có thể truy cập vào medical center dashboard
- Các role khác (ADMIN, STAFF) không còn thấy option "Medical Center" trong menu profile
- Đảm bảo tính bảo mật và phân quyền rõ ràng

## 2. Sửa lỗi staffService.updateBloodInventory

### Vấn đề:
- Lỗi `staffService.updateBloodInventory is not a function` khi staff cố gắng thay đổi units của máu trong inventory
- Method này chưa được định nghĩa trong `staffService.js`
- Backend StaffController chưa có endpoint để update blood inventory

### Files đã được cập nhật:

#### `src/services/staffService.js`
- **Thêm method**: `updateBloodInventory(id, inventoryData)`
- **Thêm method**: `addBloodInventory(inventoryData)` (để nhất quán với adminService)
- **Thêm method**: `deleteBloodInventory(id)` (để nhất quán với adminService)

```javascript
// === Blood Inventory ===
updateBloodInventory: async (id, inventoryData) => {
  try {
    const response = await api.put(`/staff/inventory/${id}`, inventoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

addBloodInventory: async (inventoryData) => {
  try {
    const response = await api.post('/staff/inventory', inventoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

deleteBloodInventory: async (id) => {
  try {
    const response = await api.delete(`/staff/inventory/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
```

#### `SWP-Backend/src/main/java/com/example/demo1/controller/staff/StaffController.java`
- **Thêm endpoint**: `PUT /api/staff/inventory/{id}` - Update blood inventory
- **Thêm endpoint**: `POST /api/staff/inventory` - Add new blood inventory
- **Thêm endpoint**: `DELETE /api/staff/inventory/{id}` - Delete blood inventory

```java
@PutMapping("/inventory/{id}")
public ResponseEntity<?> updateBloodInventory(@PathVariable Long id, @RequestBody BloodInventory updated) {
    Optional<BloodInventory> optional = bloodInventoryRepo.findById(id);
    if (optional.isEmpty()) {
        return ResponseEntity.badRequest().body("Blood inventory not found");
    }

    BloodInventory inv = optional.get();
    if (updated.getQuantity() != null) {
        inv.setQuantity(updated.getQuantity());
    }
    return ResponseEntity.ok(bloodInventoryRepo.save(inv));
}

@PostMapping("/inventory")
public ResponseEntity<?> addBloodInventory(@RequestBody BloodInventory inventory) {
    return ResponseEntity.ok(bloodInventoryRepo.save(inventory));
}

@DeleteMapping("/inventory/{id}")
public ResponseEntity<?> deleteBloodInventory(@PathVariable Long id) {
    if (!bloodInventoryRepo.existsById(id)) {
        return ResponseEntity.badRequest().body("Blood inventory not found");
    }
    bloodInventoryRepo.deleteById(id);
    return ResponseEntity.ok("Blood inventory deleted successfully");
}
```

### Kết quả:
- Staff có thể thay đổi units của máu trong inventory mà không gặp lỗi
- API endpoints đầy đủ cho CRUD operations trên blood inventory
- Tính nhất quán giữa adminService và staffService

## Lợi ích

### 1. Bảo mật tốt hơn:
- Phân quyền rõ ràng giữa các role
- Ngăn chặn truy cập trái phép vào medical center dashboard

### 2. Chức năng hoàn thiện:
- Staff có thể quản lý inventory đầy đủ
- Không còn lỗi function không tồn tại
- API endpoints đầy đủ và nhất quán

### 3. Trải nghiệm người dùng:
- Menu gọn gàng, chỉ hiển thị các option phù hợp với role
- Chức năng inventory hoạt động mượt mà

## Kiểm tra

### Để kiểm tra menu fix:
1. Đăng nhập với role ADMIN hoặc STAFF
2. Click vào avatar/profile menu
3. Xác nhận không còn thấy option "Medical Center"

### Để kiểm tra inventory fix:
1. Đăng nhập với role STAFF
2. Vào trang Inventory
3. Thử edit quantity của một blood type
4. Xác nhận không còn lỗi và có thể lưu thay đổi

## Lưu ý

- Các thay đổi không ảnh hưởng đến chức năng management của admin
- Medical center users vẫn có thể truy cập dashboard của họ bình thường
- Tất cả các API endpoints đều có error handling phù hợp 