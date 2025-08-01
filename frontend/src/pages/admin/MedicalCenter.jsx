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
  Chip,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete, Phone, Email, LocationOn } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { ROLE } from '../../constants/enums';

const MedicalCenter = () => {
  const { t } = useTranslation();
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editCenter, setEditCenter] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  // Load medical centers data
  useEffect(() => {
    loadMedicalCenters();
  }, []);

  const loadMedicalCenters = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMedicalCenters();
      setMedicalCenters(data);
    } catch (err) {
      setError(err.message || 'Failed to load medical centers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (center = null) => {
    setEditCenter(center);
    if (center) {
      setForm({
        fullName: center.fullName || '',
        email: center.email || '',
        phone: center.phone || '',
        address: center.address || '',
        password: ''
      });
    } else {
      setForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCenter(null);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      password: ''
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
      if (editCenter) {
        // Update existing medical center
        await adminService.updateMedicalCenter(editCenter.id, form);
        setMedicalCenters(medicalCenters.map(c => c.id === editCenter.id ? { ...c, ...form } : c));
      } else {
        // Create new medical center
        const newCenter = await adminService.createMedicalCenter(form);
        setMedicalCenters([...medicalCenters, newCenter]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save medical center');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete') || 'Are you sure you want to delete this medical center?')) {
      try {
        await adminService.deleteMedicalCenter(id);
        setMedicalCenters(medicalCenters.filter(c => c.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete medical center');
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
          {t('admin.medicalCenterManagement') || 'Medical Center Management'}
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
              {t('admin.addMedicalCenter') || 'Add Medical Center'}
            </Button>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.centerName') || 'Center Name'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.email') || 'Email'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.phone') || 'Phone'}
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
                  {medicalCenters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        {t('common.noData') || 'No medical centers found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    medicalCenters.map((center) => (
                      <TableRow key={center.id} hover>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {center.fullName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                            <Typography variant="body2">
                              {center.email || t('common.noEmail') || 'No email'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                            <Typography variant="body2">
                              {center.phone || t('common.noPhone') || 'No phone'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {center.address || t('common.noAddress') || 'No address'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpen(center)}
                            size="small"
                            sx={{ color: '#d32f2f' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(center.id)}
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
            {editCenter ? t('admin.editMedicalCenter') || 'Edit Medical Center' : t('admin.addMedicalCenter') || 'Add Medical Center'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                  {t('admin.medicalCenterInformation') || 'Medical Center Information'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  label={t('admin.centerName') || 'Center Name'}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  label={t('admin.email') || 'Email'}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  label={t('admin.phone') || 'Phone'}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  label={t('admin.password') || 'Password'}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required={!editCenter}
                  helperText={editCenter ? t('admin.passwordOptional') || 'Leave blank to keep current password' : ''}
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
              {editCenter ? t('admin.update') || 'Update' : t('admin.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MedicalCenter; 