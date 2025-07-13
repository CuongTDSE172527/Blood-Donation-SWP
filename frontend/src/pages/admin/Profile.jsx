import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../../store/slices/authSlice';

const AdminProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {t('admin.editProfile') || 'Edit Profile'}
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
              label={t('admin.password') || 'Password'}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              helperText="Leave blank to keep current password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? t('common.saving') || 'Saving...' : t('admin.save') || 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminProfile; 