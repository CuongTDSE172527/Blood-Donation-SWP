# Tính năng Gợi ý Nhóm Máu Tương Thích

## Tổng quan
Tính năng này cho phép hệ thống gợi ý các nhóm máu tương thích khi nhóm máu yêu cầu không có sẵn hoặc không đủ trong kho. Điều này giúp tối ưu hóa việc sử dụng máu hiến và tăng khả năng đáp ứng nhu cầu cấp cứu.

## Cách hoạt động

### 1. Ma trận tương thích nhóm máu
Hệ thống sử dụng ma trận tương thích dựa trên nguyên tắc y học:

- **O-**: Chỉ nhận từ O- (người cho phổ thông)
- **O+**: Nhận từ O- và O+
- **A-**: Nhận từ O- và A-
- **A+**: Nhận từ O-, O+, A-, A+
- **B-**: Nhận từ O- và B-
- **B+**: Nhận từ O-, O+, B-, B+
- **AB-**: Nhận từ O-, A-, B-, AB-
- **AB+**: Nhận từ tất cả nhóm máu (người nhận phổ thông)

### 2. Thứ tự ưu tiên
Khi có nhiều nhóm máu tương thích, hệ thống sẽ ưu tiên theo thứ tự:
1. O- (hiếm nhất, quan trọng nhất)
2. O+
3. A-
4. B-
5. A+
6. B+
7. AB-
8. AB+

## Cấu trúc Backend

### 1. Service Layer
- **BloodCompatibilityService**: Interface định nghĩa các method cần thiết
- **BloodCompatibilityServiceImpl**: Implementation với logic tương thích

### 2. DTO
- **BloodCompatibilityResponse**: Trả về thông tin chi tiết về tính tương thích

### 3. Controller Endpoints
- `GET /api/admin/blood-compatibility/{bloodType}?requestedAmount={amount}`
- `GET /api/staff/blood-compatibility/{bloodType}?requestedAmount={amount}`

## Cấu trúc Frontend

### 1. Component
- **BloodCompatibilityInfo**: Component hiển thị thông tin tương thích

### 2. Service Integration
- **adminService.checkBloodCompatibility()**
- **staffService.checkBloodCompatibility()**

### 3. UI Integration
- Nút "Kiểm tra tính tương thích" trong trang Admin Requests
- Dialog hiển thị thông tin chi tiết

## Cách sử dụng

### 1. Trong Admin Dashboard
1. Vào trang "Blood Requests"
2. Nhấn nút "ℹ️" (Info) bên cạnh mỗi request
3. Xem thông tin tương thích trong dialog

### 2. API Usage
```javascript
// Kiểm tra tính tương thích cho nhóm máu A+ với 5 đơn vị
const result = await adminService.checkBloodCompatibility('A+', 5);

// Kết quả trả về:
{
  requestedBloodType: "A+",
  isAvailable: false,
  availableQuantity: 2,
  allCompatibleTypes: ["O-", "O+", "A-", "A+"],
  availableCompatibleTypes: {
    "O-": 10,
    "O+": 15,
    "A-": 8
  },
  message: "Nhóm máu A+ không đủ trong kho. Các nhóm máu tương thích có sẵn: O-, O+, A-"
}
```

## Lợi ích

### 1. Tối ưu hóa kho máu
- Giảm lãng phí máu hiến
- Tăng hiệu quả sử dụng

### 2. Cải thiện thời gian phản hồi
- Gợi ý nhanh các lựa chọn thay thế
- Giảm thời gian tìm kiếm

### 3. An toàn y tế
- Đảm bảo tính tương thích theo nguyên tắc y học
- Giảm rủi ro phản ứng truyền máu

## Cấu hình và Mở rộng

### 1. Thêm nhóm máu mới
Chỉ cần cập nhật `COMPATIBILITY_MATRIX` trong `BloodCompatibilityServiceImpl`

### 2. Thay đổi thứ tự ưu tiên
Cập nhật method `getBloodTypePriority()` trong `BloodCompatibilityServiceImpl`

### 3. Thêm logic phức tạp
Có thể mở rộng để tính đến:
- Kháng thể đặc biệt
- Yếu tố Rh phức tạp
- Điều kiện y tế đặc biệt

## Testing

### 1. Unit Tests
```java
@Test
public void testBloodCompatibility() {
    // Test O- compatibility
    List<String> compatible = service.getCompatibleBloodTypes("O-");
    assertEquals(Arrays.asList("O-"), compatible);
    
    // Test A+ compatibility
    compatible = service.getCompatibleBloodTypes("A+");
    assertEquals(Arrays.asList("O-", "O+", "A-", "A+"), compatible);
}
```

### 2. Integration Tests
```java
@Test
public void testCompatibilityWithInventory() {
    // Test with mock inventory
    BloodCompatibilityResponse response = service.checkBloodAvailabilityWithCompatibility("A+", 5);
    assertFalse(response.isAvailable());
    assertTrue(response.getAvailableCompatibleTypes().containsKey("O-"));
}
```

## Troubleshooting

### 1. Lỗi thường gặp
- **NullPointerException**: Kiểm tra inventory data
- **Invalid blood type**: Validate input trước khi xử lý

### 2. Performance
- Cache compatibility matrix nếu cần
- Optimize database queries cho inventory

## Tương lai

### 1. Tính năng có thể thêm
- Machine learning để dự đoán nhu cầu
- Tối ưu hóa phân bổ máu tự động
- Integration với hệ thống bệnh viện

### 2. Cải tiến
- Real-time inventory updates
- Mobile app integration
- Advanced compatibility algorithms 