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
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { donorService } from '../services/donorService';
import { scheduleService } from '../services/scheduleService';
import { staffService } from '../services/staffService';
import api from '../services/api';
import { 
  CalendarToday, 
  LocationOn, 
  AccessTime,
  HealthAndSafety,
  Assignment,
  Warning,
  CheckCircle,
  Person,
  LocalHospital
} from '@mui/icons-material';
import dayjs from 'dayjs';

const DonationRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Get schedule data from navigation state
  const selectedSchedule = location.state?.selectedSchedule;
  const fromSchedule = location.state?.fromSchedule;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    bloodType: '',
    lastDonationDate: '',
    weight: '',
    height: '',
    amount: 350,
    locationId: selectedSchedule?.location?.id || '',
    scheduleId: selectedSchedule?.id || '',
    hasProhibitedDiseases: '',
    
    // Health Screening
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    temperature: '',
    hemoglobin: '',
    
    // Medication & Surgery History
    currentMedications: '',
    recentSurgery: false,
    surgeryDetails: '',
    surgeryDate: '',
    
    // Lifestyle & Risk Factors
    recentTravel: false,
    travelDetails: '',
    recentTattoo: false,
    tattooDate: '',
    recentPiercing: false,
    piercingDate: '',
    recentVaccination: false,
    vaccinationDetails: '',
    
    // Pregnancy & Women's Health (for females)
    isPregnant: false,
    isBreastfeeding: false,
    menstrualCycle: '',
    
    // Consent & Agreement
    healthDeclaration: false,
    consentForm: false,
    dataProcessing: false
  });
  
  const [locations, setLocations] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [eligibilityStatus, setEligibilityStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // BMI calculation and validation
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };
  
  // Realistic weight and height validation
  const validateRealisticMeasurements = (weight, height) => {
    const errors = {};
    
    // Weight validation (realistic range: 30-300 kg)
    if (weight) {
      const weightNum = parseFloat(weight);
      if (weightNum < 30) {
        errors.weight = t('donation.validation.weightTooLow');
      } else if (weightNum > 300) {
        errors.weight = t('donation.validation.weightTooHigh');
      }
    }
    
    // Height validation (realistic range: 100-250 cm)
    if (height) {
      const heightNum = parseFloat(height);
      if (heightNum < 100) {
        errors.height = t('donation.validation.heightTooLow');
      } else if (heightNum > 250) {
        errors.height = t('donation.validation.heightTooHigh');
      }
    }
    
    // Combined validation for realistic BMI
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      const bmi = calculateBMI(weightNum, heightNum);
      const bmiNum = parseFloat(bmi);
      
      // Check for unrealistic BMI combinations
      if (bmiNum < 10) {
        errors.bmi = t('donation.validation.bmiTooLow');
      } else if (bmiNum > 60) {
        errors.bmi = t('donation.validation.bmiTooHigh');
      }
      
      // Check for unrealistic weight-height combinations
      if (weightNum > 200 && heightNum < 150) {
        errors.combination = t('donation.validation.unrealisticCombination');
      }
      if (weightNum < 40 && heightNum > 200) {
        errors.combination = t('donation.validation.unrealisticCombination');
      }
    }
    
    return errors;
  };
  
  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { category: 'Underweight', color: '#ff9800', risk: 'high' };
    if (bmiNum < 25) return { category: 'Normal', color: '#4caf50', risk: 'low' };
    if (bmiNum < 30) return { category: 'Overweight', color: '#ff9800', risk: 'medium' };
    if (bmiNum < 35) return { category: 'Obesity Class I', color: '#f44336', risk: 'high' };
    if (bmiNum < 40) return { category: 'Obesity Class II', color: '#d32f2f', risk: 'very_high' };
    return { category: 'Obesity Class III', color: '#b71c1c', risk: 'extreme' };
  };
  
  const validateBMI = (weight, height) => {
    const bmi = calculateBMI(weight, height);
    if (!bmi) return { valid: true, message: '', bmi: null };
    
    const bmiNum = parseFloat(bmi);
    const category = getBMICategory(bmi);
    
    // BMI thresholds for blood donation (based on international standards)
    // Underweight: BMI < 18.5 - May increase risk of adverse reactions
    // Severely obese: BMI > 40 - May increase procedural risks
    
    if (bmiNum < 17) {
      return {
        valid: false,
        message: 'BMI quá thấp có thể tăng nguy cơ phản ứng bất lợi. Vui lòng tham khảo ý kiến bác sĩ.',
        bmi,
        category,
        severity: 'error'
      };
    }
    
    if (bmiNum < 18.5) {
      return {
        valid: true,
        message: 'BMI thấp - cần theo dõi đặc biệt trong quá trình hiến máu.',
        bmi,
        category,
        severity: 'warning'
      };
    }
    
    if (bmiNum > 40) {
      return {
        valid: false,
        message: 'BMI quá cao có thể tăng nguy cơ biến chứng. Cần đánh giá y tế đặc biệt.',
        bmi,
        category,
        severity: 'error'
      };
    }
    
    if (bmiNum > 35) {
      return {
        valid: true,
        message: 'BMI cao - cần đánh giá sức khỏe toàn diện trước khi hiến máu.',
        bmi,
        category,
        severity: 'warning'
      };
    }
    
    return {
      valid: true,
      message: bmiNum > 30 ? 'BMI hơi cao - vui lòng thông báo với nhân viên y tế.' : '',
      bmi,
      category,
      severity: bmiNum > 30 ? 'info' : 'success'
    };
  };
  
  // Validation functions for blood donation eligibility
  const validateDonationInterval = (lastDonationDate, gender) => {
    if (!lastDonationDate) return true; // First time donor
    
    const lastDate = dayjs(lastDonationDate);
    const today = dayjs();
    const daysDiff = today.diff(lastDate, 'day');
    
    // Standard intervals: 3 months (90 days) for males, 4 months (120 days) for females
    const minInterval = gender === 'FEMALE' ? 120 : 90;
    
    return daysDiff >= minInterval;
  };
  

  
  const validateRiskFactors = (formData) => {
    const errors = {};
    const today = dayjs();
    
    // Recent tattoo/piercing check (within 6 months)
    if (formData.recentTattoo && formData.tattooDate) {
      const tattooDate = dayjs(formData.tattooDate);
      const daysDiff = today.diff(tattooDate, 'day');
      if (daysDiff < 180) {
        errors.tattoo = 'Must wait 6 months after getting a tattoo';
      }
    }
    
    if (formData.recentPiercing && formData.piercingDate) {
      const piercingDate = dayjs(formData.piercingDate);
      const daysDiff = today.diff(piercingDate, 'day');
      if (daysDiff < 180) {
        errors.piercing = 'Must wait 6 months after getting a piercing';
      }
    }
    
    // Recent surgery check (within 6 months)
    if (formData.recentSurgery && formData.surgeryDate) {
      const surgeryDate = dayjs(formData.surgeryDate);
      const daysDiff = today.diff(surgeryDate, 'day');
      if (daysDiff < 180) {
        errors.surgery = 'Must wait 6 months after major surgery';
      }
    }
    
    // Pregnancy and breastfeeding
    if (formData.isPregnant) {
      errors.pregnancy = 'Pregnant women cannot donate blood';
    }
    
    if (formData.isBreastfeeding) {
      errors.breastfeeding = 'Breastfeeding mothers must wait 6 months after delivery';
    }
    
    return errors;
  };

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
      console.log('Loading form data...');
      
      // Load data individually to identify which API call fails
      let locationsResponse, diseasesResponse, schedulesResponse;
      
      try {
        // Try donor-specific endpoint first
        locationsResponse = await api.get('/donor/locations');
        console.log('Locations loaded (donor):', locationsResponse.data);
      } catch (error) {
        console.error('Error loading locations (donor):', error);
        // Fallback to staff endpoint if donor fails
        try {
          locationsResponse = await staffService.getAllLocations();
          console.log('Locations loaded (staff):', locationsResponse);
        } catch (staffError) {
          console.error('Error loading locations (staff):', staffError);
          // Use mock data as last resort
          locationsResponse = { data: [
            { id: 1, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM' },
            { id: 2, name: 'Bệnh viện Nhân dân 115', address: '527 Sư Vạn Hạnh, Quận 10, TP.HCM' },
            { id: 3, name: 'Viện Huyết học - Truyền máu TW', address: '118 Đường Trần Phú, Hà Nội' }
          ]};
          console.log('Using mock locations');
        }
      }
      
      try {
        // Try donor-specific endpoint first
        diseasesResponse = await api.get('/donor/diseases');
        console.log('Diseases loaded (donor):', diseasesResponse.data);
      } catch (error) {
        console.error('Error loading diseases (donor):', error);
        // Fallback to staff endpoint if donor fails
        try {
          diseasesResponse = await staffService.getAllDiseases();
          console.log('Diseases loaded (staff):', diseasesResponse);
        } catch (staffError) {
          console.error('Error loading diseases (staff):', staffError);
          // Use mock data as last resort
          diseasesResponse = { data: [
            { id: 1, name: 'HIV/AIDS' },
            { id: 2, name: 'Viêm gan B' },
            { id: 3, name: 'Viêm gan C' },
            { id: 4, name: 'Giang mai' },
            { id: 5, name: 'Sốt rét' },
            { id: 6, name: 'Bệnh Creutzfeldt-Jakob' }
          ]};
          console.log('Using mock diseases');
        }
      }
      
      try {
        // Try donor-specific endpoint first
        schedulesResponse = await api.get('/donor/schedules');
        console.log('Schedules loaded (donor):', schedulesResponse.data);
      } catch (error) {
        console.error('Error loading schedules (donor):', error);
        // Fallback to staff endpoint if donor fails
        try {
          schedulesResponse = await scheduleService.getAllSchedules();
          console.log('Schedules loaded (staff):', schedulesResponse);
        } catch (staffError) {
          console.error('Error loading schedules (staff):', staffError);
          // Use mock data as last resort
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          schedulesResponse = { data: [
            { 
              id: 1, 
              date: tomorrow.toISOString().split('T')[0], 
              time: '08:00:00',
              location: { id: 1, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM' }
            },
            { 
              id: 2, 
              date: tomorrow.toISOString().split('T')[0], 
              time: '14:00:00',
              location: { id: 2, name: 'Bệnh viện Nhân dân 115', address: '527 Sư Vạn Hạnh, Quận 10, TP.HCM' }
            },
            { 
              id: 3, 
              date: nextWeek.toISOString().split('T')[0], 
              time: '09:00:00',
              location: { id: 3, name: 'Viện Huyết học - Truyền máu TW', address: '118 Đường Trần Phú, Hà Nội' }
            }
          ]};
          console.log('Using mock schedules');
        }
      }
      
      setLocations(locationsResponse.data || locationsResponse);
      setDiseases(diseasesResponse.data || diseasesResponse);
      setSchedules(schedulesResponse.data || schedulesResponse);
          } catch (error) {
        console.error('Error loading form data:', error);
        setError('Đang sử dụng dữ liệu mẫu. Một số tính năng có thể bị hạn chế.');
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
    
    // Real-time validation for weight and height
    if (name === 'weight' || name === 'height') {
      const newWeight = name === 'weight' ? value : formData.weight;
      const newHeight = name === 'height' ? value : formData.height;
      
      if (newWeight || newHeight) {
        const realisticErrors = validateRealisticMeasurements(newWeight, newHeight);
        setValidationErrors(prev => ({
          ...prev,
          ...realisticErrors
        }));
      }
    }
  };

  const handleDiseaseChange = (value) => {
    setFormData(prev => ({
      ...prev,
      hasProhibitedDiseases: value
    }));
  };

  const validateCurrentStep = () => {
    const errors = {};
    
    switch (currentStep) {
      case 1: // Disease Screening
        if (!formData.hasProhibitedDiseases) {
          errors.hasProhibitedDiseases = t('donation.validation.diseaseQuestionRequired');
        } else if (formData.hasProhibitedDiseases === 'true') {
          errors.prohibitedDiseases = t('donation.validation.prohibitedDiseasesNotEligible');
        }
        break;
        
      case 2: // Basic Information
        if (!formData.bloodType) errors.bloodType = t('donation.validation.bloodTypeRequired');
        if (!formData.weight || formData.weight < 45) errors.weight = t('donation.validation.weightMin');
        if (!formData.height || formData.height < 140) errors.height = t('donation.validation.heightMin');
        if (!formData.amount || formData.amount < 250 || formData.amount > 450) errors.amount = t('donation.validation.amountRange');
        if (!fromSchedule && !formData.locationId) errors.locationId = t('donation.validation.locationRequired');
        
        // Realistic measurements validation
        if (formData.weight || formData.height) {
          const realisticErrors = validateRealisticMeasurements(formData.weight, formData.height);
          Object.assign(errors, realisticErrors);
        }
        
        // BMI validation for donation eligibility
        if (formData.weight && formData.height) {
          const bmiValidation = validateBMI(formData.weight, formData.height);
          if (!bmiValidation.valid) {
            errors.bmi = bmiValidation.message;
          }
        }
        
        // Donation interval validation
        if (!validateDonationInterval(formData.lastDonationDate, user?.gender)) {
          const minDays = user?.gender === 'FEMALE' ? 120 : 90;
          errors.lastDonationDate = t('donation.validation.donationInterval', { days: minDays });
        }
        break;
        
      case 3: // Risk Factors
        const riskErrors = validateRiskFactors(formData);
        Object.assign(errors, riskErrors);
        break;
        
      case 4: // Schedule Selection
        if (!fromSchedule && !formData.scheduleId) errors.scheduleId = t('donation.validation.scheduleRequired');
        break;
        
      case 5: // Final Consent
        if (!formData.healthDeclaration) errors.healthDeclaration = t('donation.validation.healthDeclarationRequired');
        if (!formData.consentForm) errors.consentForm = t('donation.validation.consentFormRequired');
        if (!formData.dataProcessing) errors.dataProcessing = t('donation.validation.dataProcessingRequired');
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      // If user has prohibited diseases, don't allow to proceed
      if (currentStep === 1 && formData.hasProhibitedDiseases === 'true') {
        return;
      }
      
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('Please login to register for blood donation');
      return;
    }

    if (!validateCurrentStep()) {
      setError('Please complete all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare registration data
      const registrationData = {
        ...formData,
        userId: user.id,
        // Remove diseaseIds if it exists and add hasProhibitedDiseases
        diseaseIds: undefined,
        hasProhibitedDiseases: formData.hasProhibitedDiseases === 'true'
      };
      
      // If coming from schedule, use schedule registration
      if (fromSchedule && selectedSchedule) {
        registrationData.scheduleId = selectedSchedule.id;
        registrationData.locationId = selectedSchedule.location.id;
        await scheduleService.registerForSchedule(registrationData);
      } else {
        // Regular donation registration with selected schedule
        await donorService.registerDonation(user.id, registrationData);
      }
      
      setSuccess('Blood donation registration submitted successfully! You will receive a confirmation email shortly.');
      setTimeout(() => {
        navigate('/donor/dashboard');
      }, 3000);
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
  
  const steps = [
    t('donation.steps.diseaseScreening'),
    t('donation.steps.basicInfo'),
    t('donation.steps.riskAssessment'),
    t('donation.steps.scheduleSelection'),
    t('donation.steps.consent')
  ];
  
  const renderDiseaseScreening = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ 
          p: 4, 
          border: '2px solid #d32f2f', 
          borderRadius: 3, 
          bgcolor: '#fff5f5',
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HealthAndSafety sx={{ mr: 2, fontSize: 40 }} />
            {t('donation.diseaseScreening.title')}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, color: '#d32f2f' }}>
            {t('donation.diseaseScreening.subtitle')}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
              {t('donation.prohibitedDiseasesQuestion')}
            </Typography>
            
            <Card sx={{ mb: 3, bgcolor: '#fff', border: '1px solid #ffcdd2' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                  {t('donation.prohibitedDiseases')}:
                </Typography>
                <Grid container spacing={1}>
                  {diseases.map((disease) => (
                    <Grid item xs={12} sm={6} key={disease.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                        <Warning color="error" sx={{ mr: 1 }} />
                        <Typography variant="body2">{disease.name}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
            
            <FormControl component="fieldset" required error={!!validationErrors.hasProhibitedDiseases}>
              <RadioGroup
                name="hasProhibitedDiseases"
                value={formData.hasProhibitedDiseases}
                onChange={(e) => handleDiseaseChange(e.target.value)}
                sx={{ alignItems: 'center' }}
              >
                <FormControlLabel 
                  value="false" 
                  control={<Radio color="success" />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="success.main">
                        {t('donation.prohibitedDiseasesNo')}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, p: 2, border: '2px solid #4caf50', borderRadius: 2, bgcolor: '#f1f8e9' }}
                />
                <FormControlLabel 
                  value="true" 
                  control={<Radio color="error" />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Warning color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="error.main">
                        {t('donation.prohibitedDiseasesYes')}
                      </Typography>
                    </Box>
                  }
                  sx={{ p: 2, border: '2px solid #f44336', borderRadius: 2, bgcolor: '#ffebee' }}
                />
              </RadioGroup>
              
              {validationErrors.hasProhibitedDiseases && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 2 }}>
                  {validationErrors.hasProhibitedDiseases}
                </Typography>
              )}
              
              {validationErrors.prohibitedDiseases && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {t('donation.diseaseScreening.notEligible')}
                  </Typography>
                  <Typography variant="body2">
                    {validationErrors.prohibitedDiseases}
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 2, bgcolor: '#d32f2f' }}
                  >
                    {t('donation.diseaseScreening.backToHome')}
                  </Button>
                </Alert>
              )}
            </FormControl>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {t('donation.diseaseScreening.note')}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth required error={!!validationErrors.bloodType}>
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
          {validationErrors.bloodType && (
            <Typography variant="caption" color="error">
              {validationErrors.bloodType}
            </Typography>
          )}
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
          error={!!validationErrors.lastDonationDate}
          helperText={validationErrors.lastDonationDate}
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
          error={!!validationErrors.weight}
          helperText={validationErrors.weight || t('donation.validation.weightRange')}
          inputProps={{ min: 30, max: 300, step: 0.1 }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label={t('donation.height') + ' (cm)'}
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
          error={!!validationErrors.height}
          helperText={validationErrors.height || t('donation.validation.heightRange')}
          inputProps={{ min: 100, max: 250, step: 0.1 }}
        />
      </Grid>
      
      {/* BMI Display */}
      {formData.weight && formData.height && (
        <Grid item xs={12}>
          <Box sx={{ 
            p: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2, 
            bgcolor: '#f9f9f9' 
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <HealthAndSafety sx={{ mr: 1, color: '#d32f2f' }} />
              BMI Assessment
            </Typography>
            
            {(() => {
              const bmi = calculateBMI(formData.weight, formData.height);
              const bmiValidation = validateBMI(formData.weight, formData.height);
              const category = getBMICategory(bmi);
              
              return (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        BMI: {bmi}
                      </Typography>
                      <Chip 
                        label={category?.category || 'Unknown'}
                        size="small"
                        sx={{ 
                          ml: 2,
                          bgcolor: category?.color || '#grey',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {bmiValidation.message && (
                    <Grid item xs={12}>
                      <Alert 
                        severity={bmiValidation.severity} 
                        sx={{ mt: 1 }}
                      >
                        {bmiValidation.message}
                      </Alert>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      BMI Reference: Underweight (&lt;18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)
                    </Typography>
                  </Grid>
                </Grid>
              );
            })()}
            
            {validationErrors.bmi && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {validationErrors.bmi}
              </Alert>
            )}
            {validationErrors.combination && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {validationErrors.combination}
              </Alert>
            )}
          </Box>
        </Grid>
      )}
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          label={t('donation.amount') + ' (ml)'}
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={!!validationErrors.amount}
          helperText={validationErrors.amount || t('donation.validation.amountRange')}
          inputProps={{ min: 250, max: 450, step: 50 }}
        />
      </Grid>
      
      {!fromSchedule && (
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!validationErrors.locationId}>
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
            {validationErrors.locationId && (
              <Typography variant="caption" color="error">
                {validationErrors.locationId}
              </Typography>
            )}
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
  


  const renderScheduleSelection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1, color: '#d32f2f' }} />
          {t('donation.scheduleSelection.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('donation.scheduleSelection.subtitle')}
        </Typography>
      </Grid>
      
      {fromSchedule && selectedSchedule ? (
        <Grid item xs={12}>
          <Card sx={{ p: 3, bgcolor: '#fff5f5', border: '1px solid #d32f2f' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
              {t('donation.selectedSchedule')}
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
          </Card>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <FormControl fullWidth required error={!!validationErrors.scheduleId}>
            <InputLabel>{t('donation.scheduleSelection.selectSchedule')}</InputLabel>
            <Select
              name="scheduleId"
              value={formData.scheduleId}
              onChange={handleChange}
              label={t('donation.scheduleSelection.selectSchedule')}
            >
              {schedules.map((schedule) => (
                <MenuItem key={schedule.id} value={schedule.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(schedule.date)} - {formatTime(schedule.time)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {schedule.location?.name} - {schedule.location?.address}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {validationErrors.scheduleId && (
              <Typography variant="caption" color="error">
                {validationErrors.scheduleId}
              </Typography>
            )}
          </FormControl>
        </Grid>
      )}
      
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {t('donation.scheduleSelection.note')}
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const renderRiskAssessment = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: '#d32f2f' }} />
          Risk Factor Assessment
        </Typography>
      </Grid>
      
      {/* Medication History */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Current Medications"
          name="currentMedications"
          value={formData.currentMedications}
          onChange={handleChange}
          placeholder="List all medications you are currently taking, including vitamins and supplements"
        />
      </Grid>
      
      {/* Surgery History */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Recent Surgery</Typography>
        <RadioGroup
          name="recentSurgery"
          value={formData.recentSurgery}
          onChange={(e) => setFormData(prev => ({ ...prev, recentSurgery: e.target.value === 'true' }))}
        >
          <FormControlLabel value={false} control={<Radio />} label="No recent surgery" />
          <FormControlLabel value={true} control={<Radio />} label="Had surgery in the last 6 months" />
        </RadioGroup>
        
        {formData.recentSurgery && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Surgery Details"
              name="surgeryDetails"
              value={formData.surgeryDetails}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Surgery Date"
              name="surgeryDate"
              type="date"
              value={formData.surgeryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!validationErrors.surgery}
              helperText={validationErrors.surgery}
            />
          </Box>
        )}
      </Grid>
      
      {/* Travel History */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Recent Travel</Typography>
        <RadioGroup
          name="recentTravel"
          value={formData.recentTravel}
          onChange={(e) => setFormData(prev => ({ ...prev, recentTravel: e.target.value === 'true' }))}
        >
          <FormControlLabel value={false} control={<Radio />} label="No recent travel to high-risk areas" />
          <FormControlLabel value={true} control={<Radio />} label="Traveled to malaria/endemic areas in last 3 months" />
        </RadioGroup>
        
        {formData.recentTravel && (
          <TextField
            fullWidth
            label="Travel Details (Countries/Regions visited)"
            name="travelDetails"
            value={formData.travelDetails}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
        )}
      </Grid>
      
      {/* Tattoo/Piercing */}
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>Recent Tattoo</Typography>
        <RadioGroup
          name="recentTattoo"
          value={formData.recentTattoo}
          onChange={(e) => setFormData(prev => ({ ...prev, recentTattoo: e.target.value === 'true' }))}
        >
          <FormControlLabel value={false} control={<Radio />} label="No recent tattoo" />
          <FormControlLabel value={true} control={<Radio />} label="Got tattoo in last 6 months" />
        </RadioGroup>
        
        {formData.recentTattoo && (
          <TextField
            fullWidth
            label="Tattoo Date"
            name="tattooDate"
            type="date"
            value={formData.tattooDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.tattoo}
            helperText={validationErrors.tattoo}
            sx={{ mt: 1 }}
          />
        )}
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>Recent Piercing</Typography>
        <RadioGroup
          name="recentPiercing"
          value={formData.recentPiercing}
          onChange={(e) => setFormData(prev => ({ ...prev, recentPiercing: e.target.value === 'true' }))}
        >
          <FormControlLabel value={false} control={<Radio />} label="No recent piercing" />
          <FormControlLabel value={true} control={<Radio />} label="Got piercing in last 6 months" />
        </RadioGroup>
        
        {formData.recentPiercing && (
          <TextField
            fullWidth
            label="Piercing Date"
            name="piercingDate"
            type="date"
            value={formData.piercingDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.piercing}
            helperText={validationErrors.piercing}
            sx={{ mt: 1 }}
          />
        )}
      </Grid>
      
      {/* Women's Health (show only for females) */}
      {user?.gender === 'FEMALE' && (
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Women's Health Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isPregnant}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPregnant: e.target.checked }))}
                  />
                }
                label="Currently pregnant"
              />
              {validationErrors.pregnancy && (
                <Typography variant="caption" color="error" display="block">
                  {validationErrors.pregnancy}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isBreastfeeding}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBreastfeeding: e.target.checked }))}
                  />
                }
                label="Currently breastfeeding"
              />
              {validationErrors.breastfeeding && (
                <Typography variant="caption" color="error" display="block">
                  {validationErrors.breastfeeding}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
  
  const renderConsentForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Assignment sx={{ mr: 1, color: '#d32f2f' }} />
          Consent & Declaration
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>Blood Donation Health Declaration</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="I confirm that I have answered all health questions truthfully"
                secondary="All information provided in this form is accurate and complete"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="I understand the blood donation process and potential risks"
                secondary="I have been informed about the donation procedure and aftercare"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="I consent to blood testing for infectious diseases"
                secondary="My blood will be tested for HIV, Hepatitis, Syphilis and other diseases"
              />
            </ListItem>
          </List>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.healthDeclaration}
              onChange={(e) => setFormData(prev => ({ ...prev, healthDeclaration: e.target.checked }))}
            />
          }
          label="I hereby declare that the above health information is true and complete to the best of my knowledge"
        />
        {validationErrors.healthDeclaration && (
          <Typography variant="caption" color="error" display="block">
            {validationErrors.healthDeclaration}
          </Typography>
        )}
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.consentForm}
              onChange={(e) => setFormData(prev => ({ ...prev, consentForm: e.target.checked }))}
            />
          }
          label="I consent to donate blood and understand that my blood will be used for transfusion or medical research"
        />
        {validationErrors.consentForm && (
          <Typography variant="caption" color="error" display="block">
            {validationErrors.consentForm}
          </Typography>
        )}
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.dataProcessing}
              onChange={(e) => setFormData(prev => ({ ...prev, dataProcessing: e.target.checked }))}
            />
          }
          label="I consent to the processing of my personal data in accordance with privacy policies"
        />
        {validationErrors.dataProcessing && (
          <Typography variant="caption" color="error" display="block">
            {validationErrors.dataProcessing}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
  
  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderDiseaseScreening();
      case 2:
        return renderBasicInformation();
      case 3:
        return renderRiskAssessment();
      case 4:
        return renderScheduleSelection();
      case 5:
        return renderConsentForm();
      default:
        return renderDiseaseScreening();
    }
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
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LocalHospital sx={{ mr: 1 }} />
            {t('donation.title')}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('donation.subtitle')}
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
          
          {/* Progress Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={currentStep - 1} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          {/* Step Content */}
          <Box sx={{ mt: 3 }}>
            {getCurrentStepContent()}
            
            {/* Navigation Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Box>
                {currentStep > 1 && (
                  <Button
                    variant="outlined"
                    onClick={handlePrevious}
                    disabled={loading}
                  >
                    {t('common.previous')}
                  </Button>
                )}
                {currentStep === 1 && (
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    {t('common.cancel')}
                  </Button>
                )}
              </Box>
              
              {currentStep === 1 && formData.hasProhibitedDiseases === 'true' ? (
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  disabled={loading}
                  sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
                >
                  {t('donation.diseaseScreening.backToHome')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
                >
                  {loading && currentStep === 5 ? 
                    t('donation.submitting') : 
                    currentStep === 5 ? 
                      t('donation.completeRegistration') : 
                      t('common.next')
                  }
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DonationRegistration; 