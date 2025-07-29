import { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People,
  LocalHospital,
  Bloodtype,
  Settings,
  Notifications,
  Edit,
  CalendarToday,
  LocationOn,
  Group,
  Assignment,
  Inventory,
  CheckCircle,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

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

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalStaff: 0,
    totalMedicalCenters: 0,
    totalRequests: 0,
    totalSchedules: 0,
    pendingRequests: 0,
    totalInventory: 0,
    lowStock: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Loading dashboard data...');
        // Fetch all data in parallel
        const [usersRes, donorsRes, staffRes, medicalCentersRes, requestsRes, inventoryRes, schedulesRes] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getDonors(),
          adminService.getStaffs(),
          adminService.getMedicalCenters(),
          adminService.getAllBloodRequests(),
          adminService.getBloodInventory(),
          adminService.getAllSchedules()
        ]);
        
        console.log('Dashboard data loaded:', {
          users: usersRes.length,
          donors: donorsRes.length,
          staff: staffRes.length,
          medicalCenters: medicalCentersRes.length,
          requests: requestsRes.length,
          inventory: inventoryRes.length,
          schedules: schedulesRes.length
        });

        // Calculate stats
        const totalRequests = requestsRes.length;
        const totalSchedules = schedulesRes.length;
        const pendingRequests = requestsRes.filter(r => r.status === 'PENDING').length;
        const totalInventory = inventoryRes.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const lowStock = inventoryRes.filter(item => item.quantity < 10).length;

        setStats({
          totalUsers: usersRes.length,
          totalDonors: donorsRes.length,
          totalStaff: staffRes.length,
          totalMedicalCenters: medicalCentersRes.length,
          totalRequests,
          totalSchedules,
          pendingRequests,
          totalInventory,
          lowStock,
        });

        setRecentUsers(usersRes.slice(0, 5));
        setRecentRequests(requestsRes.slice(0, 5));
        setInventory(inventoryRes.slice(0, 5));
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message || t('common.error') || 'Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleComplete = async (request) => {
    try {
      // Confirm request and deduct from inventory
      await adminService.confirmBloodRequest(request.id);
      
      // Update local state
      setRecentRequests(prev => prev.map(r => 
        r.id === request.id ? { ...r, status: 'WAITING' } : r
      ));
      
      // Reload inventory to reflect the deduction
      const updatedInventory = await adminService.getBloodInventory();
      setInventory(updatedInventory.slice(0, 5));
      
      setSnackbar({ 
        open: true, 
        message: t('admin.completeRequestSuccess') || 'Request confirmed successfully!', 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to confirm request', 
        severity: 'error' 
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          {t('admin.dashboardTitle') || 'Admin Dashboard'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Stats Overview */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* First row: Users, Donors, Staff, Medical Centers */}
          {[
            { icon: <People sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalUsers'), value: stats.totalUsers },
            { icon: <Bloodtype sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalDonors'), value: stats.totalDonors },
            { icon: <Group sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalStaff'), value: stats.totalStaff },
            { icon: <LocalHospital sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalMedicalCenters') || 'Total Medical Centers', value: stats.totalMedicalCenters },
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
        
        {/* Second row: Requests and Schedules (centered) */}
        <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center' }}>
          {[
            { icon: <Assignment sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalRequests'), value: stats.totalRequests },
            { icon: <CalendarToday sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalSchedules') || 'Total Schedules', value: stats.totalSchedules },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={`center-${idx}`}>
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
              icon: <People sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.userManagement'), desc: t('admin.userManagementDesc'), btn: t('admin.manageUsers'), onClick: () => navigate('/admin/users')
            },
            {
              icon: <Assignment sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.medicalCenterManagement') || 'Medical Center Management', desc: t('admin.medicalCenterManagementDesc') || 'Manage medical centers and their staff', btn: t('admin.manageMedicalCenters') || 'Manage Medical Centers', onClick: () => navigate('/admin/medical-center')
            },
            {
              icon: <Inventory sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.inventory'), desc: t('admin.inventoryDesc'), btn: t('admin.viewInventory'), onClick: () => navigate('/admin/inventory')
            },
            {
              icon: <CalendarToday sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.scheduleManagement') || 'Schedule Management', desc: t('admin.scheduleManagementDesc') || 'Manage donation schedules', btn: t('admin.manageSchedules') || 'Manage Schedules', onClick: () => navigate('/admin/schedule')
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

        {/* Recent Users */}
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
                {t('admin.recentUsers')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('admin.name')}</TableCell>
                      <TableCell>{t('admin.email')}</TableCell>
                      <TableCell>{t('admin.role')}</TableCell>
                      <TableCell>{t('admin.joinDate')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                    ) : recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.fullName || user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`admin.role_${(user.role || '').toLowerCase()}`) || user.role}
                            color={
                              user.role === 'admin'
                                ? 'error'
                                : user.role === 'staff'
                                ? 'warning'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{user.createdAt || user.joinDate}</TableCell>
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
                {t('admin.recentRequests')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('admin.patient')}</TableCell>
                      <TableCell>{t('admin.bloodType')}</TableCell>
                      <TableCell>{t('admin.units')}</TableCell>
                      <TableCell>{t('admin.status')}</TableCell>
                      <TableCell>{t('admin.date')}</TableCell>
                      <TableCell align="right">{t('admin.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRequests.length === 0 ? (
                      <TableRow><TableCell colSpan={6} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                    ) : recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.recipientName || request.patient}</TableCell>
                        <TableCell>{request.recipientBloodType || request.bloodType}</TableCell>
                        <TableCell>{request.requestedAmount || request.units}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`status_${(request.status || '').toUpperCase()}`)}
                            color={request.status === 'PRIORITY' ? 'error' : request.status === 'WAITING' ? 'info' : request.status === 'OUT_OF_STOCK' ? 'default' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{request.requestDate || request.date}</TableCell>
                        <TableCell align="right">
                          {(request.status === 'WAITING' || request.status === 'PENDING') && (
                            <Button
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleComplete(request)}
                              sx={{ minWidth: 0, px: 1 }}
                            >
                              {t('admin.complete') || 'Hoàn thành'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 