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

const BloodCompatibilityInfo = ({ compatibilityData, showDetails = true, onConfirmWithAlternative }) => {
  const { t } = useTranslation();
  const [showAlternativeDialog, setShowAlternativeDialog] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState('');

  if (!compatibilityData) {
    return null;
  }

  const {
    requestedBloodType,
    isAvailable,
    availableQuantity,
    allCompatibleTypes,
    availableCompatibleTypes,
    message
  } = compatibilityData;

  return (
    <Box sx={{ mt: 2 }}>
      {/* Main Status Alert */}
      <Alert 
        severity={isAvailable ? 'success' : 'warning'} 
        sx={{ mb: 2 }}
      >
        <Typography variant="body1" fontWeight="medium">
          {message}
        </Typography>
      </Alert>

      {showDetails && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              {t('bloodCompatibility.details') || 'Chi tiết tính tương thích'}
            </Typography>
            
            <Grid container spacing={2}>
              {/* Requested Blood Type */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('bloodCompatibility.requestedType') || 'Nhóm máu yêu cầu:'}
                </Typography>
                <Chip 
                  label={requestedBloodType} 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                {isAvailable && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {t('bloodCompatibility.available') || 'Có sẵn'}: {availableQuantity} {t('common.units') || 'đơn vị'}
                  </Typography>
                )}
              </Grid>

              {/* All Compatible Types */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('bloodCompatibility.allCompatible') || 'Tất cả nhóm máu tương thích:'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {allCompatibleTypes?.map((type) => (
                    <Chip 
                      key={type}
                      label={type} 
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Available Compatible Types */}
            {availableCompatibleTypes && Object.keys(availableCompatibleTypes).length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('bloodCompatibility.availableCompatible') || 'Nhóm máu tương thích có sẵn trong kho:'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {Object.entries(availableCompatibleTypes).map(([type, quantity]) => (
                    <Chip 
                      key={type}
                      label={`${type} (${quantity})`} 
                      color="success"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
                
                {/* Alternative Blood Type Selection */}
                {onConfirmWithAlternative && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => setShowAlternativeDialog(true)}
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

      {/* Alternative Blood Type Selection Dialog */}
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
              onChange={(e) => setSelectedAlternative(e.target.value)}
              label={t('bloodCompatibility.alternativeBloodType') || 'Nhóm máu thay thế'}
            >
              {availableCompatibleTypes && Object.entries(availableCompatibleTypes).map(([type, quantity]) => (
                <MenuItem key={type} value={type}>
                  {type} ({quantity} {t('common.units') || 'đơn vị'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlternativeDialog(false)}>
            {t('common.cancel') || 'Hủy'}
          </Button>
          <Button 
            onClick={() => {
              if (selectedAlternative && onConfirmWithAlternative) {
                onConfirmWithAlternative(selectedAlternative);
                setShowAlternativeDialog(false);
              }
            }}
            variant="contained"
            disabled={!selectedAlternative}
          >
            {t('bloodCompatibility.confirmWithAlternative') || 'Xác nhận với nhóm máu thay thế'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodCompatibilityInfo; 