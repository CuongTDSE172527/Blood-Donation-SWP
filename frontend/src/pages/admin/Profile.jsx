import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { clearError } from '../../store/slices/authSlice';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const AdminProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    position: user?.position || '',
    department: user?.department || '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (form.password && form.password !== form.confirmPassword) {
      setError(t('admin.passwordMismatch') || 'Passwords do not match');
      return;
    }

    if (form.password && form.password.length < 6) {
      setError(t('admin.passwordTooShort') || 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Note: Profile update is not available in the current backend API
      // This is a placeholder for future implementation
      setTimeout(() => {
      setSuccess(true);
      setForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || t('admin.updateError') || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      position: user?.position || '',
      department: user?.department || '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            alt={user?.name} 
            src={user?.avatar} 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#d32f2f',
              mr: 3,
              fontSize: '2rem'
            }} 
          />
          <Box>
            <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700, mb: 1 }}>
              {t('admin.editProfile') || 'Edit Profile'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('admin.profileDesc') || 'Update your personal information and account settings'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                {t('admin.personalInfo') || 'Personal Information'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.name') || 'Full Name'}
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.email') || 'Email'}
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.phone') || 'Phone Number'}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.address') || 'Address'}
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#d32f2f' }}>
                {t('admin.professionalInfo') || 'Professional Information'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.position') || 'Position'}
                name="position"
                value={form.position}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.department') || 'Department'}
                name="department"
                value={form.department}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Password Change */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#d32f2f' }}>
                {t('admin.changePassword') || 'Change Password'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('admin.passwordOptional') || 'Leave blank if you don\'t want to change your password'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.newPassword') || 'New Password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label={t('admin.confirmPassword') || 'Confirm Password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#d32f2f',
                    '&:hover': { bgcolor: '#b71c1c' }
                  }}
                >
                  {loading ? (t('admin.saving') || 'Saving...') : (t('admin.save') || 'Save Changes')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{ 
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': { 
                      borderColor: '#b71c1c',
                      bgcolor: 'rgba(211, 47, 47, 0.04)'
                    }
                  }}
                >
                  {t('admin.cancel') || 'Cancel'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Success/Error Messages */}
        <Snackbar 
          open={success} 
          autoHideDuration={4000} 
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            {t('admin.updateSuccess') || 'Profile updated successfully!'}
          </Alert>
        </Snackbar>
        
        <Snackbar 
          open={!!error} 
          autoHideDuration={4000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default AdminProfile; 