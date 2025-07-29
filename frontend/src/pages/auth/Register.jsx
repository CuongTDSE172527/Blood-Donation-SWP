import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Grid,
  CircularProgress,
} from '@mui/material';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    dob: '',
    phone: '',
    address: '',
    gender: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.bloodType || !formData.dob || !formData.phone || !formData.address || !formData.gender) {
      setError('Vui lòng điền đầy đủ thông tin');
      setIsLoading(false);
      return;
    }
    
    // Name validation
    if (formData.fullName.trim().length < 2) {
      setError('Họ tên phải có ít nhất 2 ký tự');
      setIsLoading(false);
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không đúng định dạng. Vui lòng nhập email hợp lệ');
      setIsLoading(false);
      return;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setIsLoading(false);
      return;
    }
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số');
      setIsLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      setIsLoading(false);
      return;
    }
    
    // Phone validation
    if (!/^\d{9,11}$/.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ');
      setIsLoading(false);
      return;
    }
    
    // Dob validation
    if (!formData.dob) {
      setError('Vui lòng nhập ngày sinh');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Attempting to register...');
      
      await authService.register({
        fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          bloodType: formData.bloodType,
          dob: formData.dob,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender,
      });
      
      console.log('Registration successful');
      // Đăng ký thành công
      navigate('/login');
    } catch (err) {
      console.log('Caught error:', err);
      console.log('Error message:', err.message || err);
      
      // Handle network errors when backend is not running
      if (err.message && err.message.includes('Network Error')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      } else {
        setError(err.message || 'Lỗi kết nối server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <LanguageSwitcher />
        </Box>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {t('register.title')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('register.name')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('register.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('register.password')}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('register.confirmPassword')}
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  label={t('register.bloodType')}
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  disabled={isLoading}
                  SelectProps={{
                    native: true,
                  }}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label={t('register.dateOfBirth')} name="dob" type="date" value={formData.dob} onChange={handleChange} disabled={isLoading} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label={t('register.phone')} name="phone" value={formData.phone} onChange={handleChange} disabled={isLoading} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label={t('register.address')} name="address" value={formData.address} onChange={handleChange} disabled={isLoading} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth select label={t('register.gender')} name="gender" value={formData.gender} onChange={handleChange} disabled={isLoading} SelectProps={{ native: true }}>
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </TextField>
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" sx={{ mt: 1, mb: 1, textAlign: 'center' }}>{error}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t('register.registering') || 'Đang đăng ký...'}
                </Box>
              ) : (
                t('register.registerButton')
              )}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                {t('register.alreadyAccount')} {t('register.loginNow')}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 