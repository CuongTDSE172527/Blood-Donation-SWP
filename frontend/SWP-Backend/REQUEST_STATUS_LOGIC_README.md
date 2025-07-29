# Blood Request Status Logic Update

## Problem
Khi một request có trạng thái "PROCESSING" hoặc "PENDING" được confirm, trạng thái vẫn giữ nguyên mặc dù kho máu đã bị trừ đi. Điều này gây nhầm lẫn vì người dùng không biết request đã được xử lý hay chưa.

## Solution
Cập nhật logic xử lý trạng thái khi confirm request để phản ánh đúng trạng thái thực tế.

## New Status Logic

### Khi Confirm Request (có trừ kho máu):

#### Trường hợp 1: Request từ PENDING hoặc WAITING
- **Trước**: Chuyển thành WAITING (gây nhầm lẫn)
- **Sau**: Chuyển thành **CONFIRM** (đã xác nhận)

#### Trường hợp 2: Request từ trạng thái khác
- **Trước**: Chuyển thành WAITING
- **Sau**: Giữ nguyên logic cũ (chuyển thành WAITING)

### Các Trạng Thái Hiện Có:
1. **PENDING** - Chờ xử lý (mặc định khi tạo)
2. **WAITING** - Đang xử lý (staff đặt)
3. **CONFIRM** - Đã xác nhận (mới thêm)
4. **PRIORITY** - Ưu tiên xử lý
5. **OUT_OF_STOCK** - Đã hết máu

## Implementation

### Backend Changes

#### AdminController.java & StaffController.java
```java
// Logic cập nhật trạng thái dựa trên trạng thái hiện tại
BloodRequestStatus newStatus;
if (req.getStatus() == BloodRequestStatus.PENDING || req.getStatus() == BloodRequestStatus.WAITING) {
    newStatus = BloodRequestStatus.CONFIRM; // Chuyển thành đã xác nhận
} else {
    newStatus = BloodRequestStatus.WAITING; // Giữ logic cũ cho các trạng thái khác
}
```

### Frontend Changes

#### Redux Slice (bloodRequestSlice.js)
```javascript
// Logic cập nhật trạng thái dựa trên trạng thái hiện tại
if (request.status === 'PENDING' || request.status === 'WAITING') {
  request.status = 'CONFIRM';
} else {
  request.status = 'WAITING';
}
```

#### Admin Pages (Requests.jsx & Dashboard.jsx)
```javascript
// Logic cập nhật trạng thái dựa trên trạng thái hiện tại
let newStatus;
if (request.status === 'PENDING' || request.status === 'WAITING') {
  newStatus = 'CONFIRM';
} else {
  newStatus = 'WAITING';
}
```

#### Staff Pages (Requests.jsx)
```javascript
// Logic cập nhật trạng thái dựa trên trạng thái hiện tại
if (editRequest.status === 'PENDING' || editRequest.status === 'WAITING') {
  newStatus = 'CONFIRM';
} else {
  newStatus = 'WAITING';
}
```

## UI Updates

### Status Colors
- **PENDING**: Warning (vàng)
- **WAITING**: Info (xanh nhạt)
- **CONFIRM**: Success (xanh lá) - **MỚI**
- **PRIORITY**: Error (đỏ)
- **OUT_OF_STOCK**: Default (xám)

### Status Labels (Vietnamese)
- **PENDING**: "Chờ xử lý"
- **WAITING**: "Đang xử lý"
- **CONFIRM**: "Đã xác nhận" - **MỚI**
- **PRIORITY**: "Ưu tiên"
- **OUT_OF_STOCK**: "Hết hàng"

## Workflow Examples

### Example 1: Normal Confirmation
1. Medical Center tạo request → **PENDING**
2. Staff confirm request → **CONFIRM** (kho máu bị trừ)
3. Request hoàn thành

### Example 2: Priority Request
1. Medical Center tạo request → **PENDING**
2. Staff mark as priority → **PRIORITY**
3. Staff confirm request → **CONFIRM** (kho máu bị trừ)
4. Request hoàn thành

### Example 3: Out of Stock
1. Medical Center tạo request → **PENDING**
2. Staff mark as out of stock → **OUT_OF_STOCK**
3. Khi có máu, staff confirm → **CONFIRM** (kho máu bị trừ)
4. Request hoàn thành

## Benefits
1. **Rõ ràng hơn**: Người dùng biết chính xác trạng thái request
2. **Logic nhất quán**: Tất cả confirm đều chuyển thành CONFIRM khi từ PENDING/WAITING
3. **Dễ theo dõi**: Có thể phân biệt request đang xử lý vs đã xác nhận
4. **Kho máu chính xác**: Vẫn trừ kho máu đúng cách

## Testing
1. Tạo request với trạng thái PENDING
2. Confirm request
3. Verify: Trạng thái chuyển thành CONFIRM và kho máu bị trừ
4. Tạo request với trạng thái PRIORITY
5. Confirm request
6. Verify: Trạng thái chuyển thành CONFIRM và kho máu bị trừ 