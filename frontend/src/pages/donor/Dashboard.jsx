import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import { Edit, CalendarToday, History, Favorite } from '@mui/icons-material';

const sectionBg = 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;
const cardGradient = 'linear-gradient(90deg, #d32f2f 60%, #ff7961 100%)';
const cardHover = {
  boxShadow: '0 8px 32px 0 rgba(211,47,47,0.18)',
  transform: 'scale(1.035)',
  background: 'linear-gradient(90deg, #b71c1c 60%, #ff7961 100%)',
  transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
};

const DonorDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Donor User',
    bloodType: 'O-',
    lastDonation: '2024-01-10',
    totalDonations: 8,
    avatar: null,
  });

  const [donationHistory] = useState([
    { id: 1, date: '2024-01-10', location: 'Central Hospital', units: 1 },
    { id: 2, date: '2023-07-10', location: 'Community Center', units: 1 },
  ]);

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6, animation: 'fadeInDash 0.7s' }}>
      <style>{`
        @keyframes fadeInDash { from { opacity: 0; transform: translateY(32px);} to { opacity: 1; transform: none; } }
      `}</style>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, background: cardGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1, textShadow: '0 2px 8px rgba(211,47,47,0.08)' }}
        >
          {t('donor.dashboardTitle')}
        </Typography>
        
        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, background: cardGradient, color: '#fff', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Favorite sx={{ color: '#fff', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{t('donor.registerDonation')}</Typography>
                </Box>
                <Typography variant="body2" color="#fff" paragraph>
                  {t('donor.registerDonationDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/donation-registration')}
                  sx={{
                    bgcolor: '#fff',
                    color: '#d32f2f',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    boxShadow: '0 2px 8px 0 rgba(211,47,47,0.10)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#ff7961', color: '#fff' },
                  }}
                >
                  {t('donor.registerNow')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Profile Card */}
        <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, mb: 4, background: cardGradient, color: '#fff', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: '#fff', color: '#d32f2f', mr: 2, fontWeight: 700 }}
                alt={user.name}
                src={user.avatar}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                  {t('donor.bloodType')}: {user.bloodType}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <History sx={{ color: '#fff', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                {t('donor.totalDonations')}: {user.totalDonations}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ color: '#fff', mr: 1 }} />
              <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                {t('donor.lastDonation')}: {user.lastDonation}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              startIcon={<Edit />}
              onClick={() => navigate('/donor/profile')}
              sx={{ color: '#fff', fontWeight: 700, '&:hover': { color: '#ff7961' } }}
            >
              {t('donor.editProfile')}
            </Button>
          </CardActions>
        </Card>
        {/* Donation History Card */}
        <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, background: cardGradient, color: '#fff', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
              {t('donor.donationHistory')}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{t('donor.date')}</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{t('donor.location')}</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{t('donor.units')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donationHistory.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell sx={{ color: '#fff' }}>{donation.date}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{donation.location}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{donation.units}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DonorDashboard; 