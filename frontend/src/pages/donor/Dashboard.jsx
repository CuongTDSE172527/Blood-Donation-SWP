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
import { Edit, CalendarToday, History, Favorite, Wc, Cake, Phone, Email, LocationOn, Person, Bloodtype } from '@mui/icons-material';
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
          donorService.getProfile(user.email)
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
  const lastDonation = donationHistory.length > 0 ? 
    (donationHistory[0]?.registeredAt ? 
      new Date(donationHistory[0].registeredAt).toLocaleDateString('vi-VN') : 
      donationHistory[0]?.date || 'N/A'
    ) : 'N/A';
  const bloodType = donationHistory.length > 0 ? donationHistory[0]?.bloodType || 'N/A' : (displayUser?.bloodType || 'N/A');
  
  // Calculate total blood donated in ml
  const totalBloodDonated = donationHistory.reduce((total, donation) => {
    const amount = donation.amount || donation.units || 0;
    return total + amount;
  }, 0);

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
                    {t('donor.gender') || 'Gender'}: <b>
                      {displayUser?.gender === 'MALE' ? t('common.male') || 'Male' :
                       displayUser?.gender === 'FEMALE' ? t('common.female') || 'Female' :
                       displayUser?.gender === 'OTHER' ? t('common.other') || 'Other' :
                       displayUser?.gender || 'N/A'}
                    </b>
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
                    {t('donor.role') || 'Role'}: <b>
                      {displayUser?.role === 'DONOR' ? t('common.role_donor') || 'Donor' :
                       displayUser?.role === 'STAFF' ? t('common.role_staff') || 'Staff' :
                       displayUser?.role === 'ADMIN' ? t('common.role_admin') || 'Admin' :
                       displayUser?.role === 'MEDICALCENTER' ? t('common.role_medicalcenter') || 'Medical Center' :
                       displayUser?.role || 'N/A'}
                    </b>
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
            {/* Total Blood Donated Card */}
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow, bgcolor: '#fff5f5', color: 'primary.main', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bloodtype sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>{t('donor.totalBloodDonated')}</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700, textAlign: 'center', mb: 1 }}>
                  {totalBloodDonated} ml
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {t('donor.totalDonations')}: {totalDonations}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {t('donor.lastDonation')}: {lastDonation}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/donation-registration')}
                  sx={{ 
                    borderColor: 'primary.main', 
                    color: 'primary.main', 
                    fontWeight: 600, 
                    borderRadius: 2, 
                    px: 3, 
                    '&:hover': { 
                      bgcolor: 'primary.main', 
                      color: '#fff',
                      borderColor: 'primary.main'
                    } 
                  }}
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
                        <TableCell>
                          {donation.registeredAt ? 
                            new Date(donation.registeredAt).toLocaleDateString('vi-VN') : 
                            donation.date || donation.createdAt || 'N/A'
                          }
                        </TableCell>
                        <TableCell>{donation.bloodType || 'N/A'}</TableCell>
                        <TableCell>{donation.location?.name || donation.location || 'N/A'}</TableCell>
                        <TableCell>{donation.amount || donation.units || 'N/A'} ml</TableCell>
                        <TableCell>
                          {donation.status ? 
                            t(`donor.status_${donation.status.toLowerCase()}`) || donation.status : 
                            'N/A'
                          }
                        </TableCell>
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