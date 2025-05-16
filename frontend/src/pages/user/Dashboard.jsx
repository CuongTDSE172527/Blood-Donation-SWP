import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/icons-material';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'John Doe',
    bloodType: 'A+',
    lastDonation: '2024-02-15',
    nextEligibleDate: '2024-08-15',
    totalDonations: 5,
    avatar: null,
  });

  const [donationHistory] = useState([
    { id: 1, date: '2024-02-15', location: 'City Hospital', units: 1 },
    { id: 2, date: '2023-08-15', location: 'Community Center', units: 1 },
    { id: 3, date: '2023-02-15', location: 'City Hospital', units: 1 },
  ]);

  const [activeRequests] = useState([
    { id: 1, patient: 'Jane Smith', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
    { id: 2, patient: 'Mike Johnson', bloodType: 'A+', units: 1, status: 'Approved', date: '2024-03-19' },
  ]);

  const calculateNextDonation = () => {
    const lastDonation = new Date(user.lastDonation);
    const nextDonation = new Date(lastDonation);
    nextDonation.setMonth(nextDonation.getMonth() + 6);
    return nextDonation;
  };

  const nextDonation = calculateNextDonation();
  const today = new Date();
  const daysUntilNextDonation = Math.ceil((nextDonation - today) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, ((180 - daysUntilNextDonation) / 180) * 100));

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* User Profile Summary */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                src={user.avatar}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="h6">{user.name}</Typography>
              <Chip
                icon={<Bloodtype />}
                label={`Blood Type: ${user.bloodType}`}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Next Donation Eligibility
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ flexGrow: 1, mr: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {daysUntilNextDonation > 0
                      ? `${daysUntilNextDonation} days until next donation`
                      : 'Eligible to donate now!'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Donation Statistics
                  </Typography>
                  <Typography variant="body1">
                    Total Donations: {user.totalDonations}
                  </Typography>
                  <Typography variant="body1">
                    Last Donation: {user.lastDonation}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bloodtype sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                  <Typography variant="h6">Donate Blood</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Schedule your next blood donation
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/donate')}
                  disabled={daysUntilNextDonation > 0}
                >
                  Schedule Donation
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6">Request Blood</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Submit a blood request
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/blood-request')}>
                  Create Request
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <History sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Typography variant="h6">Donation History</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View your donation records
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/donation-history')}>
                  View History
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Edit sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Typography variant="h6">Update Profile</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage your information
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/profile')}>
                  Edit Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Active Requests */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Active Requests
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Blood Type</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.patient}</TableCell>
                    <TableCell>{request.bloodType}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
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
        </Paper>

        {/* Donation History */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Donations
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Units</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donationHistory.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.date}</TableCell>
                    <TableCell>{donation.location}</TableCell>
                    <TableCell>{donation.units}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserDashboard; 