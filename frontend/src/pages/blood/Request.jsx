import { useState } from 'react';
import { useSelector } from 'react-redux';
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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

const Request = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  const [formData, setFormData] = useState({
    bloodType: '',
    units: '',
    hospital: '',
    reason: '',
    urgency: 'normal',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    doctorName: '',
    doctorPhone: '',
    requiredDate: '',
    rareBloodType: '',
  });

  const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Other (rare)'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAlertMessage('Please login to submit a blood request');
      setAlertSeverity('error');
      setShowAlert(true);
      setTimeout(() => {
        navigate('/login', { state: { from: '/blood-request' } });
      }, 2000);
      return;
    }

    // TODO: Implement blood request submission
    console.log('Blood request data:', formData);
    setAlertMessage('Blood request submitted successfully');
    setAlertSeverity('success');
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Request Blood
        </Typography>
        
        {!isAuthenticated && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            You need to be logged in to submit a blood request. Please login or create an account.
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="none" sx={{ mt: 2 }} required>
                  <InputLabel id="blood-type-label">Blood Type</InputLabel>
                  <Select
                    labelId="blood-type-label"
                    id="blood-type"
                    name="bloodType"
                    value={formData.bloodType}
                    label="Blood Type"
                    onChange={(e) => {
                      setFormData({ ...formData, bloodType: e.target.value, rareBloodType: '' });
                    }}
                  >
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.bloodType === 'Other (rare)' && (
                  <TextField
                    fullWidth
                    margin="none"
                    sx={{ mt: 2 }}
                    label="Enter Rare Blood Type"
                    name="rareBloodType"
                    value={formData.rareBloodType || ''}
                    onChange={(e) => setFormData({ ...formData, rareBloodType: e.target.value })}
                    required
                  />
                )}
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
                  margin="none"
                  sx={{ mt: 2 }}
                />
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
                  multiline
                  rows={3}
                  label="Reason for Request"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Urgency Level"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Required Date"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Contact Person"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  disabled={isAuthenticated}
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
                  disabled={isAuthenticated}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={!isAuthenticated}
                >
                  Submit Request
                </Button>
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

export default Request; 