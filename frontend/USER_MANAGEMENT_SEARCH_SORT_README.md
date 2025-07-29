# User Management Search and Sort Features

## Overview
Đã thêm các tính năng tìm kiếm và sắp xếp vào tất cả các trang quản lý user (Admin Users, Admin Staff, Staff Donors) để cải thiện trải nghiệm người dùng và hiệu quả quản lý.

## Tính Năng Mới

### 1. Tìm Kiếm (Search)
- **Tìm kiếm theo tên**: Tìm kiếm theo tên đầy đủ của user
- **Tìm kiếm theo email**: Tìm kiếm theo địa chỉ email
- **Tìm kiếm theo số điện thoại**: Tìm kiếm theo số điện thoại
- **Tìm kiếm theo ID**: Tìm kiếm theo ID của user

### 2. Lọc (Filtering)
- **Admin Users**: Lọc theo role (Admin, Staff, Donor)
- **Staff Donors**: Lọc theo nhóm máu (A+, A-, B+, B-, AB+, AB-, O+, O-)

### 3. Sắp Xếp (Sorting)
- **Theo tên**: Sắp xếp theo tên đầy đủ
- **Theo email**: Sắp xếp theo địa chỉ email
- **Theo số điện thoại**: Sắp xếp theo số điện thoại
- **Theo role**: Sắp xếp theo vai trò (Admin Users)
- **Theo nhóm máu**: Sắp xếp theo nhóm máu (Staff Donors)
- **Theo ngày sinh**: Sắp xếp theo ngày sinh

### 4. Thứ Tự Sắp Xếp (Sort Order)
- **Tăng dần (↑)**: Sắp xếp từ A-Z, từ nhỏ đến lớn
- **Giảm dần (↓)**: Sắp xếp từ Z-A, từ lớn đến nhỏ

## Các Trang Được Cập Nhật

### 1. Admin Users (`src/pages/admin/Users.jsx`)

#### Tính Năng:
- **Tìm kiếm**: Tên, email, số điện thoại, ID
- **Lọc**: Theo role (Admin, Staff, Donor)
- **Sắp xếp**: Tên, email, số điện thoại, role, ngày sinh
- **Hiển thị**: Bảng users với thông tin chi tiết

#### Giao Diện:
```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search users...] [Filter by Role ▼] [Sort By ▼] [↑↓]       │
└─────────────────────────────────────────────────────────────────┘
```

#### Bảng Dữ Liệu:
| Cột | Mô Tả |
|-----|-------|
| Name | Tên đầy đủ của user |
| Email | Địa chỉ email |
| Phone | Số điện thoại |
| Role | Vai trò (Admin/Staff/Donor) với chip màu |
| Actions | Edit/Delete buttons |

### 2. Admin Staff (`src/pages/admin/Staff.jsx`)

#### Tính Năng:
- **Tìm kiếm**: Tên, email, ID
- **Sắp xếp**: Tên, email, role
- **Hiển thị**: Bảng medical centers

#### Giao Diện:
```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search staff...] [Sort By ▼] [↑↓]                          │
└─────────────────────────────────────────────────────────────────┘
```

#### Bảng Dữ Liệu:
| Cột | Mô Tả |
|-----|-------|
| Name | Tên medical center |
| Email | Địa chỉ email |
| Role | Vai trò với chip màu |
| Actions | Edit/Delete buttons |

### 3. Staff Donors (`src/pages/staff/Donors.jsx`)

