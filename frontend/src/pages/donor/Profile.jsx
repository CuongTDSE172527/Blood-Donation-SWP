import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  Divider,
  Grid,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { clearError } from '../../store/slices/authSlice';
import { donorService } from '../../services/donorService';
import { useEffect, useState } from 'react';

const DonorProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    dob: '',
    gender: '',
    address: '',
    role: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await donorService.getProfile();
        console.log('Profile data:', data); // Debug log
        setForm({
          name: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          bloodType: data.bloodType || '',
          dob: data.dob ? data.dob.split('T')[0] : '', // Format date to YYYY-MM-DD
          gender: data.gender || '',
          address: data.address || '',
          role: data.role || '',
        });
      } catch (err) {
        console.error('Error fetching profile:', err); // Debug log
        setError(t('common.error') || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [t]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!form.name.trim()) {
      setError('Tên không được để trống');
      setLoading(false);
      return;
    }
    
    if (form.phone && !/^\d{9,11}$/.test(form.phone)) {
      setError('Số điện thoại không hợp lệ');
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        fullName: form.name,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
        bloodType: form.bloodType,
      };
      await donorService.updateProfile(payload);
      setSuccess(t('profile.updateSuccess') || 'Profile updated successfully!');
    } catch (err) {
      setError(t('profile.updateError') || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t('profile.passwordMismatch') || 'New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError(t('profile.passwordTooShort') || 'Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      setTimeout(() => {
        setSuccess(t('profile.passwordUpdateSuccess') || 'Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordLoading(false);
      }, 1000);
    } catch (err) {
      setError(t('profile.passwordUpdateError') || 'Password update failed.');
      setPasswordLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" align="center" gutterBottom>
                {t('donor.editProfile')}
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress />
                </Box>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label={t('register.name')}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  placeholder="Nhập họ và tên"
                />
                <Tooltip title="Email không thể thay đổi">
                  <TextField
                    fullWidth
                    label={t('register.email')}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    required
                    disabled
                    placeholder="Email của bạn"
                  />
                </Tooltip>
                <TextField
                  fullWidth
                  label={t('register.phone')}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  placeholder="Số điện thoại"
                />
                <TextField
                  fullWidth
                  label={t('register.bloodType')}
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="">{t('register.bloodTypeSelect')}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </TextField>
                {/* Date of Birth */}
                <TextField
                  fullWidth
                  label={t('donor.dob') || 'Date of Birth'}
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                {/* Gender */}
                <TextField
                  fullWidth
                  select
                  label={t('donor.gender') || 'Gender'}
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  SelectProps={{ native: true }}
                >
                  <option value="">{t('common.select') || 'Select'}</option>
                  <option value="MALE">{t('common.male') || 'Male'}</option>
                  <option value="FEMALE">{t('common.female') || 'Female'}</option>
                  <option value="OTHER">{t('common.other') || 'Other'}</option>
                </TextField>
                <TextField
                  fullWidth
                  label={t('register.address') || 'Address'}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  placeholder="Địa chỉ của bạn"
                />
                <Tooltip title="Vai trò không thể thay đổi">
                  <TextField
                    fullWidth
                    label={t('common.role') || 'Role'}
                    name="role"
                    value={form.role}
                    sx={{ mb: 2 }}
                    disabled
                  />
                </Tooltip>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? t('common.saving') || 'Saving...' : t('donor.editProfile')}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Change Password */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" align="center" gutterBottom>
                {t('profile.changePassword')}
              </Typography>
              <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label={t('profile.currentPassword')}
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label={t('profile.newPassword')}
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label={t('profile.confirmPassword')}
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? t('common.saving') || 'Saving...' : t('profile.changePassword')}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DonorProfile; 