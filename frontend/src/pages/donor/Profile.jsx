import { useState } from 'react';
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
  Grid
} from '@mui/material';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../../store/slices/authSlice';

const DonorProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bloodType: user?.bloodType || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

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
    dispatch(updateProfileStart());
    try {
      // Simulate API call
      setTimeout(() => {
        dispatch(updateProfileSuccess({ ...user, ...form }));
        setSuccess(t('profile.updateSuccess') || 'Profile updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      dispatch(updateProfileFailure('Update failed'));
      setError(t('profile.updateError') || 'Update failed.');
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
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label={t('register.name')}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label={t('register.email')}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                  disabled
                />
                <TextField
                  fullWidth
                  label={t('register.phone')}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  select
                  label={t('register.bloodType')}
                  name="bloodType"
                  value={form.bloodType}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                  sx={{ mb: 2 }}
                  required
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