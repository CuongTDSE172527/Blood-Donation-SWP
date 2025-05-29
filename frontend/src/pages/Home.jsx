import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  LocalHospital,
  HowToReg,
  Favorite,
  Info,
  Bloodtype,
  Timeline,
} from '@mui/icons-material';
import { useState } from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const features = [
  {
    title: 'Become a Donor',
    description: 'Register as a blood donor and help save lives in your community.',
    icon: <HowToReg sx={{ fontSize: 48 }} />,
    path: '/register',
    color: 'secondary.main',
  },
];

const bloodInfo = [
  {
    title: 'Blood Types',
    content: 'There are four major blood groups determined by the presence or absence of two antigens, A and B, on the surface of red blood cells. In addition to the A and B antigens, there is a protein called the Rh factor, which can be either present (+) or absent (–), creating the 8 most common blood types (A+, A-, B+, B-, O+, O-, AB+, AB-).',
    icon: <Bloodtype sx={{ fontSize: 40, color: 'primary.main' }} />,
  },
  {
    title: 'Universal Donors',
    content: 'Type O negative blood is the universal red cell donor type and can be given to patients of any blood type. Type AB blood is the universal plasma donor type. These blood types are crucial for emergency situations.',
    icon: <Favorite sx={{ fontSize: 40, color: 'error.main' }} />,
  },
  {
    title: 'Why Donate Blood?',
    content: 'Blood donation is a simple, safe way to help save lives. Your donation can help up to three people in need of blood transfusions. Nearly 16 million blood components are transfused each year in the U.S.',
    icon: <Info sx={{ fontSize: 40, color: 'info.main' }} />,
  },
  {
    title: 'Donation Process',
    content: 'The entire process takes about an hour. It includes registration, a mini-physical, donation, and refreshments. The actual donation takes only about 8-10 minutes.',
    icon: <Timeline sx={{ fontSize: 40, color: 'success.main' }} />,
  },
];

const bloodTypeCompatibility = [
  {
    type: 'O-',
    description: 'Universal Donor',
    canReceive: ['O-'],
    canDonateTo: ['O-, O+, A-, A+, B-, B+, AB-, AB+'],
  },
  {
    type: 'O+',
    description: 'Most Common Type',
    canReceive: ['O-, O+'],
    canDonateTo: ['O+, A+, B+, AB+'],
  },
  {
    type: 'A-',
    description: 'Rare Type',
    canReceive: ['O-, A-'],
    canDonateTo: ['A-, A+, AB-, AB+'],
  },
  {
    type: 'A+',
    description: 'Common Type',
    canReceive: ['O-, O+, A-, A+'],
    canDonateTo: ['A+, AB+'],
  },
];

const mockAvailableDates = [
  '2024-06-10',
  '2024-06-12',
  '2024-06-15',
  '2024-06-18',
  '2024-06-20',
  '2024-06-25',
];

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const bloodTypeCompatibility = [
    {
      type: 'O-',
      description: t('home.bloodTypes.universalDonor'),
      canReceive: ['O-'],
      canDonateTo: ['O-, O+, A-, A+, B-, B+, AB-, AB+'],
    },
    {
      type: 'O+',
      description: t('home.bloodTypes.mostCommon'),
      canReceive: ['O-, O+'],
      canDonateTo: ['O+, A+, B+, AB+'],
    },
    {
      type: 'A-',
      description: t('home.bloodTypes.rareType'),
      canReceive: ['O-, A-'],
      canDonateTo: ['A-, A+, AB-, AB+'],
    },
    {
      type: 'A+',
      description: t('home.bloodTypes.commonType'),
      canReceive: ['O-, O+, A-, A+'],
      canDonateTo: ['A+, AB+'],
    },
  ];

  const bloodInfo = [
    {
      title: t('home.info.bloodTypes.title'),
      content: t('home.info.bloodTypes.content'),
      icon: <Bloodtype sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: t('home.info.universalDonors.title'),
      content: t('home.info.universalDonors.content'),
      icon: <Favorite sx={{ fontSize: 40, color: 'error.main' }} />,
    },
    {
      title: t('home.info.whyDonate.title'),
      content: t('home.info.whyDonate.content'),
      icon: <Info sx={{ fontSize: 40, color: 'info.main' }} />,
    },
    {
      title: t('home.info.process.title'),
      content: t('home.info.process.content'),
      icon: <Timeline sx={{ fontSize: 40, color: 'success.main' }} />,
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          borderRadius: 0,
          py: { xs: 4, md: 10 },
          mb: 8,
          boxShadow: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h4' : 'h2'}
                component="h1"
                fontWeight={700}
                gutterBottom
                sx={{ letterSpacing: -1, fontSize: { xs: 32, md: 48 } }}
              >
                {t('home.hero.title')}
              </Typography>
              <Typography variant="h6" paragraph sx={{ opacity: 0.9, fontSize: { xs: 16, md: 22 } }}>
                {t('home.hero.subtitle')}
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  alignItems: { xs: 'stretch', md: 'center' },
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    mb: { xs: 2, md: 0 },
                    mr: { xs: 0, md: 2 },
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: 2,
                    width: { xs: '100%', md: 'auto' },
                  }}
                  fullWidth={isMobile}
                >
                  {t('home.hero.becomeDonor')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/blood-donation-hero.jpg"
                alt="Blood Donation"
                sx={{
                  width: { xs: '90vw', sm: '100%' },
                  maxWidth: 400,
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: 6,
                  mx: { xs: 'auto', md: 0 },
                  display: 'block',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Blood Type Information Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          component="h2"
          align="center"
          fontWeight={700}
          sx={{ mb: 6, letterSpacing: -0.5, fontSize: { xs: 22, md: 36 } }}
        >
          {t('home.bloodTypes.title')}
        </Typography>
        <Grid container spacing={4}>
          {bloodTypeCompatibility.map((type) => (
            <Grid item xs={12} sm={6} md={3} key={type.type}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-8px) scale(1.03)' },
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h4" component="h3" align="center" color="primary" fontWeight={700} gutterBottom>
                    {type.type}
                  </Typography>
                  <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                    {type.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {t('home.bloodTypes.canReceive')}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {type.canReceive.join(', ')}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {t('home.bloodTypes.canDonateTo')}:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.canDonateTo.join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Information Cards Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          component="h2"
          align="center"
          fontWeight={700}
          sx={{ mb: 6, letterSpacing: -0.5, fontSize: { xs: 22, md: 36 } }}
        >
          {t('home.info.title')}
        </Typography>
        <Grid container spacing={4}>
          {bloodInfo.map((info) => (
            <Grid item xs={12} sm={6} md={3} key={info.title}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-8px) scale(1.03)' },
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{info.icon}</Box>
                  <Typography gutterBottom variant="h6" component="h3" fontWeight={600}>
                    {info.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: { xs: 14, md: 15 } }}>
                    {info.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Paper elevation={0} sx={{ bgcolor: 'grey.100', py: { xs: 4, md: 8 }, borderRadius: 0, mb: 0 }}>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h6' : 'h4'}
            component="h2"
            align="center"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: 18, md: 28 } }}
          >
            {t('home.cta.title')}
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ fontSize: { xs: 15, md: 20 } }}>
            {t('home.cta.subtitle')}
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: { xs: 3, md: 5 }, py: 1.5, fontWeight: 600, borderRadius: 3, boxShadow: 2, width: { xs: '100%', md: 'auto' } }}
              fullWidth={isMobile}
            >
              {t('home.cta.register')}
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 