import { useState } from 'react';
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
import { completeBloodRequest } from '../../utils/testHelpers';

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
  const [stats] = useState({
    totalUsers: 150,
    totalDonors: 75,
    totalStaff: 10,
    totalMedicalCenters: 5,
    totalRequests: 45,
    pendingRequests: 12,
    totalInventory: 500,
    lowStock: 3,
  });

  const [recentUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'donor', joinDate: '2024-03-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'staff', joinDate: '2024-03-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', joinDate: '2024-03-13' },
  ]);

  const [recentRequests] = useState([
    { id: 1, patient: 'Sarah Wilson', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
    { id: 2, patient: 'Tom Brown', bloodType: 'O-', units: 1, status: 'Approved', date: '2024-03-19' },
    { id: 3, patient: 'Lisa Davis', bloodType: 'B+', units: 3, status: 'Pending', date: '2024-03-18' },
  ]);

  const [inventory, setInventory] = useState([
    { id: 1, bloodType: 'A+', units: 25 },
    { id: 2, bloodType: 'O-', units: 15 },
    { id: 3, bloodType: 'B+', units: 30 },
  ]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleComplete = (request) => {
    const { updatedRequests, updatedInventory, result } = completeBloodRequest(
      request,
      recentRequests,
      inventory,
      {
        insufficientMsg: 'Không đủ máu trong kho!',
        successMsg: 'Hoàn thành yêu cầu thành công!',
      }
    );
    setRecentRequests(updatedRequests);
    setInventory(updatedInventory);
    setSnackbar({ open: true, message: result.message, severity: result.severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
        {/* Stats Overview */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Lặp qua các stats, dùng card gradient và hover */}
          {[
            { icon: <People sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalUsers'), value: stats.totalUsers },
            { icon: <Bloodtype sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalDonors'), value: stats.totalDonors },
            { icon: <Group sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalStaff'), value: stats.totalStaff },
            { icon: <LocalHospital sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalMedicalCenters') || 'Total Medical Centers', value: stats.totalMedicalCenters },
            { icon: <Assignment sx={{ color: '#fff', mr: 1, fontSize: 32, transition: 'transform 0.2s' }} />, label: t('admin.totalRequests'), value: stats.totalRequests },
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
              icon: <People sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.userManagement'), desc: t('admin.userManagementDesc'), btn: t('admin.manageUsers'), onClick: () => navigate('/admin/users')
            },
            {
              icon: <Assignment sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.medicalCenterManagement') || 'Medical Center Management', desc: t('admin.medicalCenterManagementDesc') || 'Manage medical centers and their staff', btn: t('admin.manageMedicalCenters') || 'Manage Medical Centers', onClick: () => navigate('/admin/staff')
            },
            {
              icon: <Inventory sx={{ color: '#fff', mr: 1, fontSize: 32 }} />, title: t('admin.inventory'), desc: t('admin.inventoryDesc'), btn: t('admin.viewInventory'), onClick: () => navigate('/admin/inventory')
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
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`admin.role_${user.role}`)}
                            color={
                              user.role === 'admin'
                                ? 'error'
                                : user.role === 'staff'
                                ? 'warning'
                                : user.role === 'donor'
                                ? 'success'
                                : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
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
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.patient}</TableCell>
                    <TableCell>{request.bloodType}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      <Chip
                        label={t('admin.status_' + request.status.toLowerCase())}
                        color={request.status === 'Approved' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell align="right">
                      {(request.status === 'Approved' || request.status === 'Pending') && (
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