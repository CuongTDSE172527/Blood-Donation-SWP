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
  IconButton,
  Chip,
} from '@mui/material';
import {
  People,
  LocalHospital,
  Bloodtype,
  Notifications,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [recentRequests] = useState([
    { id: 1, patient: 'John Doe', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
    { id: 2, patient: 'Jane Smith', bloodType: 'O-', units: 3, status: 'Approved', date: '2024-03-19' },
    { id: 3, patient: 'Mike Johnson', bloodType: 'B+', units: 1, status: 'Completed', date: '2024-03-18' },
  ]);

  const [stats] = useState({
    totalDonors: 150,
    activeRequests: 12,
    bloodInventory: {
      'A+': 25,
      'A-': 15,
      'B+': 30,
      'B-': 20,
      'AB+': 10,
      'AB-': 5,
      'O+': 40,
      'O-': 20,
    },
    pendingApprovals: 5,
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6">Total Donors</Typography>
                </Box>
                <Typography variant="h4">{stats.totalDonors}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/donors')}>
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                  <Typography variant="h6">Active Requests</Typography>
                </Box>
                <Typography variant="h4">{stats.activeRequests}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/requests')}>
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bloodtype sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Typography variant="h6">Blood Inventory</Typography>
                </Box>
                <Typography variant="h4">
                  {Object.values(stats.bloodInventory).reduce((a, b) => a + b, 0)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/inventory')}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notifications sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Typography variant="h6">Pending Approvals</Typography>
                </Box>
                <Typography variant="h4">{stats.pendingApprovals}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/approvals')}>
                  Review
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Blood Requests */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Blood Requests
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.patient}</TableCell>
                    <TableCell>{request.bloodType}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={
                          request.status === 'Completed'
                            ? 'success'
                            : request.status === 'Approved'
                            ? 'primary'
                            : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => navigate(`/admin/requests/${request.id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" onClick={() => navigate(`/admin/requests/${request.id}/edit`)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Staff Management
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage staff accounts, roles, and permissions
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/staff')}>
                  Manage Staff
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Configure system parameters and notifications
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/admin/settings')}>
                  Settings
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 