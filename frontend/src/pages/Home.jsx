import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  LocalHospital,
  Search,
  HowToReg,
} from '@mui/icons-material';

const features = [
  {
    title: 'Request Blood',
    description: 'Submit a blood request and connect with compatible donors quickly and securely.',
    icon: <LocalHospital sx={{ fontSize: 48 }} />,
    path: '/blood-request',
    color: 'primary.main',
  },
  {
    title: 'Search Blood',
    description: 'Find available blood units and compatible donors in your area in real time.',
    icon: <Search sx={{ fontSize: 48 }} />,
    path: '/blood-search',
    color: 'success.main',
  },
  {
    title: 'Become a Donor',
    description: 'Register as a blood donor and help save lives in your community.',
    icon: <HowToReg sx={{ fontSize: 48 }} />,
    path: '/register',
    color: 'secondary.main',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          borderRadius: 4,
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
                Donate Blood, Save Lives
              </Typography>
              <Typography variant="h6" paragraph sx={{ opacity: 0.9, fontSize: { xs: 16, md: 22 } }}>
                Join our modern blood donation network. Fast, safe, and community-driven.
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
                  Become a Donor
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/blood-request')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 3,
                    borderWidth: 2,
                    width: { xs: '100%', md: 'auto' },
                  }}
                  fullWidth={isMobile}
                >
                  Request Blood
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

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          component="h2"
          align="center"
          fontWeight={700}
          sx={{ mb: 6, letterSpacing: -0.5, fontSize: { xs: 22, md: 36 } }}
        >
          What Can You Do?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-8px) scale(1.03)' },
                    boxShadow: 8,
                  },
                  p: { xs: 2, md: 2 },
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 0 }}>
                  <Typography gutterBottom variant="h6" component="h3" fontWeight={600} sx={{ fontSize: { xs: 17, md: 20 } }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph sx={{ fontSize: { xs: 14, md: 15 }, minHeight: { xs: 0, md: 60 } }}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate(feature.path)}
                  sx={{ fontWeight: 600, mt: 1, width: { xs: '100%', md: 'auto' } }}
                  fullWidth={isMobile}
                >
                  Learn More
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Paper elevation={0} sx={{ bgcolor: 'grey.100', py: { xs: 4, md: 8 }, borderRadius: 4, mb: 0 }}>
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? 'h6' : 'h4'}
            component="h2"
            align="center"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: 18, md: 28 } }}
          >
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ fontSize: { xs: 15, md: 20 } }}>
            Join our community of blood donors and help save lives in your area.
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
              Register Now
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 