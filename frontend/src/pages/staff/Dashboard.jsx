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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  LocalHospital,
  Bloodtype,
  Search,
  Edit,
  CheckCircle,
  Cancel,
  Visibility,
} from '@mui/icons-material';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [recentRequests] = useState([
    { id: 1, patient: 'John Doe', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
    { id: 2, patient: 'Jane Smith', bloodType: 'O-', units: 3, status: 'Approved', date: '2024-03-19' },
    { id: 3, patient: 'Mike Johnson', bloodType: 'B+', units: 1, status: 'Completed', date: '2024-03-18' },
  ]);

  const [stats] = useState({
    pendingRequests: 8,
    approvedRequests: 4,
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
  });

  const handleApprove = (requestId) => {
    // TODO: Implement approval logic
    console.log('Approving request:', requestId);
  };

  const handleReject = (requestId) => {
    // TODO: Implement rejection logic
    console.log('Rejecting request:', requestId);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Dashboard
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospital sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Typography variant="h6">Pending Requests</Typography>
                </Box>
                <Typography variant="h4">{stats.pendingRequests}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/staff/requests/pending')}>
                  View Pending
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Typography variant="h6">Approved Requests</Typography>
                </Box>
                <Typography variant="h4">{stats.approvedRequests}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/staff/requests/approved')}>
                  View Approved
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bloodtype sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                  <Typography variant="h6">Blood Inventory</Typography>
                </Box>
                <Typography variant="h4">
                  {Object.values(stats.bloodInventory).reduce((a, b) => a + b, 0)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/staff/inventory')}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search requests by patient name, ID, or blood type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

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
                      <IconButton size="small" onClick={() => navigate(`/staff/requests/${request.id}`)}>
                        <Visibility />
                      </IconButton>
                      {request.status === 'Pending' && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleReject(request.id)}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
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
                  Emergency Requests
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  View and manage emergency blood requests
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/staff/emergency')}>
                  View Emergency Requests
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Donor Management
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Manage donor information and donation history
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate('/staff/donors')}>
                  Manage Donors
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StaffDashboard; 