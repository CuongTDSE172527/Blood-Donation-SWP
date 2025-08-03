import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Info,
  Schedule,
  HealthAndSafety,
  Assignment,
  Notifications,
  LocalHospital,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DonationInformation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const eligibilityRequirements = [
    {
      category: 'Basic Requirements',
      icon: <CheckCircle color="primary" />,
      items: [
        'Age: 18-60 years old',
        'Weight: Minimum 45kg',
        'Height: Minimum 140cm',
        'BMI: 17-40 (severe underweight/obesity excluded)',
        'Valid identification required'
      ]
    },
    {
      category: 'Health Requirements',
      icon: <HealthAndSafety color="primary" />,
      items: [
        'Blood pressure: 90-180/50-100 mmHg',
        'Heart rate: 50-100 bpm',
        'Body temperature: 36-37.5°C',
        'Hemoglobin: ≥13.5 g/dL (male), ≥12.5 g/dL (female)'
      ]
    },
    {
      category: 'Time Intervals',
      icon: <Schedule color="primary" />,
      items: [
        'Males: Wait 3-4 months between donations',
        'Females: Wait 4-6 months between donations',
        'First-time donors welcome',
        'Maximum 4 donations per year'
      ]
    }
  ];

  const disqualifyingFactors = [
    'Recent surgery (within 6 months)',
    'Recent tattoo or piercing (within 6 months)',
    'Pregnancy or breastfeeding',
    'Travel to malaria-endemic areas (within 3 months)',
    'Certain medications or medical conditions',
    'Recent blood transfusion (within 12 months)',
    'Severe underweight (BMI < 17) or morbid obesity (BMI > 40)',
    'High BMI (BMI > 35) may require additional medical evaluation'
  ];

  const donationProcess = [
    {
      step: 1,
      title: 'Registration & Health Screening',
      description: 'Complete detailed health questionnaire and provide vital signs',
      duration: '15-20 minutes'
    },
    {
      step: 2,
      title: 'Risk Assessment',
      description: 'Review lifestyle factors and recent activities',
      duration: '5-10 minutes'
    },
    {
      step: 3,
      title: 'Medical Pre-Check',
      description: 'Quick health examination by medical staff',
      duration: '5-10 minutes'
    },
    {
      step: 4,
      title: 'Blood Donation',
      description: 'Actual blood collection process',
      duration: '8-10 minutes'
    },
    {
      step: 5,
      title: 'Recovery & Refreshments',
      description: 'Rest and monitor for any adverse reactions',
      duration: '15-20 minutes'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom 
            sx={{ 
              color: '#d32f2f', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LocalHospital sx={{ mr: 1 }} />
            Blood Donation Information
          </Typography>
          
          <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Everything you need to know about our comprehensive blood donation process
          </Typography>

          {/* Eligibility Requirements */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
              Eligibility Requirements
            </Typography>
            
            <Grid container spacing={3}>
              {eligibilityRequirements.map((req, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {req.icon}
                        <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                          {req.category}
                        </Typography>
                      </Box>
                      <List dense>
                        {req.items.map((item, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckCircle fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={item}
                              primaryTypographyProps={{ fontSize: '0.9rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Disqualifying Factors */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
              Temporary Disqualifying Factors
            </Typography>
            
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                The following factors may temporarily prevent you from donating blood. 
                Most restrictions are temporary and you may be eligible to donate after the waiting period.
              </Typography>
            </Alert>
            
            <Grid container spacing={2}>
              {disqualifyingFactors.map((factor, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Warning color="warning" sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">{factor}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* BMI Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
              BMI Guidelines for Blood Donation
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Body Mass Index (BMI) Requirements:</strong>
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• BMI is calculated as: weight (kg) ÷ height (m)²" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Acceptable range: 17-40 kg/m²" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• BMI < 17: May increase risk of adverse reactions" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• BMI > 40: May increase procedural complications" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• BMI 35-40: Requires additional medical evaluation" />
                </ListItem>
              </List>
            </Alert>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Donation Process */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
              Step-by-Step Donation Process
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Our comprehensive process ensures your safety and the quality of donated blood. 
              Total time: approximately 60-90 minutes.
            </Typography>
            
            <Grid container spacing={2}>
              {donationProcess.map((process, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: '#d32f2f', 
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            mr: 2
                          }}
                        >
                          {process.step}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {process.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {process.description}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                            {process.duration}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Important Notes */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
              Important Notes
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Before Your Appointment:</strong>
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Eat a healthy meal 2-3 hours before donation" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Drink plenty of water (avoid alcohol for 24 hours)" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Get adequate sleep the night before" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Bring valid photo identification" />
                </ListItem>
              </List>
            </Alert>
            
            <Alert severity="success">
              <Typography variant="body2">
                <strong>After Donation:</strong>
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Rest for at least 15 minutes before leaving" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Drink extra fluids for the next 24 hours" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Avoid heavy lifting or strenuous exercise for 24 hours" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText primary="• Contact us if you experience any unusual symptoms" />
                </ListItem>
              </List>
            </Alert>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/donation-registration')}
              sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
            >
              Start Registration
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DonationInformation;