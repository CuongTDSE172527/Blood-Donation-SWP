# Search and Sort Features for Request Management

## Overview
Đã thêm các tính năng tìm kiếm và sắp xếp vào tất cả các trang quản lý request (Admin, Staff, Medical Center) để cải thiện trải nghiệm người dùng và hiệu quả quản lý.

## Tính Năng Mới

### 1. Tìm Kiếm (Search)
- **Tìm kiếm theo tên bệnh nhân**: Tìm kiếm theo tên người nhận máu
- **Tìm kiếm theo nhóm máu**: Tìm kiếm theo loại máu cần thiết
- **Tìm kiếm theo ID**: Tìm kiếm theo ID của request
- **Tìm kiếm theo trung tâm y tế** (Staff): Tìm kiếm theo tên trung tâm y tế
- **Tìm kiếm theo lý do y tế** (Medical Center): Tìm kiếm theo lý do y tế

### 2. Lọc Theo Trạng Thái (Status Filter)
- **Tất cả trạng thái**: Hiển thị tất cả requests
- **PENDING**: Chờ xử lý
- **WAITING**: Đang xử lý
- **CONFIRM**: Đã xác nhận
- **PRIORITY**: Ưu tiên
- **OUT_OF_STOCK**: Hết hàng

### 3. Sắp Xếp (Sorting)
- **Theo ngày**: Sắp xếp theo ngày tạo request
- **Theo tên**: Sắp xếp theo tên bệnh nhân
- **Theo nhóm máu**: Sắp xếp theo loại máu
- **Theo số lượng**: Sắp xếp theo số lượng máu cần thiết
- **Theo trạng thái**: Sắp xếp theo trạng thái request
- **Theo trung tâm y tế** (Staff): Sắp xếp theo tên trung tâm y tế
- **Theo mức độ khẩn cấp** (Medical Center): Sắp xếp theo mức độ khẩn cấp

### 4. Thứ Tự Sắp Xếp (Sort Order)
- **Tăng dần (↑)**: Sắp xếp từ A-Z, từ nhỏ đến lớn
- **Giảm dần (↓)**: Sắp xếp từ Z-A, từ lớn đến nhỏ

## Giao Diện

### Search and Filter Section
```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search requests...] [Filter by Status ▼] [Sort By ▼] [↑↓]  │
└─────────────────────────────────────────────────────────────────┘
```

### Results Counter
```
Blood Requests                    Showing 5 of 10 requests
```

### No Results Message
- Khi có filter/search: "No matching requests found"
- Khi không có data: "No data"

## Implementation Details

### State Management
```javascript
// Search and filter states
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('ALL');
const [sortBy, setSortBy] = useState('date');
const [sortOrder, setSortOrder] = useState('desc');
const [filteredRequests, setFilteredRequests] = useState([]);
```

### Filter and Sort Logic
```javascript
const filterAndSortRequests = () => {
  let filtered = [...requests];

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(request => 
      (request.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.recipientBloodType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.id?.toString() || '').includes(searchTerm)
    );
  }

  // Apply status filter
  if (statusFilter !== 'ALL') {
    filtered = filtered.filter(request => request.status === statusFilter);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    // Sorting logic based on sortBy and sortOrder
  });

  setFilteredRequests(filtered);
};
```

### Real-time Updates
```javascript
// Filter and sort requests when data changes
useEffect(() => {
  filterAndSortRequests();
}, [requests, searchTerm, statusFilter, sortBy, sortOrder]);
```

## Các Trang Được Cập Nhật

### 1. Admin Requests (`src/pages/admin/Requests.jsx`)
- **Tìm kiếm**: Tên bệnh nhân, nhóm máu, ID
- **Sắp xếp**: Ngày, tên, nhóm máu, số lượng, trạng thái
- **Hiển thị**: Bảng requests và inventory

