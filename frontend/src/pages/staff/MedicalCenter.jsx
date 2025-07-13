import { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid
} from '@mui/material';
import { Add, Edit, Delete, LocationOn, Phone, Email, LocalHospital } from '@mui/icons-material';

const mockMedicalCenters = [
  {
    id: 1,
    name: 'Central Blood Bank',
    address: '123 Main Street, City Center',
    phone: '+84 123 456 789',
    email: 'central@bloodbank.com',
    capacity: 100,
    status: 'Active',
    staffCount: 15
  },
  {
    id: 2,
    name: 'North Medical Center',
    address: '456 North Avenue, District 1',
    phone: '+84 987 654 321',
    email: 'north@medical.com',
    capacity: 80,
    status: 'Active',
    staffCount: 12
  }
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MedicalCenter = () => {
  const { t } = useTranslation();
  const [centers, setCenters] = useState(mockMedicalCenters);
  const [open, setOpen] = useState(false);
  const [editCenter, setEditCenter] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    capacity: '',
    status: 'Active'
  });

  const handleOpen = (center = null) => {
    setEditCenter(center);
    setForm(center ? { ...center } : {
      name: '',
      address: '',
      phone: '',
      email: '',
      capacity: '',
      status: 'Active'
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCenter(null);
    setForm({
      name: '',
      address: '',
      phone: '',
      email: '',
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

  const handleSubmit = () => {
    if (editCenter) {
      setCenters(centers.map(c => c.id === editCenter.id ? { ...form, id: editCenter.id, staffCount: editCenter.staffCount } : c));
    } else {
      setCenters([...centers, { ...form, id: centers.length + 1, staffCount: 0 }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setCenters(centers.filter(c => c.id !== id));
  };

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
          {t('staff.medicalCenterManagement') || 'Medical Center Management'}
        </Typography>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              sx={{ mb: 2, bgcolor: '#d32f2f' }} 
              onClick={() => handleOpen()}
            >
              {t('staff.addMedicalCenter') || 'Add Medical Center'}
            </Button>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>{t('staff.centerName') || 'Name'}</strong></TableCell>
                    <TableCell><strong>{t('staff.address') || 'Address'}</strong></TableCell>
                    <TableCell><strong>{t('staff.contact') || 'Contact'}</strong></TableCell>
                    <TableCell><strong>{t('staff.capacity') || 'Capacity'}</strong></TableCell>
                    <TableCell><strong>{t('staff.staff') || 'Staff'}</strong></TableCell>
                    <TableCell><strong>{t('staff.status') || 'Status'}</strong></TableCell>
                    <TableCell><strong>{t('staff.actions') || 'Actions'}</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centers.map((center) => (
                    <TableRow key={center.id} hover>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {center.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                          {center.address}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Phone sx={{ fontSize: 14, color: '#666', mr: 1 }} />
                            {center.phone}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Email sx={{ fontSize: 14, color: '#666', mr: 1 }} />
                            {center.email}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{center.capacity} units</TableCell>
                      <TableCell>{center.staffCount} staff</TableCell>
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

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editCenter ? (t('staff.editMedicalCenter') || 'Edit Medical Center') : (t('staff.addMedicalCenter') || 'Add Medical Center')}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label={t('staff.centerName') || 'Center Name'}
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label={t('staff.address') || 'Address'}
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              required
            />
            <TextField
              margin="dense"
              label={t('staff.phone') || 'Phone'}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label={t('staff.email') || 'Email'}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label={t('staff.capacity') || 'Capacity (units)'}
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('staff.status') || 'Status'}</InputLabel>
              <Select
                label={t('staff.status') || 'Status'}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="Active">{t('staff.status_active') || 'Active'}</MenuItem>
                <MenuItem value="Maintenance">{t('staff.status_maintenance') || 'Maintenance'}</MenuItem>
                <MenuItem value="Inactive">{t('staff.status_inactive') || 'Inactive'}</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('staff.cancel') || 'Cancel'}</Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#d32f2f' }}>
              {editCenter ? (t('staff.save') || 'Save') : (t('staff.add') || 'Add')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MedicalCenter; 