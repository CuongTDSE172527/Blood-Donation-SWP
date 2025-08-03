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
    amount: 1,
    locationId: selectedSchedule?.location?.id || '',
    
    // Health Screening
    diseaseIds: [],
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
  
  const validateVitalSigns = (formData) => {
    const errors = {};
    
    // Blood pressure validation (systolic: 90-180, diastolic: 50-100)
    if (formData.bloodPressure.systolic) {
      const systolic = parseInt(formData.bloodPressure.systolic);
      if (systolic < 90 || systolic > 180) {
        errors.bloodPressure = 'Blood pressure must be between 90-180/50-100 mmHg';
      }
    }
    
    if (formData.bloodPressure.diastolic) {
      const diastolic = parseInt(formData.bloodPressure.diastolic);
      if (diastolic < 50 || diastolic > 100) {
        errors.bloodPressure = 'Blood pressure must be between 90-180/50-100 mmHg';
      }
    }
    
    // Heart rate validation (50-100 bpm)
    if (formData.heartRate) {
      const heartRate = parseInt(formData.heartRate);
      if (heartRate < 50 || heartRate > 100) {
        errors.heartRate = 'Heart rate must be between 50-100 bpm';
      }
    }
    
    // Temperature validation (36-37.5°C)
    if (formData.temperature) {
      const temp = parseFloat(formData.temperature);
      if (temp < 36 || temp > 37.5) {
        errors.temperature = 'Body temperature must be between 36-37.5°C';
      }
    }
    
    // Hemoglobin validation (males: ≥13.5 g/dL, females: ≥12.5 g/dL)
    if (formData.hemoglobin && user?.gender) {
      const hb = parseFloat(formData.hemoglobin);
      const minHb = user.gender === 'FEMALE' ? 12.5 : 13.5;
      if (hb < minHb) {
        errors.hemoglobin = `Hemoglobin must be at least ${minHb} g/dL`;
      }
    }
    
    return errors;
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

  const validateCurrentStep = () => {
    const errors = {};
    
    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.bloodType) errors.bloodType = 'Blood type is required';
        if (!formData.weight || formData.weight < 45) errors.weight = 'Weight must be at least 45kg';
        if (!formData.height || formData.height < 140) errors.height = 'Height must be at least 140cm';
        if (!fromSchedule && !formData.locationId) errors.locationId = 'Location is required';
        
        // BMI validation
        if (formData.weight && formData.height) {
          const bmiValidation = validateBMI(formData.weight, formData.height);
          if (!bmiValidation.valid) {
            errors.bmi = bmiValidation.message;
          }
        }
        
        // Donation interval validation
        if (!validateDonationInterval(formData.lastDonationDate, user?.gender)) {
          const minDays = user?.gender === 'FEMALE' ? 120 : 90;
          errors.lastDonationDate = `Must wait ${minDays} days since last donation`;
        }
        break;
        
      case 2: // Health Screening
        const vitalErrors = validateVitalSigns(formData);
        Object.assign(errors, vitalErrors);
        
        // Check for prohibited diseases
        if (formData.diseaseIds && formData.diseaseIds.length > 0) {
          const selectedDiseases = diseases.filter(disease => 
            formData.diseaseIds.includes(disease.id)
          );
          
          if (selectedDiseases.length > 0) {
            const diseaseNames = selectedDiseases.map(disease => disease.name).join(', ');
            errors.diseases = `Cannot donate with: ${diseaseNames}. Please consult a healthcare provider.`;
          }
        }
        break;
        
      case 3: // Risk Factors
        const riskErrors = validateRiskFactors(formData);
        Object.assign(errors, riskErrors);
        break;
        
      case 4: // Final Consent
        if (!formData.healthDeclaration) errors.healthDeclaration = 'Health declaration is required';
        if (!formData.consentForm) errors.consentForm = 'Consent form must be accepted';
        if (!formData.dataProcessing) errors.dataProcessing = 'Data processing consent is required';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
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
    'Basic Information',
    'Health Screening', 
    'Risk Assessment',
    'Consent & Agreement'
  ];
  
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
          helperText={validationErrors.weight || 'Minimum weight: 45kg'}
          inputProps={{ min: 45, step: 0.1 }}
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
          helperText={validationErrors.height || 'Minimum height: 140cm'}
          inputProps={{ min: 140, step: 0.1 }}
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
          </Box>
        </Grid>
      )}
      
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
  
  const renderHealthScreening = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <HealthAndSafety sx={{ mr: 1, color: '#d32f2f' }} />
          Vital Signs Assessment
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" gutterBottom>Blood Pressure (mmHg)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Systolic"
            name="systolic"
            type="number"
            value={formData.bloodPressure.systolic}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              bloodPressure: { ...prev.bloodPressure, systolic: e.target.value }
            }))}
            inputProps={{ min: 80, max: 200 }}
            error={!!validationErrors.bloodPressure}
          />
          <Typography sx={{ alignSelf: 'center' }}>/</Typography>
          <TextField
            placeholder="Diastolic"
            name="diastolic"
            type="number"
            value={formData.bloodPressure.diastolic}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              bloodPressure: { ...prev.bloodPressure, diastolic: e.target.value }
            }))}
            inputProps={{ min: 40, max: 120 }}
            error={!!validationErrors.bloodPressure}
          />
        </Box>
        {validationErrors.bloodPressure && (
          <Typography variant="caption" color="error">
            {validationErrors.bloodPressure}
          </Typography>
        )}
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Heart Rate (bpm)"
          name="heartRate"
          type="number"
          value={formData.heartRate}
          onChange={handleChange}
          error={!!validationErrors.heartRate}
          helperText={validationErrors.heartRate || 'Normal range: 50-100 bpm'}
          inputProps={{ min: 40, max: 120 }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Body Temperature (°C)"
          name="temperature"
          type="number"
          value={formData.temperature}
          onChange={handleChange}
          error={!!validationErrors.temperature}
          helperText={validationErrors.temperature || 'Normal range: 36-37.5°C'}
          inputProps={{ min: 35, max: 40, step: 0.1 }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Hemoglobin Level (g/dL)"
          name="hemoglobin"
          type="number"
          value={formData.hemoglobin}
          onChange={handleChange}
          error={!!validationErrors.hemoglobin}
          helperText={validationErrors.hemoglobin || `Minimum: ${user?.gender === 'FEMALE' ? '12.5' : '13.5'} g/dL`}
          inputProps={{ min: 8, max: 20, step: 0.1 }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Medical History
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
        {validationErrors.diseases && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {validationErrors.diseases}
          </Alert>
        )}
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
        return renderBasicInformation();
      case 2:
        return renderHealthScreening();
      case 3:
        return renderRiskAssessment();
      case 4:
        return renderConsentForm();
      default:
        return renderBasicInformation();
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
            Blood Donation Registration
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Complete the comprehensive health screening for safe blood donation
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
                    Previous
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
              
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
              >
                {loading && currentStep === 4 ? 
                  'Submitting...' : 
                  currentStep === 4 ? 
                    'Complete Registration' : 
                    'Next'
                }
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DonationRegistration; 