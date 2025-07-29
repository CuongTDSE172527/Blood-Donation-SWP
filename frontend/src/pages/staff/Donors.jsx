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
import { Add, Edit, Delete, Search, FilterList } from '@mui/icons-material';
import { staffService } from '../../services/staffService';
import { BLOOD_TYPES } from '../../constants/enums';

export default function Donors() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
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
    medications: '',
    password: '' // Add password field for new donors
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load donors data
  useEffect(() => {
    loadDonors();
  }, []);

  // Filter and sort donors when data changes
  useEffect(() => {
    filterAndSortDonors();
  }, [donors, searchTerm, bloodTypeFilter, sortBy, sortOrder]);

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

  const filterAndSortDonors = () => {
    let filtered = [...donors];

    // Apply blood type filter
    if (bloodTypeFilter !== 'ALL') {
      filtered = filtered.filter(donor => donor.bloodType === bloodTypeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(donor => 
        (donor.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donor.phone || '').includes(searchTerm) ||
        (donor.id?.toString() || '').includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = (a.fullName || '').toLowerCase();
          bValue = (b.fullName || '').toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'phone':
          aValue = (a.phone || '').toLowerCase();
          bValue = (b.phone || '').toLowerCase();
          break;
        case 'bloodType':
          aValue = (a.bloodType || '').toLowerCase();
          bValue = (b.bloodType || '').toLowerCase();
          break;
        case 'dob':
          aValue = new Date(a.dob || 0);
          bValue = new Date(b.dob || 0);
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDonors(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBloodTypeFilterChange = (event) => {
    setBloodTypeFilter(event.target.value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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
        medications: '',
        password: '' // Reset password field for new donor
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditDonor(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editDonor) {
        await staffService.updateDonor(editDonor.id, form);
        setDonors(donors.map(d => d.id === editDonor.id ? { ...d, ...form } : d));
      } else {
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

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('staff.search') || 'Search donors...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  placeholder={t('staff.searchPlaceholder') || 'Search by name, email, phone, or ID...'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('staff.filterByBloodType') || 'Filter by Blood Type'}</InputLabel>
                  <Select
                    value={bloodTypeFilter}
                    onChange={handleBloodTypeFilterChange}
                    label={t('staff.filterByBloodType') || 'Filter by Blood Type'}
                  >
                    <MenuItem value="ALL">{t('staff.allBloodTypes') || 'All Blood Types'}</MenuItem>
                    {BLOOD_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('staff.sortBy') || 'Sort By'}</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    label={t('staff.sortBy') || 'Sort By'}
                  >
                    <MenuItem value="name">{t('staff.name') || 'Name'}</MenuItem>
                    <MenuItem value="email">{t('staff.email') || 'Email'}</MenuItem>
                    <MenuItem value="phone">{t('staff.phone') || 'Phone'}</MenuItem>
                    <MenuItem value="bloodType">{t('staff.bloodType') || 'Blood Type'}</MenuItem>
                    <MenuItem value="dob">{t('staff.dob') || 'Date of Birth'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  startIcon={<FilterList />}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                {t('staff.donors') || 'Donors'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('staff.showingResults') || 'Showing'} {filteredDonors.length} {t('staff.of') || 'of'} {donors.length} {t('staff.donors') || 'donors'}
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  sx={{ bgcolor: '#d32f2f' }} 
                  onClick={() => handleOpen()}
                >
                  {t('staff.addDonor') || 'Add Donor'}
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('staff.name') || 'Name'}</TableCell>
                    <TableCell>{t('staff.email') || 'Email'}</TableCell>
                    <TableCell>{t('staff.phone') || 'Phone'}</TableCell>
                    <TableCell>{t('staff.bloodType') || 'Blood Type'}</TableCell>
                    <TableCell>{t('staff.dob') || 'Date of Birth'}</TableCell>
                    <TableCell align="right">{t('staff.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDonors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {searchTerm || bloodTypeFilter !== 'ALL' 
                          ? (t('staff.noMatchingDonors') || 'No matching donors found') 
                          : (t('common.noData') || 'No data')}
                      </TableCell>
                    </TableRow>
                  ) : filteredDonors.map((donor) => (
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
              {editDonor ? null : (
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label={t('staff.password') || 'Password'}
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
              )}
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