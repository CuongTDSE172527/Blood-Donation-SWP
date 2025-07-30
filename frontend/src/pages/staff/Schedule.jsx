import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  LocationOn,
  Schedule,
  People,
  Visibility,
  Person,
  Email,
  Phone,
  Bloodtype,
} from '@mui/icons-material';
import { staffService } from '../../services/staffService';

const ScheduleManagement = () => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openRegistrationsDialog, setOpenRegistrationsDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching schedules...');
      const schedulesRes = await staffService.getAllSchedules();
      console.log('Schedules response:', schedulesRes);
      setSchedules(schedulesRes);
      
      // Try to get locations, but don't fail if it doesn't work
      try {
        const locationsRes = await staffService.getAllLocations();
        setLocations(locationsRes);
      } catch (locationErr) {
        console.warn('Could not load locations:', locationErr);
        setLocations([]);
      }
    } catch (err) {
      console.error('Error loading schedules:', err);
      setError(err.message || 'Error loading schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        date: schedule.date || '',
        time: schedule.time || '',
        location: schedule.location || null,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        date: '',
        time: '',
        location: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
    setFormData({
      date: '',
      time: '',
      location: null,
    });
  };

  const handleViewRegistrations = async (schedule) => {
    try {
      if (!schedule || !schedule.id) {
        throw new Error('Invalid schedule data');
      }
      
      setSelectedSchedule(schedule);
      setLoadingRegistrations(true);
      setOpenRegistrationsDialog(true);
      
      const registrationsData = await staffService.getDonorsBySchedule(schedule.id);
      setRegistrations(registrationsData);
    } catch (err) {
      console.error('Error loading registrations:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'Error loading registrations', 
        severity: 'error' 
      });
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleCloseRegistrationsDialog = () => {
    setOpenRegistrationsDialog(false);
    setSelectedSchedule(null);
    setRegistrations([]);
  };

  const handleSubmit = async () => {
    try {
      if (editingSchedule) {
        await staffService.updateSchedule(editingSchedule.id, formData);
        setSnackbar({ open: true, message: 'Schedule updated successfully!', severity: 'success' });
      } else {
        await staffService.createSchedule(formData);
        setSnackbar({ open: true, message: 'Schedule created successfully!', severity: 'success' });
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Error saving schedule', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await staffService.deleteSchedule(id);
        setSnackbar({ open: true, message: 'Schedule deleted successfully!', severity: 'success' });
        fetchData();
      } catch (err) {
        setSnackbar({ open: true, message: err.message || 'Error deleting schedule', severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const getRegistrationStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%)',
      minHeight: '100vh', 
      py: 4 
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#d32f2f', fontWeight: 700 }}>
            {t('staff.scheduleManagement') || 'Schedule Management'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' },
            }}
          >
            {t('staff.createSchedule') || 'Create Schedule'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {schedules.length === 0 && !loading && !error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No schedules found. Create your first donation schedule to get started.
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>{t('staff.date') || 'Date'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('staff.time') || 'Time'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('staff.location') || 'Location'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('staff.registrations') || 'Registrations'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('staff.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        {t('common.noData') || 'No schedules found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    schedules.map((schedule) => (
                      <TableRow key={schedule.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, color: '#d32f2f' }} />
                            {new Date(schedule.date).toLocaleDateString()}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Schedule sx={{ mr: 1, color: '#d32f2f' }} />
                            {schedule.time}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ mr: 1, color: '#d32f2f' }} />
                            {schedule.location?.name || 'N/A'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View registrations">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewRegistrations(schedule)}
                              size="small"
                            >
                              <Badge badgeContent={schedule.registrationCount || 0} color="secondary">
                                <People />
                              </Badge>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(schedule)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(schedule.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingSchedule ? t('staff.editSchedule') || 'Edit Schedule' : t('staff.createSchedule') || 'Create Schedule'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('staff.date') || 'Date'}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label={t('staff.time') || 'Time'}
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>{t('staff.location') || 'Location'}</InputLabel>
                <Select
                  value={formData.location?.id || ''}
                  onChange={(e) => {
                    const selectedLocation = locations.find(loc => loc.id === e.target.value);
                    setFormData({ ...formData, location: selectedLocation });
                  }}
                  label={t('staff.location') || 'Location'}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
            >
              {editingSchedule ? t('common.update') || 'Update' : t('common.create') || 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Registrations Dialog */}
        <Dialog 
          open={openRegistrationsDialog} 
          onClose={handleCloseRegistrationsDialog} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ color: '#d32f2f' }} />
              <Typography variant="h6">
                Registrations for {selectedSchedule && new Date(selectedSchedule.date).toLocaleDateString()} at {selectedSchedule?.time}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {loadingRegistrations ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : registrations.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No registrations found for this schedule.
              </Alert>
            ) : (
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {registrations.map((registration, index) => (
                  <Box key={registration.id || index}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#d32f2f' }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {registration.user?.fullName || registration.donorName || 'Unknown'}
                            </Typography>
                            <Chip 
                              label={registration.status || 'Pending'} 
                              color={getRegistrationStatusColor(registration.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {registration.user?.email || registration.email || 'No email'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {registration.user?.phone || registration.phone || 'No phone'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Bloodtype sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Blood Type: {registration.user?.bloodType || registration.bloodType || 'Unknown'}
                              </Typography>
                            </Box>
                            {registration.registrationDate && (
                              <Typography variant="body2" color="text.secondary">
                                Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < registrations.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRegistrationsDialog}>
              {t('common.close') || 'Close'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ScheduleManagement; 