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

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

const StaffDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats] = useState({
    totalDonors: 75,
    totalRequests: 45,
    pendingRequests: 12,
    totalInventory: 500,
    lowStock: 3,
  });

  const [recentDonors] = useState([
    { id: 1, name: 'John Doe', bloodType: 'A+', lastDonation: '2024-02-15', status: 'Eligible' },
    { id: 2, name: 'Jane Smith', bloodType: 'O-', lastDonation: '2024-01-20', status: 'Eligible' },
    { id: 3, name: 'Mike Johnson', bloodType: 'B+', lastDonation: '2023-12-10', status: 'Not Eligible' },
  ]);

  const [recentRequests] = useState([
    { id: 1, patient: 'Sarah Wilson', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
    { id: 2, patient: 'Tom Brown', bloodType: 'O-', units: 1, status: 'Approved', date: '2024-03-19' },
    { id: 3, patient: 'Lisa Davis', bloodType: 'B+', units: 3, status: 'Pending', date: '2024-03-18' },
  ]);

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Stats Overview */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bloodtype sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.totalDonors')}</Typography>
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
                  <LocalHospital sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.totalRequests')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.totalRequests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notifications sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.pendingRequests')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.pendingRequests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.totalInventory')}</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  {stats.totalInventory}
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
                  <Group sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.donorManagement')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('staff.donorManagementDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/staff/donors')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('staff.manageDonors')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assignment sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.requestManagement')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('staff.requestManagementDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/staff/requests')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('staff.manageRequests')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.inventory')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('staff.inventoryDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/staff/inventory')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('staff.viewInventory')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: cardRadius, boxShadow: cardShadow }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ color: '#d32f2f', mr: 1 }} />
                  <Typography variant="h6">{t('staff.emergency')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('staff.emergencyDesc')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/staff/emergency')}
                  sx={{
                    bgcolor: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#b71c1c',
                    },
                  }}
                >
                  {t('staff.emergencyRequests')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
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
                    {recentDonors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell>{donor.name}</TableCell>
                        <TableCell>{donor.bloodType}</TableCell>
                        <TableCell>{donor.lastDonation}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`staff.status_${donor.status.replace(/\s/g, '').toLowerCase()}`)}
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
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.patient}</TableCell>
                    <TableCell>{request.bloodType}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      <Chip
                            label={t(`staff.status_${request.status.toLowerCase()}`)}
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

export default StaffDashboard; 