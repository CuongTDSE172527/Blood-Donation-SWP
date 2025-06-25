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
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
    dispatch(loginStart());
    
    try {
      // TODO: Replace with actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Giả lập API response với role khác nhau dựa vào email
          let role = 'user';
          if (formData.email.includes('admin')) {
            role = 'admin';
          } else if (formData.email.includes('staff')) {
            role = 'staff';
          } else if (formData.email.includes('donor')) {
            role = 'donor';
          }

          resolve({
            user: { 
              id: 1, 
              name: 'Test User', 
              email: formData.email,
              role: role
            },
            token: 'dummy-token',
          });
        }, 1000);
      });

      dispatch(loginSuccess(response));
      
      // Điều hướng dựa vào role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        case 'donor':
      navigate('/donor/dashboard');
          break;
        default:
          navigate('/user/dashboard');
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t('login.loginButton')}
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