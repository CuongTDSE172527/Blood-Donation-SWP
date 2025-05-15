import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  LocalHospital,
  Search,
  Warning,
  HowToReg,
} from '@mui/icons-material';

const features = [
  {
    title: 'Request Blood',
    description: 'Submit a blood request for your needs. Our system will help you find compatible donors quickly.',
    icon: <LocalHospital sx={{ fontSize: 40 }} />,
    path: '/blood-request',
  },
  {
    title: 'Search Blood',
    description: 'Find available blood units and compatible donors in your area.',
    icon: <Search sx={{ fontSize: 40 }} />,
    path: '/blood-search',
  },
  {
    title: 'Emergency',
    description: 'Urgent blood requirements? Submit an emergency request for immediate assistance.',
    icon: <Warning sx={{ fontSize: 40 }} />,
    path: '/emergency',
  },
  {
    title: 'Become a Donor',
    description: 'Register as a blood donor and help save lives in your community.',
    icon: <HowToReg sx={{ fontSize: 40 }} />,
    path: '/register',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Save Lives Through Blood Donation
              </Typography>
              <Typography variant="h5" paragraph>
                Join our community of blood donors and help those in need. Every donation counts.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  Become a Donor
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/blood-request')}
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
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          How We Help
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate(feature.path)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mt: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Join our community of blood donors and help save lives in your area.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Register Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 