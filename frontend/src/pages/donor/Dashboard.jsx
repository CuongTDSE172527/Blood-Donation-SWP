import { useSelector } from 'react-redux';
import axios from 'axios';
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
import { Edit, CalendarToday, History, Favorite, Wc, Cake } from '@mui/icons-material';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/donor/history?userId=${user.id}`);
        setDonationHistory(res.data);
      } catch (err) {
        setError(t('common.error') || 'Error loading donation history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, t]);

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
                    alt={user?.name || ''}
                    src={user?.avatar}
                  >
                    {user?.name?.charAt(0) || ''}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('donor.bloodType')}: {user?.bloodType}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Cake fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.dob') || 'Date of Birth'}: <b>{user?.dob}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Wc fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.gender') || 'Gender'}: <b>{user?.gender}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <History fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.totalDonations')}: <b>{user?.totalDonations}</b>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('donor.lastDonation')}: <b>{user?.lastDonation}</b>
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
                      <TableCell>{t('donor.location')}</TableCell>
                      <TableCell>{t('donor.units')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {donationHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">{t('common.noData') || 'No data'}</TableCell>
                      </TableRow>
                    ) : donationHistory.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.date}</TableCell>
                        <TableCell>{donation.location?.name || donation.location}</TableCell>
                        <TableCell>{donation.units || donation.amount}</TableCell>
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