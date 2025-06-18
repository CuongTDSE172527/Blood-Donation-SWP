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
} from '@mui/icons-material';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats] = useState({
    totalUsers: 150,
    totalDonors: 75,
    totalStaff: 10,
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

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, textDecoration: 'underline', textUnderlineOffset: 8, color: '#d32f2f', letterSpacing: -1 }}
        >
          {t('admin.dashboardTitle')}
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.totalUsers')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bloodtype sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.totalDonors')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.totalDonors}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Group sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.totalStaff')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.totalStaff}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.totalRequests')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.totalRequests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.userManagement')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('admin.userManagementDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/admin/users')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('admin.manageUsers')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assignment sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.staffManagement')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('admin.staffManagementDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/admin/staff')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('admin.manageStaff')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.inventory')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('admin.inventoryDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/admin/inventory')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('admin.viewInventory')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Settings sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('admin.settings')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('admin.settingsDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/admin/settings')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('admin.systemSettings')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
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
                            label={t(`admin.status_${request.status.toLowerCase()}`)}
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
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 