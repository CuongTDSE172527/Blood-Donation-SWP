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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CalendarToday,
  LocationOn,
  Schedule,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const ScheduleManagement = () => {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    locationId: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const schedulesRes = await adminService.getAllSchedules();
      setSchedules(schedulesRes);
      
      // Try to get locations, but don't fail if it doesn't work
      try {
        const locationsRes = await adminService.getAllLocations();
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
        locationId: schedule.location?.id || '',
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        date: '',
        time: '',
        locationId: '',
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
      locationId: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingSchedule) {
        await adminService.updateSchedule(editingSchedule.id, formData);
        setSnackbar({ open: true, message: 'Schedule updated successfully!', severity: 'success' });
      } else {
        await adminService.createSchedule(formData);
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
        await adminService.deleteSchedule(id);
        setSnackbar({ open: true, message: 'Schedule deleted successfully!', severity: 'success' });
        fetchData();
      } catch (err) {
        setSnackbar({ open: true, message: err.message || 'Error deleting schedule', severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
            {t('admin.scheduleManagement') || 'Schedule Management'}
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
            {t('admin.createSchedule') || 'Create Schedule'}
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
                    <TableCell sx={{ fontWeight: 600 }}>{t('admin.date') || 'Date'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('admin.time') || 'Time'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('admin.location') || 'Location'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('admin.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
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
            {editingSchedule ? t('admin.editSchedule') || 'Edit Schedule' : t('admin.createSchedule') || 'Create Schedule'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('admin.date') || 'Date'}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label={t('admin.time') || 'Time'}
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>{t('admin.location') || 'Location'}</InputLabel>
                <Select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  label={t('admin.location') || 'Location'}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
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