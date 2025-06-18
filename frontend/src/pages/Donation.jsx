import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

function Donation() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    address: '',
    date: '',
    time: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const steps = [
    t('donation.step1'),
    t('donation.step2'),
    t('donation.step3'),
    t('donation.step4'),
  ];

  const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setSnackbar({
      open: true,
      message: t('donation.successMessage'),
      severity: 'success',
    });
    setActiveStep(0);
    setFormData({
      name: '',
      email: '',
      phone: '',
      bloodType: '',
      address: '',
      date: '',
      time: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('donation.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('donation.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('donation.phone')}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('donation.address')}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <FormControl fullWidth>
            <InputLabel>{t('donation.bloodType')}</InputLabel>
            <Select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              label={t('donation.bloodType')}
            >
              {bloodTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {t('donation.bloodTypeHelp')}
            </FormHelperText>
          </FormControl>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('donation.date')}
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label={t('donation.time')}
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('donation.confirmTitle')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  <strong>{t('donation.name')}:</strong> {formData.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>{t('donation.email')}:</strong> {formData.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>{t('donation.phone')}:</strong> {formData.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>{t('donation.address')}:</strong> {formData.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>{t('donation.bloodType')}:</strong> {formData.bloodType}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>{t('donation.datetime')}:</strong> {formData.date} {formData.time}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
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
          {t('donation.title')}
        </Typography>

        <Grid container spacing={4}>
          {/* Donation Form */}
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
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box component="form" onSubmit={handleSubmit}>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                      {t('donation.back')}
                    </Button>
                  )}
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<FavoriteIcon />}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('donation.submit')}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('donation.next')}
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Information Sidebar */}
          <Grid item xs={12} md={4}>
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
                {t('donation.infoTitle')}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">
                    <strong>{t('donation.requirements')}:</strong> {t('donation.requirementsText')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <WarningIcon sx={{ color: 'warning.main', mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">
                    <strong>{t('donation.notes')}:</strong> {t('donation.notesText')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <InfoIcon sx={{ color: 'info.main', mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">
                    <strong>{t('donation.process')}:</strong> {t('donation.processText')}
                  </Typography>
                </Box>
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

export default Donation; 