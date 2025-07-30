# Validation Fix - Prohibited Diseases Check

## Tổng quan
Tài liệu này mô tả việc sửa lỗi validation để ngăn chặn người dùng có bệnh bị cấm (như HIV/AIDS) đăng ký hiến máu.

## Vấn đề
- Người dùng có thể chọn các bệnh bị cấm (HIV/AIDS, viêm gan, v.v.) trong form đăng ký hiến máu
- Hệ thống không có validation để ngăn chặn việc đăng ký khi có bệnh bị cấm
- Có thể dẫn đến rủi ro an toàn cho người nhận máu

## Giải pháp

### 1. Frontend Validation (DonationRegistration.jsx)

#### Thêm validation trong handleSubmit:
```javascript
// Check for prohibited diseases
if (formData.diseaseIds && formData.diseaseIds.length > 0) {
  const selectedDiseases = diseases.filter(disease => 
    formData.diseaseIds.includes(disease.id)
  );
  
  if (selectedDiseases.length > 0) {
    const diseaseNames = selectedDiseases.map(disease => disease.name).join(', ');
    setError(`You cannot donate blood if you have the following conditions: ${diseaseNames}. Please consult with a healthcare provider.`);
    return;
  }
}
```

#### Tính năng:
- Kiểm tra xem người dùng có chọn bệnh bị cấm không
- Hiển thị thông báo lỗi với tên các bệnh bị cấm
- Ngăn chặn việc submit form

### 2. Backend Validation

#### DonorController.java - API `/donor/register`:
```java
// Check for prohibited diseases first
if (body.containsKey("diseaseIds")) {
    List<Long> diseaseIds = ((List<?>) body.get("diseaseIds")).stream()
            .map(id -> Long.parseLong(id.toString()))
            .collect(Collectors.toList());
    
    if (!diseaseIds.isEmpty()) {
        List<ProhibitedDisease> selectedDiseases = diseaseRepo.findAllById(diseaseIds);
        if (!selectedDiseases.isEmpty()) {
            String diseaseNames = selectedDiseases.stream()
                    .map(ProhibitedDisease::getName)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(
                "You cannot donate blood if you have the following conditions: " + diseaseNames + 
                ". Please consult with a healthcare provider."
            );
        }
    }
}
```

#### DonorController.java - API `/donor/registrations`:
```java
// Check for prohibited diseases
if (registration.getDiseases() != null && !registration.getDiseases().isEmpty()) {
    String diseaseNames = registration.getDiseases().stream()
            .map(ProhibitedDisease::getName)
            .collect(Collectors.joining(", "));
    return ResponseEntity.badRequest().body(
        "You cannot donate blood if you have the following conditions: " + diseaseNames + 
        ". Please consult with a healthcare provider."
    );
}
```

#### StaffController.java - API `/staff/registrations`:
```java
@PostMapping("/registrations")
public ResponseEntity<?> createRegistration(@RequestBody Map<String, Object> body) {
    try {
        // Check for prohibited diseases first
        if (body.containsKey("diseaseIds")) {
            List<Long> diseaseIds = ((List<?>) body.get("diseaseIds")).stream()
                    .map(id -> Long.parseLong(id.toString()))
                    .collect(Collectors.toList());
            
            if (!diseaseIds.isEmpty()) {
                List<ProhibitedDisease> selectedDiseases = diseaseRepo.findAllById(diseaseIds);
                if (!selectedDiseases.isEmpty()) {
                    String diseaseNames = selectedDiseases.stream()
                            .map(ProhibitedDisease::getName)
                            .collect(Collectors.joining(", "));
                    return ResponseEntity.badRequest().body(
                        "You cannot donate blood if you have the following conditions: " + diseaseNames + 
                        ". Please consult with a healthcare provider."
                    );
                }
            }
        }
        
        // Create registration logic...
        // Set empty diseases set since validation passed
        reg.setDiseases(new HashSet<>());
        
        return ResponseEntity.ok(registrationRepo.save(reg));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Error creating registration: " + e.getMessage());
    }
}
```

## Các API được cập nhật

### 1. Frontend APIs
- `donorService.registerDonation()` - Đăng ký hiến máu thông thường
- `scheduleService.registerForSchedule()` - Đăng ký hiến máu theo lịch

### 2. Backend APIs
- `POST /api/donor/register` - Đăng ký hiến máu (DonorController)
- `POST /api/donor/registrations` - Tạo đăng ký (DonorController)
- `POST /api/staff/registrations` - Tạo đăng ký (StaffController)

## Luồng validation

### 1. Frontend Validation
1. Người dùng điền form đăng ký hiến máu
2. Chọn các bệnh bị cấm (nếu có)
3. Click Submit
4. Frontend kiểm tra `formData.diseaseIds`
5. Nếu có bệnh bị cấm → Hiển thị lỗi và dừng
6. Nếu không có → Gửi request đến backend

### 2. Backend Validation
1. Nhận request từ frontend
2. Kiểm tra `diseaseIds` trong request body
3. Nếu có bệnh bị cấm → Trả về error 400
4. Nếu không có → Tạo registration với `diseases = empty set`
5. Lưu vào database

## Các bệnh bị cấm hiến máu

Các bệnh được định nghĩa trong bảng `prohibited_diseases`:
- HIV/AIDS
- Viêm gan B, C
- Bệnh lây truyền qua đường tình dục
- Bệnh tim mạch nghiêm trọng
- Bệnh ung thư
- Và các bệnh khác theo quy định

## Testing

### 1. Test Frontend Validation
1. Vào trang `/donation-registration`
2. Chọn một bệnh bị cấm (ví dụ: HIV/AIDS)
3. Điền đầy đủ thông tin khác
4. Click Submit
5. **Expected**: Hiển thị thông báo lỗi và không submit

### 2. Test Backend Validation
1. Gửi request POST với `diseaseIds` chứa ID bệnh bị cấm
2. **Expected**: Response 400 với thông báo lỗi

### 3. Test Normal Registration
1. Không chọn bệnh bị cấm
2. Điền đầy đủ thông tin
3. Click Submit
4. **Expected**: Đăng ký thành công

## Lợi ích

### 1. An toàn
- Ngăn chặn người có bệnh bị cấm hiến máu
- Bảo vệ sức khỏe người nhận máu
- Tuân thủ quy định y tế

### 2. Trải nghiệm người dùng
- Thông báo lỗi rõ ràng
- Hướng dẫn người dùng tư vấn bác sĩ
- Validation ngay lập tức

### 3. Bảo mật
- Validation ở cả frontend và backend
- Đảm bảo tính toàn vẹn dữ liệu
- Ngăn chặn bypass validation

## Kết luận

Việc thêm validation cho bệnh bị cấm hiến máu đã được hoàn thành với:
- Validation ở frontend để UX tốt hơn
- Validation ở backend để đảm bảo an toàn
- Thông báo lỗi rõ ràng và hữu ích
- Tài liệu hóa đầy đủ cho việc maintain

Hệ thống hiện tại đã an toàn và tuân thủ các quy định y tế về hiến máu. 