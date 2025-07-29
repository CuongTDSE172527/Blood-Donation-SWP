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
    // Only fetch profile if user is logged in
    if (!user?.email) {
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Starting to fetch profile for user:', user.email);
        // Use the logged-in user's email
        const data = await donorService.getProfile(user.email);
        console.log('Profile data received:', data);
        
        // Check if data exists and has required fields
        if (!data) {
          throw new Error('No profile data received');
        }
        
        setForm({
          name: data.fullName || '',
          phone: data.phone || '',
          bloodType: data.bloodType || '',
          dob: data.dob ? (typeof data.dob === 'string' ? data.dob : data.dob.toString()) : '',
          gender: data.gender || '',
          address: data.address || '',
          role: data.role || '',
        });
        console.log('Form state updated with data:', data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        const errorMessage = err.message || t('common.error') || 'Error loading profile';
        setError(errorMessage);
        // Clear error message after 5 seconds
        setTimeout(() => {
          setError('');
        }, 5000);
        
        // Set default values if profile loading fails
        setForm({
          name: '',
          phone: '',
          bloodType: '',
          dob: '',
          gender: '',
          address: '',
          role: 'DONOR',
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Clear any existing errors when component mounts
    dispatch(clearError());
    fetchProfile();
  }, [user, dispatch]); // Add user to dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user?.email) {
      setError('User not logged in');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!form.name || !form.name.trim()) {
      setError('Tên không được để trống');
      setTimeout(() => setError(''), 5000);
      setLoading(false);
      return;
    }
    
    if (form.phone && !/^\d{9,11}$/.test(form.phone)) {
      setError('Số điện thoại không hợp lệ');
      setTimeout(() => setError(''), 5000);
      setLoading(false);
      return;
    }
    
    if (!form.bloodType || !form.bloodType.trim()) {
      setError('Nhóm máu không được để trống');
      setTimeout(() => setError(''), 5000);
      setLoading(false);
      return;
    }
    
    if (!form.gender || !form.gender.trim()) {
      setError('Giới tính không được để trống');
      setTimeout(() => setError(''), 5000);
      setLoading(false);
      return;
    }
    
    if (!form.dob || !form.dob.trim()) {
      setError('Ngày sinh không được để trống');
      setTimeout(() => setError(''), 5000);
      setLoading(false);
      return;
    }
    
    if (!form.address || !form.address.trim()) {
      setError('Địa chỉ không được để trống');
      setTimeout(() => setError(''), 5000);
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        email: user.email, // Use logged-in user's email
        fullName: form.name.trim(),
        phone: form.phone || null,
        dob: form.dob || null,
        gender: form.gender || null,
        address: form.address || null,
        bloodType: form.bloodType || null,
      };
      console.log('Submitting profile update with payload:', payload);
      await donorService.updateProfile(payload);
      setSuccess(t('profile.updateSuccess') || 'Profile updated successfully!');
      // Refresh profile data after successful update
      const updatedData = await donorService.getProfile(user.email);
      if (updatedData) {
        setForm({
          name: updatedData.fullName || '',
          phone: updatedData.phone || '',
          bloodType: updatedData.bloodType || '',
          dob: updatedData.dob ? (typeof updatedData.dob === 'string' ? updatedData.dob : updatedData.dob.toString()) : '',
          gender: updatedData.gender || '',
          address: updatedData.address || '',
          role: updatedData.role || '',
        });
      }
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.message || t('profile.updateError') || 'Update failed.';
      setError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user?.email) {
      setError('User not logged in');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    if (!passwordForm.currentPassword || !passwordForm.currentPassword.trim()) {
      setError('Mật khẩu hiện tại không được để trống');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    if (!passwordForm.newPassword || !passwordForm.newPassword.trim()) {
      setError('Mật khẩu mới không được để trống');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    if (!passwordForm.confirmPassword || !passwordForm.confirmPassword.trim()) {
      setError('Xác nhận mật khẩu không được để trống');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t('profile.passwordMismatch') || 'New passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError(t('profile.passwordTooShort') || 'Password must be at least 6 characters');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        email: user.email, // Use logged-in user's email
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
      };
      console.log('Updating password with payload:', payload);
      await donorService.updatePassword(payload);
      setSuccess(t('profile.passwordUpdateSuccess') || 'Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Password update error:', err);
      const errorMessage = err.message || t('profile.passwordUpdateError') || 'Password update failed.';
      setError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show error if user not logged in
  if (!user?.email) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="info">
            Please login to view your profile.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" align="center" gutterBottom>
                {t('donor.editProfile') || 'Edit Profile'}
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label={t('register.name') || 'Full Name'}
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  placeholder="Nhập họ và tên"
                />
                <Tooltip title="Email không thể thay đổi">
                  <TextField
                    fullWidth
                    label={t('register.email') || 'Email'}
                    name="email"
                    value={user.email || ''}
                    sx={{ mb: 2 }}
                    required
                    disabled
                    placeholder="Email của bạn"
                  />
                </Tooltip>
                <TextField
                  fullWidth
                  label={t('register.phone') || 'Phone'}
                  name="phone"
                  value={form.phone || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  placeholder="Số điện thoại"
                />
                <TextField
                  fullWidth
                  label={t('register.bloodType') || 'Blood Type'}
                  name="bloodType"
                  value={form.bloodType || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="">{t('register.bloodTypeSelect') || 'Select Blood Type'}</option>
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
                  value={form.dob || ''}
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
                  value={form.gender || ''}
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
                  value={form.address || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  placeholder="Địa chỉ của bạn"
                />
                {/* Remove Role field - Donors cannot change their role */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                  {loading ? (t('common.saving') || 'Saving...') : (t('donor.editProfile') || 'Update Profile')}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Change Password */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" align="center" gutterBottom>
                {t('profile.changePassword') || 'Change Password'}
              </Typography>
              <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label={t('profile.currentPassword') || 'Current Password'}
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword || ''}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label={t('profile.newPassword') || 'New Password'}
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword || ''}
                  onChange={handlePasswordChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label={t('profile.confirmPassword') || 'Confirm Password'}
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword || ''}
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
                  startIcon={passwordLoading ? <CircularProgress size={16} /> : null}
                >
                  {passwordLoading ? (t('common.saving') || 'Saving...') : (t('profile.changePassword') || 'Change Password')}
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