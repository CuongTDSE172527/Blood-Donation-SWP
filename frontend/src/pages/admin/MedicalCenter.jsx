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
import { Add, Edit, Delete, LocationOn, Phone, Email } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { ROLE } from '../../constants/enums';

const MedicalCenter = () => {
  const { t } = useTranslation();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editCenter, setEditCenter] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    role: ROLE.MEDICAL_CENTER,
    password: '',
    centerName: '',
    centerAddress: '',
    centerPhone: '',
    centerEmail: '',
    capacity: '',
    status: 'Active'
  });

  // Load medical centers data
  useEffect(() => {
    loadMedicalCenters();
  }, []);

  const loadMedicalCenters = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMedicalCenters();
      setCenters(data);
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
        dob: center.dob || '',
        address: center.address || '',
        role: center.role || ROLE.MEDICAL_CENTER,
        password: '',
        centerName: center.centerName || '',
        centerAddress: center.centerAddress || '',
        centerPhone: center.centerPhone || '',
        centerEmail: center.centerEmail || '',
        capacity: center.capacity || '',
        status: center.status || 'Active'
      });
    } else {
      setForm({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
      address: '',
        role: ROLE.MEDICAL_CENTER,
        password: '',
        centerName: '',
        centerAddress: '',
        centerPhone: '',
        centerEmail: '',
      capacity: '',
      status: 'Active'
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
      dob: '',
      address: '',
      role: ROLE.MEDICAL_CENTER,
      password: '',
      centerName: '',
      centerAddress: '',
      centerPhone: '',
      centerEmail: '',
      capacity: '',
      status: 'Active'
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
        // Update existing medical center (without password)
        const { password, ...updateData } = form;
        await adminService.updateMedicalCenter(editCenter.id, updateData);
        setCenters(centers.map(c => c.id === editCenter.id ? { ...c, ...updateData } : c));
      } else {
        // Create new medical center with password
        const newCenter = await adminService.createMedicalCenter(form);
        setCenters([...centers, newCenter]);
      }
    handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save medical center');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteMedicalCenter(id);
      setCenters(centers.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete medical center');
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
                    {t('admin.managerName') || 'Manager Name'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('admin.contact') || 'Contact'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('admin.capacity') || 'Capacity'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('admin.status') || 'Status'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('admin.actions') || 'Actions'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {centers.map((center) => (
                  <TableRow key={center.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {center.centerName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {center.centerAddress}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {center.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {center.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Phone sx={{ fontSize: 14, color: '#666', mr: 1 }} />
                          <Typography variant="body2">
                            {center.centerPhone}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ fontSize: 14, color: '#666', mr: 1 }} />
                          <Typography variant="body2">
                            {center.centerEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {center.capacity} {t('admin.units') || 'units'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={center.status} 
                        color={center.status === 'Active' ? 'success' : 'warning'}
                        size="small"
                      />
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
                ))}
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
            {/* Manager Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                {t('admin.managerInformation') || 'Manager Information'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label={t('admin.fullName') || 'Full Name'}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label={t('admin.phone') || 'Phone'}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label={t('admin.dob') || 'Date of Birth'}
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
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
              />
            </Grid>
            {!editCenter && (
              <Grid item xs={12} sm={6}>
                <TextField 
                  margin="dense" 
                  label={t('admin.password') || 'Password'} 
                  name="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  fullWidth 
            required
          />
              </Grid>
            )}

            {/* Center Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#d32f2f' }}>
                {t('admin.centerInformation') || 'Center Information'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
                label={t('admin.centerName') || 'Center Name'}
                name="centerName"
                value={form.centerName}
            onChange={handleChange}
            fullWidth
            required
          />
            </Grid>
            <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
                label={t('admin.centerEmail') || 'Center Email'}
                name="centerEmail"
            type="email"
                value={form.centerEmail}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label={t('admin.centerPhone') || 'Center Phone'}
                name="centerPhone"
                value={form.centerPhone}
            onChange={handleChange}
            fullWidth
            required
          />
            </Grid>
            <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
                label={t('admin.capacity') || 'Capacity'}
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            fullWidth
            required
                inputProps={{ min: 0 }}
          />
            </Grid>
            <Grid item xs={12}>
          <TextField
            margin="dense"
                label={t('admin.centerAddress') || 'Center Address'}
                name="centerAddress"
                value={form.centerAddress}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>{t('admin.status') || 'Status'}</InputLabel>
                <Select
                  label={t('admin.status') || 'Status'}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
                  <MenuItem value="Active">{t('admin.status_active') || 'Active'}</MenuItem>
                  <MenuItem value="Maintenance">{t('admin.status_maintenance') || 'Maintenance'}</MenuItem>
                  <MenuItem value="Inactive">{t('admin.status_inactive') || 'Inactive'}</MenuItem>
                </Select>
              </FormControl>
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
  );
};

export default MedicalCenter; 