import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Bloodtype as BloodIcon,
  LocalHospital as HospitalIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats] = useState({
    bloodType: 'O+',
    lastDonation: '2024-01-15',
    totalDonations: 5,
    nextEligibleDate: '2024-04-15',
  });

  const [recentRequests] = useState([
    {
      id: 1,
      bloodType: 'A+',
      units: 2,
      hospital: 'City General Hospital',
      status: 'Pending',
      date: '2024-02-20',
    },
    {
      id: 2,
      bloodType: 'O-',
      units: 1,
      hospital: 'Community Medical Center',
      status: 'Completed',
      date: '2024-02-15',
    },
  ]);

  const [upcomingDonations] = useState([
    {
      id: 1,
      date: '2024-03-15',
      location: 'Central Blood Bank',
      time: '10:00 AM',
    },
  ]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Your Dashboard
        </Typography>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Request Blood
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit a new blood request
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate('/blood-request')}
                >
                  Create Request
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emergency Request
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit an emergency blood request
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => navigate('/emergency')}
                >
                  Emergency Request
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Blood
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find available blood units
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => navigate('/blood-search')}
                >
                  Search Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your information
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Edit Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* User Stats */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <BloodIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Blood Type"
                    secondary={userStats.bloodType}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Donation"
                    secondary={userStats.lastDonation}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <BloodIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Donations"
                    secondary={userStats.totalDonations}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Next Eligible Donation"
                    secondary={userStats.nextEligibleDate}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Recent Requests */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Blood Requests
              </Typography>
              <List>
                {recentRequests.map((request) => (
                  <ListItem key={request.id}>
                    <ListItemIcon>
                      <HospitalIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${request.bloodType} - ${request.units} Units`}
                      secondary={`${request.hospital} - ${request.date}`}
                    />
                    <Typography
                      variant="body2"
                      color={request.status === 'Completed' ? 'success.main' : 'warning.main'}
                    >
                      {request.status}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Upcoming Donations */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Donations
              </Typography>
              <List>
                {upcomingDonations.map((donation) => (
                  <ListItem key={donation.id}>
                    <ListItemIcon>
                      <BloodIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={donation.location}
                      secondary={`${donation.date} at ${donation.time}`}
                    />
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 