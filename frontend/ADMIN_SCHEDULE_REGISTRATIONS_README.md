# Admin Schedule Management - View Registrations Feature

## Tổng quan
Tài liệu này mô tả việc thêm tính năng xem người đăng ký hiến máu vào Admin Schedule Management, tương tự như Staff Schedule Management.

## Tính năng mới

### 1. Cột Registrations trong bảng Schedule
- **Vị trí**: Cột thứ 4 trong bảng Schedule Management
- **Hiển thị**: Icon People với Badge hiển thị số lượng đăng ký
- **Chức năng**: Click để xem danh sách người đăng ký

### 2. Dialog hiển thị danh sách đăng ký
- **Kích hoạt**: Click vào icon People trong cột Registrations
- **Nội dung**: Hiển thị danh sách người đăng ký cho schedule đó
- **Thông tin hiển thị**:
  - Tên người đăng ký
  - Email
  - Số điện thoại
  - Nhóm máu
  - Trạng thái đăng ký (Pending, Confirmed, Cancelled)
  - Ngày đăng ký

## Các thay đổi kỹ thuật

### 1. Frontend (src/pages/admin/Schedule.jsx)

#### Thêm imports:
```javascript
import {
  People,
  Badge,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
```

#### Thêm state cho registration dialog:
```javascript
// Registration dialog states
const [openRegistrationsDialog, setOpenRegistrationsDialog] = useState(false);
const [selectedSchedule, setSelectedSchedule] = useState(null);
const [registrations, setRegistrations] = useState([]);
const [loadingRegistrations, setLoadingRegistrations] = useState(false);
```

#### Thêm handlers:
```javascript
// Registration dialog handlers
const handleViewRegistrations = async (schedule) => {
  if (!schedule.id) {
    console.error('Schedule ID is required');
    return;
  }

  try {
    setLoadingRegistrations(true);
    setSelectedSchedule(schedule);
    const data = await adminService.getDonorsBySchedule(schedule.id);
    setRegistrations(data);
    setOpenRegistrationsDialog(true);
  } catch (err) {
    console.error('Error loading registrations:', err);
    setSnackbar({ 
      open: true, 
      message: err.message || 'Error loading registrations', 
      severity: 'error' 
    });
  } finally {
    setLoadingRegistrations(false);
  }
};

const handleCloseRegistrationsDialog = () => {
  setOpenRegistrationsDialog(false);
  setSelectedSchedule(null);
  setRegistrations([]);
};

const getRegistrationStatusColor = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'PENDING':
    default:
      return 'warning';
  }
};
```

#### Cập nhật Table Header:
```javascript
<TableHead>
  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
    <TableCell sx={{ fontWeight: 600 }}>{t('admin.date') || 'Date'}</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>{t('admin.time') || 'Time'}</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>{t('admin.location') || 'Location'}</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>{t('admin.registrations') || 'Registrations'}</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>{t('admin.actions') || 'Actions'}</TableCell>
  </TableRow>
</TableHead>
```

#### Thêm cột Registrations trong Table Body:
```javascript
<TableCell>
  <Tooltip title="View registrations">
    <IconButton
      color="primary"
      onClick={() => handleViewRegistrations(schedule)}
      size="small"
    >
      <Badge badgeContent={schedule.registrationCount || 0} color="secondary">
        <People />
      </Badge>
    </IconButton>
  </Tooltip>
</TableCell>
```

#### Thêm Registrations Dialog:
```javascript
{/* Registrations Dialog */}
<Dialog open={openRegistrationsDialog} onClose={handleCloseRegistrationsDialog} maxWidth="md" fullWidth>
  <DialogTitle>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <People sx={{ color: '#d32f2f' }} />
      <Typography variant="h6">
        Registrations for {selectedSchedule && new Date(selectedSchedule.date).toLocaleDateString()} at {selectedSchedule?.time}
      </Typography>
    </Box>
  </DialogTitle>
  <DialogContent>
    {loadingRegistrations ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    ) : registrations.length === 0 ? (
      <Alert severity="info" sx={{ mt: 2 }}>
        No registrations found for this schedule.
      </Alert>
    ) : (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {registrations.map((registration, index) => (
          <Box key={registration.id || index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#d32f2f' }}>
                  <People />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      {registration.user?.fullName || registration.donorName || 'Unknown'}
                    </Typography>
                    <Chip 
                      label={registration.status || 'Pending'} 
                      color={getRegistrationStatusColor(registration.status)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email: {registration.user?.email || registration.email || 'No email'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: {registration.user?.phone || registration.phone || 'No phone'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Blood Type: {registration.user?.bloodType || registration.bloodType || 'Unknown'}
                    </Typography>
                    {registration.registrationDate && (
                      <Typography variant="body2" color="text.secondary">
                        Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < registrations.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseRegistrationsDialog}>
      {t('common.close') || 'Close'}
    </Button>
  </DialogActions>
</Dialog>
```

