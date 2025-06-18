import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setSnackbar({
      open: true,
      message: t('contact.successMessage'),
      severity: 'success',
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, textDecoration: 'underline', textUnderlineOffset: 8, color: '#d32f2f', letterSpacing: -1 }}
        >
          {t('contact.title')}
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                bgcolor: '#fff',
                borderRadius: cardRadius,
                boxShadow: cardShadow,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
                {t('contact.infoTitle')}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationIcon sx={{ color: '#d32f2f', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('contact.address')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PhoneIcon sx={{ color: '#d32f2f', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('contact.phone')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (028) 1234 5678
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ color: '#d32f2f', mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t('contact.email')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      info@blooddonation.vn
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                bgcolor: '#fff',
                borderRadius: cardRadius,
                boxShadow: cardShadow,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
                {t('contact.formTitle')}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label={t('contact.name')}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label={t('contact.email')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label={t('contact.subject')}
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label={t('contact.message')}
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      sx={{
                        mt: 2,
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('contact.send')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Contact; 