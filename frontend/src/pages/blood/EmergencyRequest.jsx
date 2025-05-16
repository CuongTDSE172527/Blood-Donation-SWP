import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  CircularProgress,
} from '@mui/material';

const EmergencyRequest = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);

  const [formData, setFormData] = useState({
    bloodType: '',
    units: '',
    hospital: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    medicalCondition: '',
    reason: '',
    urgency: 'emergency',
    contactName: '',
    contactPhone: '',
    contactRelation: '',
    doctorName: '',
    doctorPhone: '',
    hospitalPhone: '',
    additionalNotes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneVerification = async () => {
    setIsVerifying(true);
    // TODO: Implement phone verification logic
    // This would typically send an OTP to the phone number
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep(2);
      setAlertMessage('Verification code sent to your phone');
      setAlertSeverity('success');
      setShowAlert(true);
    }, 2000);
  };

  const handleHospitalVerification = async () => {
    setIsVerifying(true);
    // TODO: Implement hospital verification logic
    // This would typically verify the hospital details
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep(3);
      setAlertMessage('Hospital verification successful');
      setAlertSeverity('success');
      setShowAlert(true);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // TODO: Implement emergency blood request submission
    console.log('Emergency blood request data:', formData);
    
    setTimeout(() => {
      setIsVerifying(false);
      setAlertMessage('Emergency request submitted successfully. Help is on the way!');
      setAlertSeverity('success');
      setShowAlert(true);
      // Redirect to blood search after 3 seconds
      setTimeout(() => {
        navigate('/blood-search');
      }, 3000);
    }, 2000);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          This is an emergency blood request form. Please fill in all required details accurately.
          Your request will be processed immediately after verification.
        </Alert>

        <Typography variant="h4" component="h1" gutterBottom>
          Emergency Blood Request
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Patient Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Patient Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Patient Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Patient Age"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 120 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Patient Gender"
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>

              {/* Blood Requirements */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Blood Requirements
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Blood Type"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Units Required"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>

              {/* Medical Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Medical Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Hospital/Clinic Name"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Hospital Phone"
                  name="hospitalPhone"
                  value={formData.hospitalPhone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Doctor's Name"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Doctor's Phone"
                  name="doctorPhone"
                  value={formData.doctorPhone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Medical Condition"
                  name="medicalCondition"
                  value={formData.medicalCondition}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Reason for Emergency"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Contact Person"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Contact Phone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Relationship to Patient"
                  name="contactRelation"
                  value={formData.contactRelation}
                  onChange={handleChange}
                />
              </Grid>

              {/* Additional Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Additional Notes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional information that might be helpful"
                />
              </Grid>

              <Grid item xs={12}>
                {verificationStep === 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handlePhoneVerification}
                    disabled={isVerifying || !formData.contactPhone}
                  >
                    {isVerifying ? <CircularProgress size={24} /> : 'Verify Contact Phone'}
                  </Button>
                )}
                {verificationStep === 2 && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleHospitalVerification}
                    disabled={isVerifying || !formData.hospitalPhone}
                  >
                    {isVerifying ? <CircularProgress size={24} /> : 'Verify Hospital'}
                  </Button>
                )}
                {verificationStep === 3 && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth
                    disabled={isVerifying}
                  >
                    {isVerifying ? <CircularProgress size={24} /> : 'Submit Emergency Request'}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmergencyRequest; 