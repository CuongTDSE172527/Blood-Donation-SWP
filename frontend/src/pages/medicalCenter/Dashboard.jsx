import { useState } from 'react';
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

const MedicalCenterDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const [stats] = useState({
    totalDonors: 156,
    activeRequests: 23,
    availableBlood: 89,
    emergencyCases: 5,
  });

  const [recentRequests] = useState([
    { id: 1, patient: 'Nguyễn Văn A', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
    { id: 2, patient: 'Trần Thị B', bloodType: 'O-', units: 1, status: 'Approved', date: '2024-03-19' },
    { id: 3, patient: 'Lê Văn C', bloodType: 'B+', units: 3, status: 'Completed', date: '2024-03-18' },
  ]);

  const [recentDonors] = useState([
    { id: 1, name: 'Phạm Thị D', bloodType: 'A+', lastDonation: '2024-03-15', status: 'Eligible' },
    { id: 2, name: 'Hoàng Văn E', bloodType: 'O+', lastDonation: '2024-03-10', status: 'Eligible' },
    { id: 3, name: 'Vũ Thị F', bloodType: 'B-', lastDonation: '2024-02-28', status: 'Not Eligible' },
  ]);

  const quickActions = [
    {
      title: t('medicalCenter.manageDonors') || 'Manage Donors',
      description: t('medicalCenter.manageDonorsDesc') || 'View and manage donor information',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      path: '/medical-center/donors',
      color: '#fff5f5',
    },
    {
      title: t('medicalCenter.manageReceivers') || 'Manage Receivers',
      description: t('medicalCenter.manageReceiversDesc') || 'Manage blood recipients information',
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      path: '/medical-center/receivers',
      color: '#fff5f5',
    },
    {
      title: t('medicalCenter.manageRequests') || 'Manage Requests',
      description: t('medicalCenter.manageRequestsDesc') || 'Handle blood requests and approvals',
      icon: <BloodtypeIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      path: '/medical-center/requests',
      color: '#fff5f5',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        sx={{ mb: 4, color: '#d32f2f', fontWeight: 700, textAlign: 'center' }}
      >
        {t('medicalCenter.dashboardTitle') || 'Medical Center Dashboard'}
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff5f5', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('medicalCenter.totalDonors') || 'Total Donors'}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                {stats.totalDonors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff5f5', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BloodtypeIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('medicalCenter.activeRequests') || 'Active Requests'}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                {stats.activeRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff5f5', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalHospitalIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('medicalCenter.availableBlood') || 'Available Blood'}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                {stats.availableBlood}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff5f5', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmergencyIcon sx={{ color: '#d32f2f', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('medicalCenter.emergencyCases') || 'Emergency Cases'}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                {stats.emergencyCases}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: action.color, borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
              </CardContent>
                             <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                 <Button
                   variant="contained"
                   startIcon={<VisibilityIcon />}
                   onClick={() => navigate(action.path)}
                   sx={{
                     bgcolor: '#d32f2f',
                     '&:hover': { bgcolor: '#b71c1c' },
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
                    {recentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.patient}</TableCell>
                        <TableCell>{request.bloodType}</TableCell>
                        <TableCell>
                          <Chip
                            label={t(`medicalCenter.status_${request.status.toLowerCase()}`) || request.status}
                            color={request.status === 'Completed' ? 'success' : request.status === 'Approved' ? 'primary' : 'warning'}
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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
                {t('medicalCenter.recentDonors') || 'Recent Donors'}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('medicalCenter.name') || 'Name'}</TableCell>
                      <TableCell>{t('medicalCenter.bloodType') || 'Blood Type'}</TableCell>
                      <TableCell>{t('medicalCenter.lastDonation') || 'Last Donation'}</TableCell>
                      <TableCell>{t('medicalCenter.status') || 'Status'}</TableCell>
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
                            label={t(`medicalCenter.status_${donor.status.toLowerCase().replace(' ', '')}`) || donor.status}
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
      </Grid>
    </Container>
  );
};

export default MedicalCenterDashboard; 