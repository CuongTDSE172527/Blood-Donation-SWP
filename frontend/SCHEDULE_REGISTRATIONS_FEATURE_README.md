# Chức năng Xem Danh sách Users Đăng ký trong Lịch Hiến máu

## Tổng quan
Chức năng này cho phép staff xem danh sách chi tiết các users đã đăng ký tham gia hiến máu trong một lịch hiến máu cụ thể.

## Tính năng chính

### 1. Hiển thị danh sách lịch hiến máu
- Hiển thị tất cả lịch hiến máu với thông tin: ngày, giờ, địa điểm
- Thêm cột "Registrations" với badge hiển thị số lượng đăng ký
- Icon People với tooltip "View registrations"

### 2. Dialog xem chi tiết đăng ký
- Click vào icon People để mở dialog xem danh sách đăng ký
- Hiển thị thông tin chi tiết của từng user đăng ký:
  - Tên đầy đủ
  - Email
  - Số điện thoại
  - Nhóm máu
  - Trạng thái đăng ký (Pending, Confirmed, Cancelled)
  - Ngày đăng ký

### 3. Giao diện người dùng
- Sử dụng Material-UI components
- Responsive design
- Loading states
- Error handling
- Snackbar notifications

## Cập nhật Backend

### API Endpoints
- `GET /api/staff/donors/by-schedule/{scheduleId}` - Lấy danh sách donors theo schedule
- `GET /api/admin/donors/by-schedule/{scheduleId}` - Lấy danh sách donors theo schedule (Admin)

### Response Format
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "bloodType": "A+"
    },
    "status": "PENDING",
    "registrationDate": "2024-01-15T10:30:00",
    "donorName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0123456789",
    "bloodType": "A+"
  }
]
```

## Cập nhật Frontend

### Components được cập nhật
- `src/pages/staff/Schedule.jsx` - Trang quản lý lịch hiến máu của staff

### Tính năng mới
1. **Badge hiển thị số lượng đăng ký**
   - Sử dụng Material-UI Badge component
   - Hiển thị số lượng users đã đăng ký

2. **Dialog xem chi tiết đăng ký**
   - Modal dialog với danh sách users
   - Avatar cho mỗi user
   - Chip hiển thị trạng thái với màu sắc tương ứng
   - Thông tin chi tiết: email, phone, blood type, ngày đăng ký

3. **Loading và Error handling**
   - Loading spinner khi đang tải dữ liệu
   - Error messages khi có lỗi
   - Empty state khi không có đăng ký

### Translation
- Thêm các key translation mới:
  - `staff.registrations`: "Registrations" / "Đăng ký"
  - `staff.close`: "Close" / "Đóng"

## Cách sử dụng

1. **Truy cập trang Schedule Management**
   - Đăng nhập với tài khoản Staff
   - Vào menu "Schedule Management"

2. **Xem danh sách lịch hiến máu**
   - Danh sách hiển thị tất cả lịch hiến máu
   - Cột "Registrations" hiển thị số lượng đăng ký

3. **Xem chi tiết đăng ký**
   - Click vào icon People trong cột "Registrations"
   - Dialog mở ra hiển thị danh sách users đăng ký
   - Xem thông tin chi tiết của từng user

## Lợi ích

1. **Quản lý hiệu quả**: Staff có thể dễ dàng xem ai đã đăng ký tham gia hiến máu
2. **Thông tin chi tiết**: Hiển thị đầy đủ thông tin liên hệ và trạng thái đăng ký
3. **Giao diện thân thiện**: Sử dụng Material-UI với thiết kế đẹp và dễ sử dụng
4. **Responsive**: Hoạt động tốt trên các thiết bị khác nhau

## Công nghệ sử dụng

### Frontend
- React.js
- Material-UI (MUI)
- React i18n (Internationalization)

### Backend
- Spring Boot
- JPA/Hibernate
- RESTful API

### Database
- MySQL/PostgreSQL (tùy theo cấu hình) 