#### Tính Năng:
- **Tìm kiếm**: Tên, email, số điện thoại, ID
- **Lọc**: Theo nhóm máu (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Sắp xếp**: Tên, email, số điện thoại, nhóm máu, ngày sinh
- **Hiển thị**: Bảng donors với thông tin chi tiết

#### Giao Diện:
```
┌─────────────────────────────────────────────────────────────────┐
│ [🔍 Search donors...] [Filter by Blood Type ▼] [Sort By ▼] [↑↓] │
└─────────────────────────────────────────────────────────────────┘
```

#### Bảng Dữ Liệu:
| Cột | Mô Tả |
|-----|-------|
| Name | Tên đầy đủ của donor |
| Email | Địa chỉ email |
| Phone | Số điện thoại |
| Blood Type | Nhóm máu với chip màu |
| Date of Birth | Ngày sinh |
| Actions | Edit/Delete buttons |

## Implementation Details

### State Management
```javascript
// Search and filter states
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('all'); // hoặc bloodTypeFilter
const [sortBy, setSortBy] = useState('name');
const [sortOrder, setSortOrder] = useState('asc');
const [filteredUsers, setFilteredUsers] = useState([]);
```

### Filter and Sort Logic
```javascript
const filterAndSortUsers = () => {
  let filtered = [...users];

  // Apply role filter
  if (roleFilter !== 'all') {
    filtered = filtered.filter(u => u.role === roleFilter);
  }

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(user => 
      (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm) ||
      (user.id?.toString() || '').includes(searchTerm)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = (a.fullName || '').toLowerCase();
        bValue = (b.fullName || '').toLowerCase();
        break;
      case 'email':
        aValue = (a.email || '').toLowerCase();
        bValue = (b.email || '').toLowerCase();
        break;
      // ... other cases
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  setFilteredUsers(filtered);
};
```

### Real-time Updates
```javascript
// Filter and sort users when data changes
useEffect(() => {
  filterAndSortUsers();
}, [users, searchTerm, roleFilter, sortBy, sortOrder]);
```

## Responsive Design

### Desktop (md và lớn hơn)
- **Admin Users**: Grid 4-3-3-2 columns
- **Admin Staff**: Grid 5-4-3 columns  
- **Staff Donors**: Grid 4-3-3-2 columns
- Tất cả controls hiển thị trên cùng một hàng

### Mobile (xs và sm)
- Grid layout: 12 columns (stacked)
- Controls xếp chồng theo chiều dọc

## Performance Optimizations

### 1. Efficient Filtering
- Sử dụng `filter()` và `sort()` methods
- Không tạo ra deep copies không cần thiết
- Real-time filtering khi người dùng nhập

### 2. Memoization
- `filterAndSortUsers` chỉ chạy khi dependencies thay đổi
- Tránh re-render không cần thiết

### 3. Optimized Rendering
- Chỉ render filtered data
- Conditional rendering cho empty states

## Accessibility Features

### 1. Keyboard Navigation
- Tất cả controls có thể truy cập bằng keyboard
- Tab order hợp lý

### 2. Screen Reader Support
- Labels rõ ràng cho tất cả inputs
- ARIA labels cho icons
- Descriptive text cho empty states

### 3. Visual Indicators
- Icons cho search và sort
- Màu sắc phân biệt cho các roles và blood types
- Clear visual feedback

## Internationalization (i18n)

### Translation Keys
```javascript
// Search
'admin.search' || 'Search users...'
'admin.searchPlaceholder' || 'Search by name, email, phone, or ID...'

// Filter
'admin.filterByRole' || 'Filter by Role'
'admin.allRoles' || 'All Roles'
'staff.filterByBloodType' || 'Filter by Blood Type'
'staff.allBloodTypes' || 'All Blood Types'

// Sort
'admin.sortBy' || 'Sort By'
'admin.name' || 'Name'
'admin.email' || 'Email'

// Results
'admin.showingResults' || 'Showing'
'admin.of' || 'of'
'admin.users' || 'users'
'admin.noMatchingUsers' || 'No matching users found'
```

## Testing Scenarios

### 1. Search Functionality
- Tìm kiếm theo tên user
- Tìm kiếm theo email
- Tìm kiếm theo số điện thoại
- Tìm kiếm theo ID
- Tìm kiếm với kết quả trống

### 2. Filtering
- Lọc theo role (Admin Users)
- Lọc theo nhóm máu (Staff Donors)
- Kết hợp với search

### 3. Sorting
- Sắp xếp theo tất cả các trường
- Thay đổi thứ tự sắp xếp
- Kết hợp với filter và search

### 4. Responsive Design
- Test trên desktop
- Test trên tablet
- Test trên mobile

### 5. Edge Cases
- Empty data
- Single result
- Large datasets
- Special characters in search

## Benefits

### 1. User Experience
- Tìm kiếm nhanh chóng
- Lọc chính xác
- Sắp xếp linh hoạt
- Giao diện trực quan

### 2. Productivity
- Giảm thời gian tìm kiếm user
- Quản lý hiệu quả hơn
- Dễ dàng theo dõi và phân loại

### 3. Scalability
- Xử lý tốt với nhiều users
- Performance ổn định
- Responsive design

### 4. Maintainability
- Code structure rõ ràng
- Reusable components
- Consistent patterns

## Future Enhancements

### 1. Advanced Search
- Tìm kiếm theo khoảng thời gian (ngày tạo account)
- Tìm kiếm theo trạng thái (active/inactive)
- Tìm kiếm theo địa chỉ

### 2. Saved Filters
- Lưu filter preferences
- Quick filter buttons
- Recent searches

### 3. Export Functionality
- Export filtered results
- Export theo định dạng CSV/Excel
- Bulk operations

### 4. Bulk Actions
- Chọn nhiều users
- Bulk role update
- Bulk delete
- Bulk export

### 5. Advanced Filtering
- Multiple role selection
- Date range filters
- Status filters
- Custom filters

## Code Quality

### 1. Consistency
- Consistent naming conventions
- Reusable filter/sort logic
- Standardized UI patterns

### 2. Performance
- Optimized filtering algorithms
- Efficient state management
- Minimal re-renders

### 3. Maintainability
- Clear separation of concerns
- Well-documented functions
- Modular components

### 4. Accessibility
- WCAG compliant
- Keyboard navigation
- Screen reader support

Bây giờ tất cả các trang quản lý user đều có đầy đủ tính năng tìm kiếm và sắp xếp, giúp cải thiện đáng kể hiệu quả quản lý trong hệ thống hiến máu! 