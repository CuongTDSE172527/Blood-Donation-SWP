import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  CircularProgress,
} from '@mui/material';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không đúng định dạng. Vui lòng nhập email hợp lệ');
      return;
    }
    
    // Password length validation
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    dispatch(loginStart());
    setError(null);
    setIsLoading(true);
    
    try {
      console.log('Attempting to connect to:', `${import.meta.env.VITE_API_URL}/auth/login`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errMsg = await response.text();
        console.log('Server error:', errMsg);
        dispatch(loginFailure(errMsg));
        setError(errMsg);
        return;
      }
      
      const user = await response.json();
      console.log('Login successful:', user);
      dispatch(loginSuccess({ user }));
      
      // Điều hướng dựa vào role (IN HOA)
      switch ((user.role || '').toUpperCase()) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'STAFF':
          navigate('/staff/dashboard');
          break;
        case 'DONOR':
          navigate('/donor/dashboard');
          break;
        default:
          navigate('/user/dashboard');
      }
    } catch (error) {
      console.log('Caught error:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      
      // Handle network errors when backend is not running
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      } else if (error.name === 'TypeError') {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      } else {
        setError(`Lỗi kết nối server: ${error.message}`);
      }
      dispatch(loginFailure(error.message));
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
            {t('login.title')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('login.email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('login.password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
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
                  {t('login.loggingIn') || 'Đang đăng nhập...'}
                </Box>
              ) : (
                t('login.loginButton')
              )}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="/register" variant="body2">
                {t('login.noAccount')} {t('login.registerNow')}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 