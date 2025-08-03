import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Bloodtype,
  LocalHospital,
  History,
  Notifications,
  Edit,
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Nếu có API activeRequests thì fetch, nếu không thì để trống
  const [activeRequests, setActiveRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

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

  // Nếu có API activeRequests thì fetch ở đây
  // useEffect(() => { ... }, [user]);

  // Tính toán ngày hiến máu tiếp theo nếu có lastDonation
  const calculateNextDonation = () => {
    if (!user?.lastDonation) return null;
    const lastDonation = new Date(user.lastDonation);
    const nextDonation = new Date(lastDonation);
    nextDonation.setMonth(nextDonation.getMonth() + 6);
    return nextDonation;
  };

  const nextDonation = calculateNextDonation();
  const today = new Date();
  const daysUntilNextDonation = nextDonation ? Math.ceil((nextDonation - today) / (1000 * 60 * 60 * 24)) : null;
  const progress = daysUntilNextDonation !== null ? Math.min(100, Math.max(0, ((180 - daysUntilNextDonation) / 180) * 100)) : 0;

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, textDecoration: 'underline', textUnderlineOffset: 8, color: '#d32f2f', letterSpacing: -1 }}
        >
          {t('user.dashboardTitle')}
        </Typography>
        <Grid container spacing={4}>
          {/* Profile Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ width: 80, height: 80, bgcolor: '#d32f2f', mr: 2 }}
                    alt={user?.name || ''}
                    src={user?.avatar}
                  >
                    {user?.name?.charAt(0) || ''}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('user.bloodType')}: {user?.bloodType}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('user.nextDonationEligibility')}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(211,47,47,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#d32f2f',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {daysUntilNextDonation !== null
                      ? t('user.daysUntilNextDonation', { days: daysUntilNextDonation })
                      : t('user.noDonationRecord')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <History sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('user.totalDonations')}: {user?.totalDonations}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('user.lastDonation')}: {user?.lastDonation}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<Edit />}
                  onClick={() => navigate('/user/profile')}
                  sx={{ color: '#d32f2f' }}
                >
                  {t('user.editProfile')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {/* Donation History */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
                  {t('user.donationHistory')}
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
                          <TableCell>{t('user.date')}</TableCell>
                          <TableCell>{t('user.location')}</TableCell>
                          <TableCell>{t('user.units')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {donationHistory.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">{t('common.noData') || 'No data'}</TableCell>
                          </TableRow>
                        ) : donationHistory.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell>
                              {donation.registeredAt ? 
                                new Date(donation.registeredAt).toLocaleDateString('vi-VN') : 
                                donation.date || 'N/A'
                              }
                            </TableCell>
                            <TableCell>{donation.location?.name || donation.location || 'N/A'}</TableCell>
                            <TableCell>{donation.amount || donation.units || 'N/A'} ml</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Active Requests */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
                  {t('user.activeRequests')}
                </Typography>
                {/* Nếu có API activeRequests thì render bảng, nếu không thì thông báo */}
                {loadingRequests ? (
                  <Typography>{t('common.loading') || 'Loading...'}</Typography>
                ) : activeRequests.length === 0 ? (
                  <Typography color="text.secondary">{t('user.noActiveRequests') || 'No active requests'}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('user.patient')}</TableCell>
                          <TableCell>{t('user.bloodType')}</TableCell>
                          <TableCell>{t('user.units')}</TableCell>
                          <TableCell>{t('user.status')}</TableCell>
                          <TableCell>{t('user.date')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.patient}</TableCell>
                            <TableCell>{request.bloodType}</TableCell>
                            <TableCell>{request.units}</TableCell>
                            <TableCell>
                              <Chip
                                label={t('user.status_' + request.status?.toLowerCase())}
                                color={request.status === 'Approved' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{request.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Bloodtype sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="h6">{t('user.donateBlood')}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('user.scheduleDonationDesc')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/user/donate')}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('user.scheduleNow')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalHospital sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="h6">{t('user.requestBlood')}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('user.requestBloodDesc')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/blood-request')}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('user.makeRequest')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <History sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="h6">{t('user.history')}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('user.viewDonationHistoryDesc')}
          </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/user/donation-history')}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('user.viewHistory')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Notifications sx={{ color: '#d32f2f', mr: 1 }} />
                      <Typography variant="h6">{t('user.notifications')}</Typography>
      </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t('user.checkNotificationsDesc')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/user/notifications')}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#b71c1c',
                        },
                      }}
                    >
                      {t('user.viewAll')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    </Container>
    </Box>
  );
};

export default UserDashboard; 