import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  Bloodtype as BloodtypeIcon,
  LocalHospital as LocalHospitalIcon,
  Warning as EmergencyIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const MedicalCenterDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const [stats, setStats] = useState({
    activeRequests: 0,
    availableBlood: 0,
    emergencyCases: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Lấy danh sách requests của medical center
        const requestsRes = await axios.get(`/api/medicalcenter/blood-requests?medicalCenterId=${user.id}`);
        setRecentRequests(requestsRes.data.slice(0, 5));
        // Tính toán stats
        const activeRequests = requestsRes.data.filter(r => r.status === 'PENDING' || r.status === 'APPROVED').length;
        // Nếu có API lấy availableBlood, emergencyCases thì fetch, nếu không thì để 0
        setStats({
          activeRequests,
          availableBlood: 0,
          emergencyCases: 0,
        });
      } catch (err) {
        setError(t('common.error') || 'Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user, t]);

  const quickActions = [
    {
      title: t('medicalCenter.manageReceivers') || 'Manage Receivers',
      description: t('medicalCenter.manageReceiversDesc') || 'Manage blood recipients information',
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: '#fff' }} />, // đổi sang trắng
      path: '/medical-center/receivers',
    },
    {
      title: t('medicalCenter.manageRequests') || 'Manage Requests',
      description: t('medicalCenter.manageRequestsDesc') || 'View and process blood requests',
      icon: <BloodtypeIcon sx={{ fontSize: 40, color: '#fff' }} />, // đổi sang trắng
      path: '/medical-center/requests',
    },
  ];

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

  return (
    <Container maxWidth="lg" sx={{ animation: 'fadeInDash 0.7s', bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <style>{`
        @keyframes fadeInDash { from { opacity: 0; transform: translateY(32px);} to { opacity: 1; transform: none; } }
      `}</style>
      <Typography
        variant="h3"
        sx={{ mb: 4, background: cardGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, textAlign: 'center', textShadow: '0 2px 8px rgba(211,47,47,0.08)' }}
      >
        {t('medicalCenter.dashboardTitle') || 'Medical Center Dashboard'}
      </Typography>
      {loading ? (
        <Typography>{t('common.loading') || 'Loading...'}</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
      <>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Lặp qua các stats, dùng card gradient và hover */}
        {[
          { icon: <BloodtypeIcon sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('medicalCenter.activeRequests') || 'Active Requests', value: stats.activeRequests },
          { icon: <LocalHospitalIcon sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('medicalCenter.availableBlood') || 'Available Blood', value: stats.availableBlood },
          { icon: <EmergencyIcon sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('medicalCenter.emergencyCases') || 'Emergency Cases', value: stats.emergencyCases },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                borderRadius: cardRadius,
                boxShadow: cardShadow,
                background: cardGradient,
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
                '&:hover': cardHover,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>{stat.label}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: cardGradient, borderRadius: 3, height: '100%', color: '#fff', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(.4,2,.6,1)', '&:hover': cardHover }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#fff', opacity: 0.9 }}>
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(action.path)}
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
                  {isAdmin ? (t('medicalCenter.manage') || 'Manage') : (t('medicalCenter.view') || 'View')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
                {t('medicalCenter.recentRequests') || 'Recent Blood Requests'}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('medicalCenter.patient') || 'Patient'}</TableCell>
                      <TableCell>{t('medicalCenter.bloodType') || 'Blood Type'}</TableCell>
                      <TableCell>{t('medicalCenter.status') || 'Status'}</TableCell>
                      <TableCell>{t('medicalCenter.date') || 'Date'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRequests.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                    ) : recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.patient || request.recipientName}</TableCell>
                        <TableCell>{request.bloodType || request.recipientBloodType}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`medicalCenter.status_${(request.status || '').toLowerCase()}`) || request.status}
                            color={request.status === 'Completed' ? 'success' : request.status === 'Approved' ? 'primary' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{request.date || request.requestDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </>
      )}
    </Container>
  );
};

export default MedicalCenterDashboard; 