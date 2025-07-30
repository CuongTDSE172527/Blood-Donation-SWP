import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { donorService } from '../services/donorService';
import { scheduleService } from '../services/scheduleService';
import { staffService } from '../services/staffService';
import { CalendarToday, LocationOn, AccessTime } from '@mui/icons-material';
import dayjs from 'dayjs';

const DonationRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Get schedule data from navigation state
  const selectedSchedule = location.state?.selectedSchedule;
  const fromSchedule = location.state?.fromSchedule;
  
  const [formData, setFormData] = useState({
    bloodType: '',
    lastDonationDate: '',
    weight: '',
    height: '',
    amount: 1,
    locationId: selectedSchedule?.location?.id || '',
    diseaseIds: [],
  });
  
  const [locations, setLocations] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/donation-registration' } });
      return;
    }
    loadFormData();
  }, [isAuthenticated, navigate]);

  const loadFormData = async () => {
    setLoadingForm(true);
    setError('');
    try {
      const [locationsResponse, diseasesResponse] = await Promise.all([
        staffService.getAllLocations(),
        staffService.getAllDiseases()
      ]);
      setLocations(locationsResponse);
      setDiseases(diseasesResponse);
    } catch (error) {
      console.error('Error loading form data:', error);
      setError('Không thể tải dữ liệu địa điểm hoặc bệnh cấm hiến. Vui lòng thử lại.');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleDiseaseChange = (diseaseId) => {
    setFormData(prev => ({
      ...prev,
      diseaseIds: prev.diseaseIds.includes(diseaseId)
        ? prev.diseaseIds.filter(id => id !== diseaseId)
        : [...prev.diseaseIds, diseaseId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to register for blood donation');
      return;
    }

    // Validation
    if (!formData.bloodType || !formData.locationId) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.weight < 45) {
      setError('Weight must be at least 45kg to donate blood');
      return;
    }

    // Check for prohibited diseases
    if (formData.diseaseIds && formData.diseaseIds.length > 0) {
      const selectedDiseases = diseases.filter(disease => 
        formData.diseaseIds.includes(disease.id)
      );
      
      if (selectedDiseases.length > 0) {
        const diseaseNames = selectedDiseases.map(disease => disease.name).join(', ');
        setError(`You cannot donate blood if you have the following conditions: ${diseaseNames}. Please consult with a healthcare provider.`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // If coming from schedule, use schedule registration
      if (fromSchedule && selectedSchedule) {
        const registrationData = {
          ...formData,
          userId: user.id,
          scheduleId: selectedSchedule.id,
          locationId: selectedSchedule.location.id
        };
        await scheduleService.registerForSchedule(registrationData);
      } else {
        // Regular donation registration
        await donorService.registerDonation(user.id, formData);
      }
      
      setSuccess('Blood donation registration submitted successfully!');
      setTimeout(() => {
        navigate('/donor/dashboard');
      }, 2000);
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return dayjs(`2000-01-01T${time}`).format('HH:mm');
  };

  const formatDate = (date) => {
    if (!date) return '';
    return dayjs(date).format('DD/MM/YYYY');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingForm) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">{t('common.loading') || 'Loading...'}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
            {t('donation.register')}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Show selected schedule if coming from schedule page */}
          {fromSchedule && selectedSchedule && (
            <Card sx={{ mb: 3, bgcolor: '#fff5f5', border: '1px solid #d32f2f' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', fontWeight: 600 }}>
                  {t('donation.selectedSchedule') || 'Selected Schedule'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDate(selectedSchedule.date)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatTime(selectedSchedule.time)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {selectedSchedule.location?.name} - {selectedSchedule.location?.address}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
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
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('donation.lastDonationDate')}
                  name="lastDonationDate"
                  type="date"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('donation.weight') + ' (kg)'}
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  inputProps={{ min: 45, step: 0.1 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('donation.height') + ' (cm)'}
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  inputProps={{ min: 100, step: 0.1 }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label={t('donation.amount') + ' (units)'}
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  inputProps={{ min: 1, max: 2 }}
                />
              </Grid>
              
              {/* Only show location selection if not coming from schedule */}
              {!fromSchedule && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('donation.location')}</InputLabel>
                    <Select
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleChange}
                      label={t('donation.location')}
                    >
                      {locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                          {location.name} - {location.address}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('donation.prohibitedDiseases')}
                </Typography>
                <FormGroup>
                  {diseases.map((disease) => (
                    <FormControlLabel
                      key={disease.id}
                      control={
                        <Checkbox
                          checked={formData.diseaseIds.includes(disease.id)}
                          onChange={() => handleDiseaseChange(disease.id)}
                        />
                      }
                      label={disease.name}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
              >
                {loading ? t('common.submitting') : t('donation.submit')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DonationRegistration; 