### 2. Frontend Service (src/services/adminService.js)

#### Thêm method getDonorsBySchedule:
```javascript
// === Donor Management by Schedule ===
getDonorsBySchedule: async (scheduleId) => {
  try {
    const response = await api.get(`/admin/donors/by-schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},
```

### 3. Backend API (AdminController.java)

#### API đã có sẵn:
```java
@GetMapping("/donors/by-schedule/{scheduleId}")
public ResponseEntity<?> getDonorsBySchedule(@PathVariable Long scheduleId) {
    Optional<DonationSchedule> scheduleOpt = scheduleRepo.findById(scheduleId);
    if (scheduleOpt.isEmpty()) {
        return ResponseEntity.badRequest().body("Schedule not found");
    }

    Long locationId = scheduleOpt.get().getLocation().getId();
    List<DonationRegistration> registrations = registrationRepo.findByLocationId(locationId);

    // Tạo danh sách kết quả với thông tin đầy đủ
    List<Map<String, Object>> result = registrations.stream()
            .map(registration -> {
                Map<String, Object> donorInfo = new HashMap<>();
                User user = registration.getUser();
                
                donorInfo.put("id", registration.getId());
                donorInfo.put("user", user);
                donorInfo.put("status", registration.getStatus());
                donorInfo.put("registrationDate", registration.getRegisteredAt());
                donorInfo.put("donorName", user.getFullName());
                donorInfo.put("email", user.getEmail());
                donorInfo.put("phone", user.getPhone());
                donorInfo.put("bloodType", user.getBloodType());
                
                return donorInfo;
            })
            .toList();

    return ResponseEntity.ok(result);
}
```

### 4. Translation Keys

#### English (en.json):
```json
"registrations": "Registrations"
```

#### Vietnamese (vi.json):
```json
"registrations": "Đăng ký"
```

## API Endpoints

### Backend API
- **GET** `/api/admin/donors/by-schedule/{scheduleId}` - Lấy danh sách người đăng ký theo schedule

### Frontend Service
- `adminService.getDonorsBySchedule(scheduleId)` - Gọi API lấy danh sách đăng ký

## Luồng hoạt động

### 1. Hiển thị danh sách Schedule
1. Admin vào Schedule Management
2. Hệ thống load danh sách schedules với `registrationCount`
3. Hiển thị bảng với cột Registrations có badge số lượng

### 2. Xem danh sách đăng ký
1. Admin click vào icon People trong cột Registrations
2. Frontend gọi `adminService.getDonorsBySchedule(scheduleId)`
3. Backend trả về danh sách registrations với thông tin đầy đủ
4. Frontend hiển thị dialog với danh sách người đăng ký

### 3. Thông tin hiển thị trong dialog
- **Tên người đăng ký**: `registration.user.fullName`
- **Email**: `registration.user.email`
- **Số điện thoại**: `registration.user.phone`
- **Nhóm máu**: `registration.user.bloodType`
- **Trạng thái**: `registration.status` (PENDING, CONFIRMED, CANCELLED)
- **Ngày đăng ký**: `registration.registrationDate`

## Testing

### 1. Test hiển thị cột Registrations
1. Vào Admin Dashboard → Schedule Management
2. **Expected**: Bảng có cột "Registrations" với icon People và badge số lượng

### 2. Test xem danh sách đăng ký
1. Click vào icon People trong cột Registrations
2. **Expected**: Dialog mở ra hiển thị danh sách người đăng ký

### 3. Test trạng thái đăng ký
1. Kiểm tra các chip trạng thái có màu sắc đúng:
   - **PENDING**: Màu vàng (warning)
   - **CONFIRMED**: Màu xanh (success)
   - **CANCELLED**: Màu đỏ (error)

### 4. Test không có đăng ký
1. Tạo schedule mới chưa có ai đăng ký
2. Click vào icon People
3. **Expected**: Hiển thị thông báo "No registrations found for this schedule"

## Lợi ích

### 1. Quản lý hiệu quả
- Admin có thể xem nhanh số lượng đăng ký cho mỗi schedule
- Dễ dàng theo dõi và quản lý người đăng ký

### 2. Thông tin chi tiết
- Hiển thị đầy đủ thông tin người đăng ký
- Trạng thái đăng ký rõ ràng với màu sắc

### 3. UX tốt
- Giao diện nhất quán với Staff Schedule Management
- Loading state và error handling đầy đủ

## Kết luận

Tính năng xem người đăng ký hiến máu trong Admin Schedule Management đã được hoàn thành với:
- Cột Registrations hiển thị số lượng đăng ký
- Dialog chi tiết với thông tin đầy đủ
- API backend đã có sẵn và hoạt động tốt
- Translation keys đầy đủ cho đa ngôn ngữ
- UX nhất quán với Staff Schedule Management

Admin giờ đây có thể dễ dàng theo dõi và quản lý người đăng ký hiến máu cho từng schedule một cách hiệu quả. 