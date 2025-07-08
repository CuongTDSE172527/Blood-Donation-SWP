import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { donorService } from '../services/donorService';
import api from '../services/api';

const DonationRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    bloodType: '',
    lastDonationDate: '',
    weight: '',
    height: '',
    amount: 1,
    locationId: '',
    diseaseIds: [],
  });
  
  const [locations, setLocations] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/donation-registration' } });
      return;
    }
    
    // Load locations and diseases (you'll need to create these endpoints in backend)
    loadFormData();
  }, [isAuthenticated, navigate]);

  const loadFormData = async () => {
    try {
      // Load locations and diseases from backend
      const [locationsResponse, diseasesResponse] = await Promise.all([
        api.get('/locations'),
        api.get('/diseases')
      ]);
      
      setLocations(locationsResponse.data);
      setDiseases(diseasesResponse.data);
    } catch (error) {
      console.error('Error loading form data:', error);
      // Fallback to mock data if API fails
      setLocations([
        { id: 1, name: 'Bệnh viện A', address: '123 Đường ABC, Quận 1' },
        { id: 2, name: 'Bệnh viện B', address: '456 Đường XYZ, Quận 2' },
      ]);
      setDiseases([
        { id: 1, name: 'HIV' },
        { id: 2, name: 'Viêm gan B' },
        { id: 3, name: 'Viêm gan C' },
      ]);
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

    setLoading(true);
    setError('');

    try {
      await donorService.registerDonation(user.id, formData);
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
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