import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
} from '@mui/material';

const Request = () => {
  const [formData, setFormData] = useState({
    bloodType: '',
    units: '',
    hospital: '',
    reason: '',
    urgency: 'normal',
    contactName: '',
    contactPhone: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement blood request submission
    console.log('Blood request data:', formData);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Request Blood
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
                  <MenuItem value="emergency">Emergency</MenuItem>
                </TextField>
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
              <Grid item xs={12}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Request; 