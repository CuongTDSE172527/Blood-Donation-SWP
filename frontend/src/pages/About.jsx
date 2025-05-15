import { Box, Container, Typography } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Blood Donation System
        </Typography>
        <Typography variant="body1" paragraph>
          Our Blood Donation System is dedicated to connecting blood donors with those in need,
          making the process of blood donation and request more efficient and accessible.
        </Typography>
        <Typography variant="body1" paragraph>
          We believe that every person should have access to safe and timely blood transfusions
          when needed. Our platform facilitates this by bringing together donors, recipients,
          and healthcare facilities in a seamless network.
        </Typography>
      </Box>
    </Container>
  );
};

export default About; 