/**
 * BloodCompatibilityInfo Component - Hiển thị thông tin tính tương thích máu
 * 
 * LUỒNG CHẠY CỦA BLOOD COMPATIBILITY:
 * 1. User click vào nút "Kiểm tra tính tương thích" trong request
 * 2. Backend tính toán compatibility matrix dựa trên y học
 * 3. Component nhận compatibilityData và hiển thị thông tin
 * 4. User có thể chọn nhóm máu thay thế nếu cần
 * 5. Confirm với nhóm máu thay thế được chọn
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * BloodCompatibilityInfo Component
 * @param {Object} compatibilityData - Dữ liệu tính tương thích từ backend
 * @param {string} compatibilityData.requestedBloodType - Nhóm máu yêu cầu
 * @param {boolean} compatibilityData.isAvailable - Có sẵn hay không
 * @param {number} compatibilityData.availableQuantity - Số lượng có sẵn
 * @param {string[]} compatibilityData.allCompatibleTypes - Tất cả nhóm máu tương thích
 * @param {Object} compatibilityData.availableCompatibleTypes - Nhóm máu tương thích có sẵn
 * @param {string} compatibilityData.message - Thông báo từ backend
 * @param {boolean} showDetails - Có hiển thị chi tiết hay không
 * @param {Function} onConfirmWithAlternative - Callback khi chọn nhóm máu thay thế
 */
const BloodCompatibilityInfo = ({ compatibilityData, showDetails = true, onConfirmWithAlternative }) => {
  const { t } = useTranslation(); // Hook cho internationalization
  const [showAlternativeDialog, setShowAlternativeDialog] = useState(false); // State cho dialog chọn nhóm máu thay thế
  const [selectedAlternative, setSelectedAlternative] = useState(''); // State cho nhóm máu thay thế được chọn

  // Nếu không có dữ liệu compatibility → không render gì
  if (!compatibilityData) {
    return null;
  }

  // Destructure dữ liệu từ compatibilityData
  const {
    requestedBloodType, // Nhóm máu yêu cầu (VD: A+)
    isAvailable, // Boolean: có sẵn hay không
    availableQuantity, // Số lượng có sẵn
    allCompatibleTypes, // Array: tất cả nhóm máu tương thích theo y học
    availableCompatibleTypes, // Object: nhóm máu tương thích có sẵn trong kho
    message // Thông báo từ backend
  } = compatibilityData;

  return (
    <Box sx={{ mt: 2 }}>
      {/* === MAIN STATUS ALERT - Hiển thị trạng thái chính === */}
      <Alert 
        severity={isAvailable ? 'success' : 'warning'} // Màu xanh nếu có sẵn, vàng nếu không có
        sx={{ mb: 2 }}
      >
        <Typography variant="body1" fontWeight="medium">
          {message} {/* Thông báo từ backend (VD: "Nhóm máu A+ có sẵn" hoặc "Không đủ A+, có thể dùng O+") */}
        </Typography>
      </Alert>

      {/* === DETAILED INFORMATION CARD - Hiển thị chi tiết nếu showDetails = true === */}
      {showDetails && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              {t('bloodCompatibility.details') || 'Chi tiết tính tương thích'}
            </Typography>
            
            <Grid container spacing={2}>
              {/* === REQUESTED BLOOD TYPE SECTION === */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('bloodCompatibility.requestedType') || 'Nhóm máu yêu cầu:'}
                </Typography>
                <Chip 
                  label={requestedBloodType} // Hiển thị nhóm máu yêu cầu (VD: A+)
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                {/* Hiển thị số lượng có sẵn nếu có */}
                {isAvailable && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {t('bloodCompatibility.available') || 'Có sẵn'}: {availableQuantity} {t('common.units') || 'đơn vị'}
                  </Typography>
                )}
              </Grid>

              {/* === ALL COMPATIBLE TYPES SECTION === */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('bloodCompatibility.allCompatible') || 'Tất cả nhóm máu tương thích:'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {/* Hiển thị tất cả nhóm máu tương thích theo nguyên tắc y học */}
                  {allCompatibleTypes?.map((type) => (
                    <Chip 
                      key={type}
                      label={type} // VD: O-, O+, A-, A+ cho nhóm máu A+
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* === AVAILABLE COMPATIBLE TYPES SECTION === */}
            {/* Chỉ hiển thị nếu có nhóm máu tương thích có sẵn trong kho */}
            {availableCompatibleTypes && Object.keys(availableCompatibleTypes).length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('bloodCompatibility.availableCompatible') || 'Nhóm máu tương thích có sẵn trong kho:'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {/* Hiển thị nhóm máu tương thích có sẵn với số lượng */}
                  {Object.entries(availableCompatibleTypes).map(([type, quantity]) => (
                    <Chip 
                      key={type}
                      label={`${type} (${quantity})`} // VD: O+ (15), A- (8)
                      color="success"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
                
                {/* === ALTERNATIVE SELECTION BUTTON === */}
                {/* Chỉ hiển thị nếu có callback onConfirmWithAlternative */}
                {onConfirmWithAlternative && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => setShowAlternativeDialog(true)} // Mở dialog chọn nhóm máu thay thế
                      fullWidth
                    >
                      {t('bloodCompatibility.selectAlternative') || 'Chọn nhóm máu thay thế'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* === ALTERNATIVE BLOOD TYPE SELECTION DIALOG === */}
      <Dialog open={showAlternativeDialog} onClose={() => setShowAlternativeDialog(false)}>
        <DialogTitle>
          {t('bloodCompatibility.selectAlternativeTitle') || 'Chọn nhóm máu thay thế'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('bloodCompatibility.selectAlternativeDesc') || 'Chọn nhóm máu tương thích để sử dụng thay thế:'}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>{t('bloodCompatibility.alternativeBloodType') || 'Nhóm máu thay thế'}</InputLabel>
            <Select
              value={selectedAlternative}
              onChange={(e) => setSelectedAlternative(e.target.value)} // Cập nhật nhóm máu được chọn
              label={t('bloodCompatibility.alternativeBloodType') || 'Nhóm máu thay thế'}
            >
              {/* Hiển thị danh sách nhóm máu tương thích có sẵn */}
              {availableCompatibleTypes && Object.entries(availableCompatibleTypes).map(([type, quantity]) => (
                <MenuItem key={type} value={type}>
                  {type} ({quantity} {t('common.units') || 'đơn vị'}) {/* VD: O+ (15 đơn vị) */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {/* Cancel button */}
          <Button onClick={() => setShowAlternativeDialog(false)}>
            {t('common.cancel') || 'Hủy'}
          </Button>
          {/* Confirm button - chỉ enable khi đã chọn nhóm máu */}
          <Button 
            onClick={() => {
              if (selectedAlternative && onConfirmWithAlternative) {
                onConfirmWithAlternative(selectedAlternative); // Gọi callback với nhóm máu được chọn
                setShowAlternativeDialog(false); // Đóng dialog
              }
            }}
            variant="contained"
            disabled={!selectedAlternative} // Disable nếu chưa chọn nhóm máu
          >
            {t('bloodCompatibility.confirmWithAlternative') || 'Xác nhận với nhóm máu thay thế'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodCompatibilityInfo; 