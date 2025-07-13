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
  Chip
} from '@mui/material';
import { Add, Edit, Delete, LocationOn, Phone, Email } from '@mui/icons-material';

const MedicalCenter = () => {
  const { t } = useTranslation();
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

  // Mock data for medical centers
  const [centers] = useState([
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
    },
    {
      id: 3,
      name: 'South Blood Center',
      address: '789 South Road, District 7',
      phone: '+84 555 123 456',
      email: 'south@bloodcenter.com',
      capacity: 60,
      status: 'Maintenance',
      staffCount: 8
    }
  ]);

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
    // Handle form submission here
    console.log('Medical Center form submitted:', form);
    handleClose();
  };

  const handleDelete = (id) => {
    // Handle delete here
    console.log('Delete medical center:', id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
        Medical Center Management
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            sx={{ mb: 2, bgcolor: '#d32f2f' }} 
            onClick={() => handleOpen()}
          >
            Add Medical Center
          </Button>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>Capacity</strong></TableCell>
                  <TableCell><strong>Staff</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
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
          {editCenter ? 'Edit Medical Center' : 'Add Medical Center'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Center Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Address"
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
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Capacity (units)"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            select
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#d32f2f' }}>
            {editCenter ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalCenter; 