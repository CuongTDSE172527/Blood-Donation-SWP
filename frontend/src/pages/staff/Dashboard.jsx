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
  Group,
  Assignment,
  Inventory,
} from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { staffService } from '../../services/staffService';

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

const StaffDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalInventory: 0,
    lowStock: 0,
  });
  const [recentDonors, setRecentDonors] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Lấy dữ liệu song song
        const [donorsRes, registrationsRes, requestsRes, inventoryRes] = await Promise.all([
          staffService.getAllDonors(),
          staffService.getPendingRegistrations(),
          staffService.getAllBloodRequests(),
          staffService.getBloodInventory()
        ]);
        // Merge donor info với registration info
        const donorsWithInfo = donorsRes.slice(0, 5).map(donor => {
          const reg = registrationsRes.find(r => r.user && (r.user.id === donor.id));
          return {
            ...donor,
            bloodType: reg?.bloodType || donor.bloodType,
            lastDonationDate: reg?.lastDonationDate || donor.lastDonationDate,
            status: reg?.status || donor.status,
          };
        });
        setRecentDonors(donorsWithInfo);
        setRecentRequests(requestsRes.slice(0, 5));
        const totalInventory = inventoryRes.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const lowStock = inventoryRes.filter(item => item.quantity < 10).length;
        const totalRequests = requestsRes.length;
        const pendingRequests = requestsRes.filter(r => r.status === 'PENDING').length;
        setStats({
          totalDonors: donorsRes.length,
          totalRequests,
          pendingRequests,
          totalInventory,
          lowStock,
        });
      } catch (err) {
        setError(t('common.error') || 'Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

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
          {t('staff.dashboardTitle') || 'Staff Dashboard'}
        </Typography>
        {loading ? (
          <Typography>{t('common.loading') || 'Loading...'}</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
        <>
        {/* Stats Overview */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Lặp qua các stats, dùng card gradient và hover */}
          {[
            { icon: <Bloodtype sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('staff.totalDonors'), value: stats.totalDonors },
            { icon: <LocalHospital sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('staff.totalRequests'), value: stats.totalRequests },
            { icon: <Notifications sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('staff.pendingRequests'), value: stats.pendingRequests },
            { icon: <Inventory sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, label: t('staff.totalInventory'), value: stats.totalInventory },
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
          {/* Lặp qua các quick actions, dùng card gradient và hover */}
          {[
            {
              icon: <Group sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('staff.donorManagement'), desc: t('staff.donorManagementDesc'), btn: t('staff.manageDonors'), onClick: () => navigate('/staff/donors')
            },
            {
              icon: <Assignment sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('staff.requestManagement'), desc: t('staff.requestManagementDesc'), btn: t('staff.manageRequests'), onClick: () => navigate('/staff/requests')
            },
            {
              icon: <Inventory sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('staff.inventory'), desc: t('staff.inventoryDesc'), btn: t('staff.manageInventory'), onClick: () => navigate('/staff/inventory')
            },
          ].map((action, idx) => (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, textAlign: 'center' }}>{action.title}</Typography>
                  <Typography variant="body2" color="#fff" paragraph sx={{ textAlign: 'center', opacity: 0.9 }}>
                    {action.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={action.onClick}
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
                    {action.btn}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Donors */}
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
                {t('staff.recentDonors')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('staff.name')}</TableCell>
                      <TableCell>{t('staff.bloodType')}</TableCell>
                      <TableCell>{t('staff.lastDonation')}</TableCell>
                      <TableCell>{t('staff.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDonors.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                    ) : recentDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>{donor.fullName || donor.name}</TableCell>
                        <TableCell>{donor.bloodType || '-'}</TableCell>
                        <TableCell>{donor.lastDonationDate || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`staff.status_${(donor.status || '').replace(/\s/g, '').toLowerCase()}`)}
                            color={donor.status === 'Eligible' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
                {t('staff.recentRequests')}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                      <TableCell>{t('staff.patient')}</TableCell>
                      <TableCell>{t('staff.bloodType')}</TableCell>
                      <TableCell>{t('staff.units')}</TableCell>
                      <TableCell>{t('staff.status')}</TableCell>
                      <TableCell>{t('staff.date')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRequests.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                ) : recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.patient || request.recipientName}</TableCell>
                    <TableCell>{request.recipientBloodType || request.bloodType}</TableCell>
                    <TableCell>{request.units || request.requestedAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`status_${(request.status || '').toUpperCase()}`)}
                        color={request.status === 'PRIORITY' ? 'error' : request.status === 'WAITING' ? 'info' : request.status === 'OUT_OF_STOCK' ? 'default' : 'warning'}
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
        </>
        )}
      </Container>
    </Box>
  );
};

export default StaffDashboard; 