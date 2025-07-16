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
import { clearError } from '../../store/slices/authSlice';
import axios from 'axios';
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
        const res = await axios.get('/api/donor/profile');
        const data = res.data;
        setForm({
          name: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          bloodType: data.bloodType || '',
          dob: data.dob || '',
          gender: data.gender || '',
        });
      } catch (err) {
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
    try {
      const payload = {
        fullName: form.name,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
      };
      await axios.put('/api/donor/profile', payload);
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
                  label={t('register.bloodType')}
                  name="bloodType"
                  value={form.bloodType}
                  sx={{ mb: 2 }}
                  required
                  disabled
                />
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
                  <option value="Male">{t('common.male') || 'Male'}</option>
                  <option value="Female">{t('common.female') || 'Female'}</option>
                  <option value="Other">{t('common.other') || 'Other'}</option>
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