/**
 * Login Component - Trang đăng nhập
 * 
 * LUỒNG CHẠY CỦA LOGIN:
 * 1. User nhập email/password → validation → submit form
 * 2. Component gọi authService.login() → API call
 * 3. Nếu thành công → dispatch loginSuccess → redirect theo role
 * 4. Nếu thất bại → hiển thị error message
 * 5. Redux store cập nhật → ProtectedRoute có thể truy cập
 */

import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
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
  CircularProgress,
} from '@mui/material';

const Login = () => {
  const { t } = useTranslation(); // Hook cho internationalization
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // State cho error message
  const [isLoading, setIsLoading] = useState(false); // State cho loading
  const navigate = useNavigate(); // Hook cho navigation
  const dispatch = useDispatch(); // Hook cho Redux dispatch

  /**
   * Handle input change - Cập nhật form data khi user nhập
   * @param {Event} e - Event object từ input
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Cập nhật field tương ứng
    });
  };

  /**
   * Handle form submit - Xử lý khi user submit form đăng nhập
   * LUỒNG XỬ LÝ:
   * 1. Prevent default form submission
   * 2. Validation form data
   * 3. Dispatch loginStart action
   * 4. Gọi authService.login()
   * 5. Xử lý response và redirect theo role
   * 6. Xử lý error nếu có
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form submit mặc định
    
    // === BƯỚC 1: VALIDATION ===
    
    // Kiểm tra required fields
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    // Kiểm tra format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không đúng định dạng. Vui lòng nhập email hợp lệ');
      return;
    }
    
    // Kiểm tra độ dài password
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    // === BƯỚC 2: START LOGIN PROCESS ===
    dispatch(loginStart()); // Cập nhật Redux state: loading = true
    setError(null); // Xóa error cũ
    setIsLoading(true); // Bật loading UI
    
    try {
      console.log('Attempting to login...');
      
      // === BƯỚC 3: CALL API ===
      const user = await authService.login({
          email: formData.email,
          password: formData.password,
      });
      
      console.log('Login successful:', user);
      
      // === BƯỚC 4: UPDATE REDUX STATE ===
      dispatch(loginSuccess({ user })); // Cập nhật Redux state: user data + isAuthenticated = true
      
      // === BƯỚC 5: REDIRECT THEO ROLE ===
      // Điều hướng dựa vào role (IN HOA) để đảm bảo matching chính xác
      switch ((user.role || '').toUpperCase()) {
        case 'ADMIN':
          navigate('/admin/dashboard'); // Admin → Admin Dashboard
          break;
        case 'STAFF':
          navigate('/staff/dashboard'); // Staff → Staff Dashboard
          break;
        case 'DONOR':
          navigate('/donor/dashboard'); // Donor → Donor Dashboard
          break;
        case 'MEDICALCENTER':
          navigate('/medical-center/dashboard'); // Medical Center → Medical Center Dashboard
          break;
        default:
          navigate('/user/dashboard'); // Default → User Dashboard
      }
    } catch (error) {
      console.log('Caught error:', error);
      console.log('Error message:', error.message || error);
      
      // === BƯỚC 6: ERROR HANDLING ===
      
      // Xử lý network error khi backend không chạy
      if (error.message && error.message.includes('Network Error')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
      } else {
        setError(error.message || 'Lỗi kết nối server');
      }
      
      // Cập nhật Redux state với error
      dispatch(loginFailure(error.message || 'Login failed'));
    } finally {
      // === BƯỚC 7: CLEANUP ===
      setIsLoading(false); // Tắt loading UI
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        {/* Language Switcher - Cho phép chuyển đổi ngôn ngữ */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <LanguageSwitcher />
        </Box>
        
        {/* Login Form */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {t('login.title')}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Email Input */}
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
              disabled={isLoading} // Disable khi đang loading
            />
            
            {/* Password Input */}
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
              disabled={isLoading} // Disable khi đang loading
            />
            
            {/* Error Message */}
            {error && (
              <Typography color="error" sx={{ mt: 1, mb: 1, textAlign: 'center' }}>{error}</Typography>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading} // Disable khi đang loading
            >
              {isLoading ? (
                // Loading state với spinner
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t('login.loggingIn') || 'Đang đăng nhập...'}
                </Box>
              ) : (
                // Normal state
                t('login.loginButton')
              )}
            </Button>
            
            {/* Register Link */}
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