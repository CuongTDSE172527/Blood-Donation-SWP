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
} from '@mui/material';
import { Edit, CalendarToday, History } from '@mui/icons-material';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

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
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, textDecoration: 'underline', textUnderlineOffset: 8, color: '#d32f2f', letterSpacing: -1 }}
        >
          {t('donor.dashboardTitle')}
        </Typography>
        <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: '#d32f2f', mr: 2 }}
                alt={user.name}
                src={user.avatar}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('donor.bloodType')}: {user.bloodType}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <History sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {t('donor.totalDonations')}: {user.totalDonations}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {t('donor.lastDonation')}: {user.lastDonation}
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              startIcon={<Edit />}
              onClick={() => navigate('/donor/profile')}
              sx={{ color: '#d32f2f' }}
            >
              {t('donor.editProfile')}
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
              {t('donor.donationHistory')}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('donor.date')}</TableCell>
                    <TableCell>{t('donor.location')}</TableCell>
                    <TableCell>{t('donor.units')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donationHistory.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{donation.date}</TableCell>
                      <TableCell>{donation.location}</TableCell>
                      <TableCell>{donation.units}</TableCell>
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