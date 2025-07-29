import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, LocationOn } from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const Locations = () => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editLocation, setEditLocation] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: ''
  });

  // Load locations data
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllLocations();
      setLocations(data);
    } catch (err) {
      setError(err.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (location = null) => {
    setEditLocation(location);
    if (location) {
      setForm({
        name: location.name || '',
        address: location.address || ''
      });
    } else {
      setForm({
        name: '',
        address: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditLocation(null);
    setForm({
      name: '',
      address: ''
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editLocation) {
        // Update existing location
        await adminService.updateLocation(editLocation.id, form);
        setLocations(locations.map(l => l.id === editLocation.id ? { ...l, ...form } : l));
      } else {
        // Create new location
        const newLocation = await adminService.createLocation(form);
        setLocations([...locations, newLocation]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save location');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete') || 'Are you sure you want to delete this location?')) {
      try {
        await adminService.deleteLocation(id);
        setLocations(locations.filter(l => l.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete location');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
          {t('admin.locationManagement') || 'Location Management'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              sx={{ mb: 2, bgcolor: '#d32f2f' }} 
              onClick={() => handleOpen()}
            >
              {t('admin.addLocation') || 'Add Location'}
            </Button>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.locationName') || 'Location Name'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.address') || 'Address'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        {t('common.noData') || 'No locations found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map((location) => (
                      <TableRow key={location.id} hover>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {location.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {location.address}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpen(location)}
                            size="small"
                            sx={{ color: '#d32f2f' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(location.id)}
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

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editLocation ? t('admin.editLocation') || 'Edit Location' : t('admin.addLocation') || 'Add Location'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                  {t('admin.locationInformation') || 'Location Information'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('admin.locationName') || 'Location Name'}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('admin.address') || 'Address'}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('admin.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
            >
              {editLocation ? t('admin.update') || 'Update' : t('admin.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Locations; 