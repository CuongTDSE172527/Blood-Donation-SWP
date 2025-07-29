# Translation Keys Update - Cập nhật Translation Keys

## Tổng quan
Đã thực hiện việc kiểm tra và bổ sung các translation keys còn thiếu trong hệ thống hiến máu. Tất cả các keys được sử dụng trong code đã được thêm vào cả hai file translation (tiếng Việt và tiếng Anh).

## Các Translation Keys đã thêm

### 1. Common Keys (Chung)
```json
{
  "error": "Lỗi",
  "create": "Tạo",
  "update": "Cập nhật", 
  "loading": "Đang tải...",
  "confirm": "Xác nhận",
  "search": "Tìm kiếm",
  "filterByStatus": "Lọc theo trạng thái",
  "sortBy": "Sắp xếp theo",
  "allStatuses": "Tất cả trạng thái",
  "patientName": "Tên bệnh nhân",
  "amount": "Số lượng",
  "medicalCenter": "Trung tâm y tế",
  "searchPlaceholder": "Tìm kiếm theo tên, nhóm máu, hoặc ID...",
  "searchRequestsPlaceholder": "Tìm kiếm theo tên, nhóm máu, trung tâm y tế, hoặc ID...",
  "showingResults": "Hiển thị",
  "of": "trong số",
  "requests": "yêu cầu",
  "noMatchingRequests": "Không tìm thấy yêu cầu phù hợp",
  "confirmRequestSuccess": "Xác nhận yêu cầu thành công!",
  "completeRequestSuccess": "Hoàn thành yêu cầu thành công!",
  "bloodRequests": "Yêu cầu máu",
  "currentInventory": "Kho máu hiện tại",
  "editRequest": "Chỉnh sửa yêu cầu",
  "addRequest": "Thêm yêu cầu",
  "save": "Lưu",
  "add": "Thêm",
  "actions": "Thao tác",
  "id": "ID",
  "requestDate": "Ngày yêu cầu",
  "editRequestStatus": "Chỉnh sửa trạng thái yêu cầu",
  "currentStatus": "Trạng thái hiện tại",
  "newStatus": "Trạng thái mới",
  "updateStatus": "Cập nhật trạng thái"
}
```

### 2. Admin Keys
```json
{
  "totalSchedules": "Tổng số lịch hiến máu",
  "manageMedicalCenters": "Quản lý cơ sở y tế",
  "confirmRequestSuccess": "Xác nhận yêu cầu thành công!",
  "scheduleManagementDesc": "Quản lý lịch hiến máu",
  "manageSchedules": "Quản lý lịch hiến máu",
  "search": "Tìm kiếm",
  "searchPlaceholder": "Tìm kiếm theo tên, nhóm máu, hoặc ID...",
  "filterByStatus": "Lọc theo trạng thái",
  "allStatuses": "Tất cả trạng thái",
  "sortBy": "Sắp xếp theo",
  "patientName": "Tên bệnh nhân",
  "amount": "Số lượng",
  "showingResults": "Hiển thị",
  "of": "trong số",
  "requests": "yêu cầu",
  "noMatchingRequests": "Không tìm thấy yêu cầu phù hợp",
  "bloodRequests": "Yêu cầu máu",
  "confirm": "Xác nhận"
}
```

### 3. Staff Keys
```json
{
  "search": "Tìm kiếm",
  "searchPlaceholder": "Tìm kiếm theo tên, nhóm máu, trung tâm y tế, hoặc ID...",
  "filterByStatus": "Lọc theo trạng thái",
  "allStatuses": "Tất cả trạng thái",
  "sortBy": "Sắp xếp theo",
  "patientName": "Tên bệnh nhân",
  "amount": "Số lượng",
  "medicalCenter": "Trung tâm y tế",
  "showingResults": "Hiển thị",
  "of": "trong số",
  "requests": "yêu cầu",
  "noMatchingRequests": "Không tìm thấy yêu cầu phù hợp",
  "bloodRequests": "Yêu cầu máu",
  "id": "ID",
  "editRequestStatus": "Chỉnh sửa trạng thái yêu cầu",
  "currentStatus": "Trạng thái hiện tại",
  "newStatus": "Trạng thái mới",
  "updateStatus": "Cập nhật trạng thái",
  "status_out_of_stock": "Hết hàng",
  "status_waiting": "Chờ xử lý",
  "status_priority": "Ưu tiên",
  "editEmergencyStatus": "Chỉnh sửa trạng thái khẩn cấp",
  "status_": "Không xác định"
}
```

### 4. User Keys
```json
{
  "noDonationRecord": "Không có lịch sử hiến máu",
  "noActiveRequests": "Không có yêu cầu đang hoạt động"
}
```

### 5. Donor Keys
```json
{
  "dob": "Ngày sinh",
  "gender": "Giới tính"
}
```

### 6. Login Keys
```json
{
  "error": "Email hoặc mật khẩu không đúng",
  "errorMessage": "Vui lòng kiểm tra email và mật khẩu",
  "successMessage": "Đăng nhập thành công"
}
```

### 7. Donation Keys
```json
{
  "bloodType": "Nhóm máu",
  "lastDonationDate": "Ngày hiến máu gần nhất",
  "weight": "Cân nặng",
  "height": "Chiều cao",
  "amount": "Số lượng",
  "location": "Địa điểm",
  "prohibitedDiseases": "Bệnh cấm hiến máu",
  "register": "Đăng ký",
  "submit": "Gửi"
}
```

### 8. Medical Center Keys
```json
{
  "age": "Tuổi"
}
```

## Files đã được cập nhật

1. **`src/translations/vi.json`** - File translation tiếng Việt
2. **`src/translations/en.json`** - File translation tiếng Anh

## Lợi ích

1. **Đầy đủ hóa**: Tất cả các translation keys được sử dụng trong code đã có định nghĩa
2. **Nhất quán**: Đảm bảo tính nhất quán giữa các ngôn ngữ
3. **Dễ bảo trì**: Dễ dàng thêm/sửa/xóa translation keys
4. **Trải nghiệm người dùng**: Giao diện hiển thị đầy đủ và chính xác

## Cách sử dụng

Các translation keys mới có thể được sử dụng trong code như sau:

```javascript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

// Sử dụng key mới
t('common.search') // "Tìm kiếm" hoặc "Search"
t('admin.confirmRequestSuccess') // "Xác nhận yêu cầu thành công!" hoặc "Request confirmed successfully!"
```

## Lưu ý

- Tất cả các keys đã được thêm vào cả hai ngôn ngữ (Việt-Anh)
- Các keys được tổ chức theo nhóm chức năng rõ ràng
- Fallback values vẫn được giữ lại trong code để đảm bảo tương thích ngược 