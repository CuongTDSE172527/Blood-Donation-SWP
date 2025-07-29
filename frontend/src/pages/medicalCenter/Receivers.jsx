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
    name: '',
    age: '',
    bloodType: '',
    gender: '',
    height: '',
    weight: ''
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
        bloodType: receiver.bloodType || '',
        gender: receiver.gender || '',
        height: receiver.height || '',
        name: receiver.name || '',
        weight: receiver.weight || ''
      });
    } else {
      setForm({
        age: '',
        bloodType: '',
        gender: '',
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
      name: '',
      age: '',
      bloodType: '',
      gender: '',
      height: '',
      weight: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age' || name === 'height' || name === 'weight') {
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
        const newReceiver = await medicalCenterService.createReceiver(form, user.id);
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
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.id') || 'ID'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.age') || 'Age'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.bloodType') || 'Blood Type'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.gender') || 'Gender'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.height') || 'Height'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.name') || 'Name'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.weight') || 'Weight'}</TableCell>
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
                          label={receiver.bloodType} 
                          color="primary" 
                          size="small" 
                          sx={{ bgcolor: '#d32f2f' }}
                        />
                      </TableCell>
                      <TableCell>
                        {receiver.gender === 'MALE' ? t('common.male') || 'Male' :
                         receiver.gender === 'FEMALE' ? t('common.female') || 'Female' :
                         receiver.gender === 'OTHER' ? t('common.other') || 'Other' :
                         receiver.gender}
                      </TableCell>
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
                  label={t('medicalCenter.age') || 'Age'}
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
                  <InputLabel>{t('medicalCenter.bloodType') || 'Blood Type'}</InputLabel>
                  <Select
                    label={t('medicalCenter.bloodType') || 'Blood Type'}
                    name="bloodType"
                    value={form.bloodType || ''}
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
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('medicalCenter.gender') || 'Gender'}</InputLabel>
                  <Select
                    label={t('medicalCenter.gender') || 'Gender'}
                    name="gender"
                    value={form.gender || ''}
                    onChange={handleChange}
                  >
                    <MenuItem value="MALE">{t('common.male') || 'Male'}</MenuItem>
                    <MenuItem value="FEMALE">{t('common.female') || 'Female'}</MenuItem>
                    <MenuItem value="OTHER">{t('common.other') || 'Other'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('medicalCenter.height') || 'Height'}
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
                  label={t('medicalCenter.weight') || 'Weight'}
                  name="weight"
                  type="number"
                  value={form.weight || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('medicalCenter.name') || 'Name'}
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