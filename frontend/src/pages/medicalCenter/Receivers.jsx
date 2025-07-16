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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { medicalCenterService } from '../../services/medicalCenterService';
import { BLOOD_TYPES } from '../../constants/enums';
import { useAuth } from '../../hooks/useAuth';

export default function Receivers() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editReceiver, setEditReceiver] = useState(null);
  const [form, setForm] = useState({
    recipientName: '',
    recipientBloodType: '',
    requestedAmount: 0,
    urgencyLevel: 'NORMAL',
    medicalReason: '',
    notes: ''
  });

  // Load receivers data
  useEffect(() => {
    if (user?.id) {
      loadReceivers(user.id);
    }
  }, [user]);

  const loadReceivers = async (medicalCenterId) => {
    try {
      setLoading(true);
      const data = await medicalCenterService.getAllReceivers(medicalCenterId);
      setReceivers(data);
    } catch (err) {
      setError(err.message || 'Failed to load receivers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (receiver = null) => {
    setEditReceiver(receiver);
    if (receiver) {
      setForm({
        age: receiver.age || '',
        blood_type: receiver.blood_type || receiver.bloodType || '',
        height: receiver.height || '',
        name: receiver.name || '',
        weight: receiver.weight || ''
      });
    } else {
      setForm({
        age: '',
        blood_type: '',
        height: '',
        name: '',
        weight: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditReceiver(null);
    setForm({
      recipientName: '',
      recipientBloodType: '',
      requestedAmount: 0,
      urgencyLevel: 'NORMAL',
      medicalReason: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'requestedAmount') {
      setForm({ ...form, [name]: Math.max(0, parseInt(value) || 0) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      if (editReceiver) {
        // Update existing receiver
        await medicalCenterService.updateReceiver(editReceiver.id, form);
        setReceivers(receivers.map(r => r.id === editReceiver.id ? { ...r, ...form } : r));
      } else {
        // Create new receiver
        const newReceiver = await medicalCenterService.createReceiver(form);
        setReceivers([...receivers, newReceiver]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save receiver');
    }
  };

  const handleDelete = async (id) => {
    try {
      await medicalCenterService.deleteReceiver(id);
      setReceivers(receivers.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete receiver');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'NORMAL':
        return 'info';
      default:
        return 'default';
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
          {t('medicalCenter.receiverManagement') || 'Blood Receiver Management'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              sx={{ mb: 3, bgcolor: '#d32f2f' }} 
              onClick={() => handleOpen()}
            >
              {t('medicalCenter.addReceiver') || 'Add Receiver'}
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Blood Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Height</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('medicalCenter.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receivers.map((receiver) => (
                    <TableRow key={receiver.id}>
                      <TableCell>{receiver.id}</TableCell>
                      <TableCell>{receiver.age}</TableCell>
                      <TableCell>
                        <Chip 
                          label={receiver.blood_type || receiver.bloodType} 
                          color="primary" 
                          size="small" 
                          sx={{ bgcolor: '#d32f2f' }}
                        />
                      </TableCell>
                      <TableCell>{receiver.gender}</TableCell>
                      <TableCell>{receiver.height}</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{receiver.name}</TableCell>
                      <TableCell>{receiver.weight}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleOpen(receiver)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(receiver.id)}
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

        {/* Add/Edit Receiver Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editReceiver ? t('medicalCenter.editReceiver') || 'Edit Receiver' : t('medicalCenter.addReceiver') || 'Add Receiver'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Blood Type</InputLabel>
                  <Select
                    label="Blood Type"
                    name="blood_type"
                    value={form.blood_type || ''}
                    onChange={handleChange}
                  >
                    {BLOOD_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Height"
                  name="height"
                  type="number"
                  value={form.height || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Weight"
                  name="weight"
                  type="number"
                  value={form.weight || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Name"
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('medicalCenter.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
            >
              {editReceiver ? t('medicalCenter.save') || 'Save' : t('medicalCenter.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 