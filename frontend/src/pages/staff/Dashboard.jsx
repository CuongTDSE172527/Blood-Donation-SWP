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
                        label={t('staff.status_' + request.status.toLowerCase())}
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