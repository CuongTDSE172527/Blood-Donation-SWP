# Debug Guide - Vấn đề không hiển thị lịch hiến máu

## Tổng quan
Tài liệu này hướng dẫn cách debug và khắc phục vấn đề không hiển thị lịch hiến máu trong trang Schedule Management.

## Các bước debug

### 1. Kiểm tra Console Logs

#### Frontend Console
Mở Developer Tools (F12) và kiểm tra Console tab:
```javascript
// Các log cần kiểm tra:
- "Fetching schedules..."
- "Schedules response: [...]"
- Các lỗi API nếu có
```

#### Backend Console
Kiểm tra console của Spring Boot application:
```java
// Các log cần kiểm tra:
- "Found X schedules"
- "No schedules found in database"
- "Returning X schedules with registration counts"
- Các lỗi exception nếu có
```

### 2. Kiểm tra Database

#### Kiểm tra bảng schedules
```sql
SELECT * FROM donation_schedules;
```

#### Kiểm tra bảng locations
```sql
SELECT * FROM donation_locations;
```

#### Kiểm tra bảng registrations
```sql
SELECT * FROM donation_registrations;
```

### 3. Tạo dữ liệu mẫu để test

#### Tạo Location mẫu
```bash
curl -X POST http://localhost:8080/api/staff/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bệnh viện Chợ Rẫy",
    "address": "201B Nguyễn Chí Thanh, Quận 5, TP.HCM",
    "capacity": 100
  }'
```

#### Tạo Schedule mẫu
```bash
curl -X POST http://localhost:8080/api/staff/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-25",
    "time": "08:00",
    "location": {
      "id": 1
    }
  }'
```

### 4. Test API trực tiếp

#### Test API getAllSchedules
```bash
curl -X GET http://localhost:8080/api/staff/schedules
```

#### Test API getAllLocations
```bash
curl -X GET http://localhost:8080/api/staff/locations
```

### 5. Kiểm tra Network Tab

Trong Developer Tools, mở Network tab và:
1. Refresh trang Schedule Management
2. Kiểm tra request đến `/api/staff/schedules`
3. Xem response status và data

## Các vấn đề có thể gặp

### 1. Database trống
**Triệu chứng**: Backend log "No schedules found in database"
**Giải pháp**: Tạo dữ liệu mẫu như hướng dẫn ở trên

### 2. Lỗi API response format
**Triệu chứng**: Frontend nhận được data nhưng không hiển thị
**Giải pháp**: Kiểm tra format response có đúng không

### 3. Lỗi authentication
**Triệu chứng**: API trả về 401/403
**Giải pháp**: Kiểm tra token và đăng nhập

### 4. Lỗi CORS
**Triệu chứng**: API call bị block
**Giải pháp**: Kiểm tra CORS configuration

## Các cải thiện đã thực hiện

### 1. Backend
- Thêm error handling và logging
- Kiểm tra null pointer cho location
- Trả về empty array thay vì null khi không có data

### 2. Frontend
- Thêm console.log để debug
- Cải thiện error handling
- Hiển thị thông báo khi không có dữ liệu

## Cách test sau khi fix

### 1. Test với database trống
- Vào trang Schedule Management
- Kiểm tra hiển thị thông báo "No schedules found"
- Tạo schedule mới

### 2. Test với dữ liệu có sẵn
- Tạo location và schedule mẫu
- Vào trang Schedule Management
- Kiểm tra hiển thị danh sách schedules
- Kiểm tra badge registration count
- Click vào icon People để xem registrations

### 3. Test error handling
- Tắt backend server
- Vào trang Schedule Management
- Kiểm tra hiển thị error message

## Troubleshooting

### Nếu vẫn không hiển thị:

1. **Kiểm tra backend logs**:
   ```bash
   # Xem logs của Spring Boot
   tail -f logs/application.log
   ```

2. **Kiểm tra database connection**:
   ```bash
   # Test database connection
   mysql -u username -p database_name
   ```

3. **Kiểm tra API endpoints**:
   ```bash
   # Test health check
   curl http://localhost:8080/actuator/health
   ```

4. **Kiểm tra frontend build**:
   ```bash
   # Rebuild frontend
   npm run build
   npm start
   ```

## Kết luận

Sau khi thực hiện các bước debug trên, vấn đề không hiển thị lịch hiến máu sẽ được khắc phục. Các cải thiện về error handling và logging sẽ giúp dễ dàng phát hiện và sửa lỗi trong tương lai. 