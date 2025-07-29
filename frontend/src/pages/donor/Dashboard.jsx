import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
  Avatar,
  Grid,
  Divider,
  Stack,
} from '@mui/material';
import { Edit, CalendarToday, History, Favorite, Wc, Cake, Phone, Email, LocationOn, Person } from '@mui/icons-material';
import { donorService } from '../../services/donorService';

const cardRadius = 3;
const cardShadow = '0 2px 8px 0 rgba(0,0,0,0.04)';
const cardHover = {
  boxShadow: '0 4px 16px 0 rgba(211,47,47,0.10)',
  transform: 'translateY(-2px) scale(1.01)',
  transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
};

const DonorDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [donationHistory, setDonationHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError('');
      try {
        const [historyData, profileData] = await Promise.all([
          donorService.getDonationHistory(user.id),
          donorService.getProfile()
        ]);
        setDonationHistory(historyData);
        setUserDetails(profileData);
      } catch (err) {
        setError(t('common.error') || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, t]);

  // Use userDetails if available, otherwise fall back to user from Redux
  const displayUser = userDetails || user;

  // Calculate total donations and last donation from history
  const totalDonations = donationHistory.length;
  const lastDonation = donationHistory.length > 0 ? donationHistory[0]?.date || 'N/A' : 'N/A';
  const bloodType = donationHistory.length > 0 ? donationHistory[0]?.bloodType || 'N/A' : (displayUser?.bloodType || 'N/A');

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, color: 'primary.main', letterSpacing: -1 }}
        >
          {t('donor.dashboardTitle')}
        </Typography>
        {/* Profile & Quick Action Side by Side */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            {/* Profile Card */}
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, bgcolor: '#fafbfc', color: 'text.primary', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ width: 80, height: 80, bgcolor: 'primary.light', color: 'primary.main', mr: 2, fontWeight: 700 }}
                    alt={displayUser?.fullName || ''}
                    src={displayUser?.avatar}
                  >
                    {displayUser?.fullName?.charAt(0) || ''}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                      {displayUser?.fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('donor.bloodType')}: {bloodType}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Cake fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.dob') || 'Date of Birth'}: <b>{displayUser?.dob || 'N/A'}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Wc fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.gender') || 'Gender'}: <b>{displayUser?.gender || 'N/A'}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.phone') || 'Phone'}: <b>{displayUser?.phone || 'N/A'}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.email') || 'Email'}: <b>{displayUser?.email || 'N/A'}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.address') || 'Address'}: <b>{displayUser?.address || 'N/A'}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.role') || 'Role'}: <b>{displayUser?.role || 'N/A'}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <History fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.totalDonations')}: <b>{totalDonations}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.lastDonation')}: <b>{lastDonation}</b>
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<Edit />}
                  onClick={() => navigate('/donor/profile')}
                  sx={{ color: 'primary.main', fontWeight: 700, '&:hover': { color: 'primary.dark' } }}
                >
                  {t('donor.editProfile')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Quick Action Card */}
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, bgcolor: '#f5f6fa', color: 'primary.main', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Favorite sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>{t('donor.registerDonation')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('donor.registerDonationDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/donation-registration')}
                  sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, boxShadow: 'none', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  {t('donor.registerNow')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        {/* Donation History Card */}
        <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, bgcolor: '#fafbfc', color: 'text.primary', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              {t('donor.donationHistory')}
            </Typography>
            {loading ? (
              <Typography>{t('common.loading') || 'Loading...'}</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('donor.date')}</TableCell>
                      <TableCell>{t('donor.bloodType')}</TableCell>
                      <TableCell>{t('donor.location')}</TableCell>
                      <TableCell>{t('donor.units')}</TableCell>
                      <TableCell>{t('donor.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donationHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">{t('donor.noDonationRecord') || 'No donation record'}</TableCell>
                      </TableRow>
                    ) : donationHistory.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.date || donation.createdAt}</TableCell>
                        <TableCell>{donation.bloodType || 'N/A'}</TableCell>
                        <TableCell>{donation.location?.name || donation.location || 'N/A'}</TableCell>
                        <TableCell>{donation.units || donation.amount || 'N/A'}</TableCell>
                        <TableCell>{donation.status || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DonorDashboard; 