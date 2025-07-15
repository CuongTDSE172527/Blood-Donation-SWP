import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
  Chip, 
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
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { staffService } from '../../services/staffService';
import { BLOOD_TYPES } from '../../constants/enums';

export default function Donors() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    medications: ''
  });

  // Load donors data
  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllDonors();
      setDonors(data);
    } catch (err) {
      setError(err.message || 'Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (donor = null) => {
    setEditDonor(donor);
    if (donor) {
      setForm({
        fullName: donor.fullName || '',
        email: donor.email || '',
        phone: donor.phone || '',
        dob: donor.dob || '',
        bloodType: donor.bloodType || '',
        address: donor.address || '',
        emergencyContact: donor.emergencyContact || '',
        medicalHistory: donor.medicalHistory || '',
        allergies: donor.allergies || '',
        medications: donor.medications || ''
      });
    } else {
      setForm({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        bloodType: '',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        allergies: '',
        medications: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditDonor(null);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      bloodType: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      medications: ''
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editDonor) {
        // Update existing donor
        await staffService.updateDonor(editDonor.id, form);
        setDonors(donors.map(d => d.id === editDonor.id ? { ...d, ...form } : d));
      } else {
        // Add new donor
        const newDonor = await staffService.createDonor(form);
        setDonors([...donors, newDonor]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save donor');
    }
  };

  const handleDelete = async (id) => {
    try {
      await staffService.deleteDonor(id);
      setDonors(donors.filter(d => d.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete donor');
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
          {t('staff.donorManagement') || 'Donor Management'}
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
              {t('staff.addDonor') || 'Add Donor'}
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.name') || 'Name'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.email') || 'Email'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.phone') || 'Phone'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.bloodType') || 'Blood Type'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.dob') || 'Date of Birth'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {t('staff.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {donor.fullName}
                      </TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>{donor.phone}</TableCell>
                      <TableCell>
                        <Chip 
                          label={donor.bloodType} 
                          color="primary" 
                          size="small" 
                          sx={{ bgcolor: '#d32f2f' }}
                        />
                      </TableCell>
                      <TableCell>{donor.dob}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleOpen(donor)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(donor.id)}
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

        {/* Add/Edit Donor Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editDonor ? t('staff.editDonor') || 'Edit Donor' : t('staff.addDonor') || 'Add Donor'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('staff.fullName') || 'Full Name'}
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
                  label={t('staff.email') || 'Email'}
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
                  label={t('staff.phone') || 'Phone'}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('staff.dob') || 'Date of Birth'}
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('staff.bloodType') || 'Blood Type'}</InputLabel>
                  <Select
                    label={t('staff.bloodType') || 'Blood Type'}
                    name="bloodType"
                    value={form.bloodType}
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
                  label={t('staff.emergencyContact') || 'Emergency Contact'}
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('staff.address') || 'Address'}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('staff.medicalHistory') || 'Medical History'}
                  name="medicalHistory"
                  value={form.medicalHistory}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('staff.allergies') || 'Allergies'}
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('staff.medications') || 'Current Medications'}
                  name="medications"
                  value={form.medications}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('staff.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
            >
              {editDonor ? t('staff.save') || 'Save' : t('staff.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 