### 2. Staff Requests (`src/pages/staff/Requests.jsx`)
- **Tìm kiếm**: Tên bệnh nhân, nhóm máu, trung tâm y tế, ID
- **Sắp xếp**: Ngày, tên, nhóm máu, số lượng, trạng thái, trung tâm y tế
- **Hiển thị**: Bảng requests với thông tin trung tâm y tế

### 3. Medical Center Requests (`src/pages/medicalCenter/Requests.jsx`)
- **Tìm kiếm**: Tên bệnh nhân, nhóm máu, lý do y tế, ID
- **Sắp xếp**: Ngày, tên, nhóm máu, số lượng, trạng thái, mức độ khẩn cấp
- **Hiển thị**: Bảng requests với thông tin chi tiết

## Responsive Design

### Desktop (md và lớn hơn)
- Grid layout: 4-3-3-2 columns
- Tất cả controls hiển thị trên cùng một hàng

### Mobile (xs và sm)
- Grid layout: 12 columns (stacked)
- Controls xếp chồng theo chiều dọc

## Performance Optimizations

### 1. Debounced Search
- Filter được thực hiện real-time khi người dùng nhập
- Không có delay nhân tạo

### 2. Efficient Filtering
- Sử dụng `filter()` và `sort()` methods
- Không tạo ra deep copies không cần thiết

### 3. Memoization
- `filterAndSortRequests` chỉ chạy khi dependencies thay đổi
- Tránh re-render không cần thiết

## Accessibility Features

### 1. Keyboard Navigation
- Tất cả controls có thể truy cập bằng keyboard
- Tab order hợp lý

### 2. Screen Reader Support
- Labels rõ ràng cho tất cả inputs
- ARIA labels cho icons

### 3. Visual Indicators
- Icons cho search và sort
- Màu sắc phân biệt cho các trạng thái

## Internationalization (i18n)

### Translation Keys
```javascript
// Search
'admin.search' || 'Search requests...'
'admin.searchPlaceholder' || 'Search by name, blood type, or ID...'

// Filter
'admin.filterByStatus' || 'Filter by Status'
'admin.allStatuses' || 'All Statuses'

// Sort
'admin.sortBy' || 'Sort By'
'admin.date' || 'Date'
'admin.patient' || 'Patient Name'

// Results
'admin.showingResults' || 'Showing'
'admin.of' || 'of'
'admin.requests' || 'requests'
'admin.noMatchingRequests' || 'No matching requests found'
```

## Testing Scenarios

### 1. Search Functionality
- Tìm kiếm theo tên bệnh nhân
- Tìm kiếm theo nhóm máu
- Tìm kiếm theo ID
- Tìm kiếm với kết quả trống

### 2. Status Filtering
- Lọc theo từng trạng thái
- Lọc "All Statuses"
- Kết hợp với search

### 3. Sorting
- Sắp xếp theo tất cả các trường
- Thay đổi thứ tự sắp xếp
- Kết hợp với filter và search

### 4. Responsive Design
- Test trên desktop
- Test trên tablet
- Test trên mobile

## Future Enhancements

### 1. Advanced Search
- Tìm kiếm theo khoảng thời gian
- Tìm kiếm theo số lượng máu
- Tìm kiếm theo mức độ khẩn cấp

### 2. Saved Filters
- Lưu filter preferences
- Quick filter buttons

### 3. Export Functionality
- Export filtered results
- Export theo định dạng CSV/Excel

### 4. Bulk Actions
- Chọn nhiều requests
- Bulk status update
- Bulk delete

## Benefits

### 1. User Experience
- Tìm kiếm nhanh chóng
- Lọc chính xác
- Sắp xếp linh hoạt

### 2. Productivity
- Giảm thời gian tìm kiếm
- Quản lý hiệu quả hơn
- Dễ dàng theo dõi requests

### 3. Scalability
- Xử lý tốt với nhiều requests
- Performance ổn định
- Responsive design 